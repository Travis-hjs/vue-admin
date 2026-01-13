import store from "../store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import type { Router } from "vue-router";
import { staticRouters } from "./static";
import type { RouteItem } from "./types";
import { isType } from "@/utils";

// NProgress.configure({ showSpinner: false });

/** 路由初始化时信息对象 */
const routerTo = {
  path: "/",
  query: {}
}

/**
 * 重定向到`/404`的路由名
 */
const redirectRouteName = "redirect404";

/**
 * 路由实例
 * @description 
 * 这里不使用 `import router from "./index.ts"`的原因是因为如果该文件在
 * `src/layout/components/Navbar.vue`文件中导入某个方法的时候，会导致循环引用而产生的`router = undefined`;
 * 原因是文件引用的先后顺序问题，如果有比当前文件过早引用的情况下就会出现这类情况，为了兼容所以使用这种动态变量设置方式
 */
let router: Router;

/**
 * 处理权限路由列表
 * @param routes 
 */
function handleAuth(routes: Array<RouteItem>) {
  const list: Array<RouteItem> = [];
  const userType = store.user.info.type as number;
  for (let i = 0; i < routes.length; i++) {
    const item = routes[i];
    const auth = item.meta ? item.meta.auth : undefined;
    if (!auth || (auth && auth.includes(userType))) {
      if (item.children && item.children.length > 0) {
        item.children = handleAuth(item.children);
      }
      list.push(item);
    }
  }
  return list;
}

/**
 * 获取组件并设置组件名称
 * - 用于便捷操作，不需要在对应文件定义`name`
 * @param fn 获取组件异步函数
 * @param name 组件名称
 */
async function getComponent(component: Promise<any>, name: string) {
  const res = await component;
  if (!res.default.name) {
    res.default.name = name;
  }
  return res;
}

/**
 * 递归处理路由
 * @param list 
 */
function eachRouter(list: Array<RouteItem>) {
  list.forEach(item => {
    const { meta, component, name, children } = item;
    if (meta.keepAlive && isType(component, "promise")) {
      if (name) {
        item.component = () => getComponent(component, name);
      } else {
        console.warn("当前路由需要设置 name 属性才能实现缓存功能：", item);
      }
    }
    if (children && children.length > 0) {
      eachRouter(children);
    }
  });
}

// /**
//  * 递归处理接口动态路由
//  * @param item 
//  */
// function eachRouter(item: RouteItem, components: Record<string, () => Promise<any>>) {
//   const path = item.component;
//   if (isType(path, "string")) {
//     if (path) {
//       // item.component = () => import(`@/views/${path}.vue`);
//       item.component = components[`/src/views/${path}.vue`];
//     } else {
//       item.component = Layout;
//     }
//   }
//   // 当没有路由名称时，自动设置一个
//   if (!item.name) {
//     item.name = item.component?.name;
//   }
//   if (item.children && item.children.length) {
//     item.children.forEach(sub => eachRouter(sub, components));
//   }
// }

/**
 * 处理权限路由列表
 * - 这里可以做获取动态路由处理，比如通过接口请求，然后返回的权限列表
 */
async function getDynamic() {
  // TODO: 通过接口加载路由操作
  // 这里不要放到函数之外，理由是文件过多时，会占用内存，
  // 而放在函数内部中，用完就给销毁了，所以不存在占用内存问题
  // const modules = import.meta.glob("@/views/**/**.vue");
  // let list: Array<RouteItem> = [];
  // const res = await getUserRouters()
  // if (res.code === 1) {
  //   list = res.data.list;
  //   list.forEach(item => eachRouter(item, modules));
  // }
  // return list;

  // TODO: 静态路由操作
  const list = handleAuth(staticRouters);
  eachRouter(list);
  return list;
}

/**
 * 初始化权限管理
 * @param vueRouter 路由实例
 * @param baseRoutes 基础路由
 */
export function initPermission(vueRouter: Router, baseRoutes: Array<RouteItem>) {
  // 设置路由实例
  router = vueRouter;

  router.beforeEach(async function (to, from, next) {
    NProgress.start();

    if (store.user.info.token) {
      if (store.layout.addRouters.length > 0) {
        next();
      } else {
        store.layout.addRouters = await getDynamic();

        // 逐个添加进去
        for (let i = 0; i < store.layout.addRouters.length; i++) {
          const item = store.layout.addRouters[i];
          router.addRoute(item);
        }

        // 在最后加一个404重定向的路由进去
        // learn https://my.oschina.net/qinghuo111/blog/4832051
        if (!router.hasRoute(redirectRouteName)) {
          // router.addRoute({ path: "/:catchAll(.*)", name: redirectRouteName, redirect: "/404" });
          // 不重定向到`/404`
          router.addRoute({ ...baseRoutes[1], path: "/:catchAll(.*)", name: redirectRouteName });
        }

        store.layout.completeRouters = baseRoutes.concat(store.layout.addRouters);

        next({ ...to, replace: true });
      }
    } else {
      if (to.path === "/login") {
        next();
      } else {
        routerTo.path = to.path;
        routerTo.query = to.query;
        next({ path: "/login" });
        NProgress.done();
      }
    }

  });

  router.afterEach(to => {
    NProgress.done();
    // 根据路由名动态设置文档的标题
    if (to.meta && to.meta.title) {
      document.title = to.meta.title as string;
    }
  })
}

/**
 * 跳转路由初始化页面 
 * @description 登录成功之后用
*/
export function openNextPage() {
  router.replace({
    path: routerTo.path,
    query: routerTo.query
  })
}

/** 
 * 移除已添加的路由列表
 * @description 退出登录时用
*/
export function removeRoutes() {
  const list = store.layout.addRouters;
  for (let i = list.length - 1; i > -1; i--) {
    const item = list[i];
    if (item.name && router.hasRoute(item.name)) {
      router.removeRoute(item.name);
    }
  }
  routerTo.path = "/";
  routerTo.query = {};
  // 和上面对应的 404
  router.removeRoute(redirectRouteName);
  // 清空路由缓存对象
  store.layout.addRouters = store.layout.completeRouters = [];
}
