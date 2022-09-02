import { Router } from "vue-router";
import store from "../store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { RouteItem } from "@/types";

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
    if (!item.auth || (item.auth && item.auth.includes(userType))) {
      if (item.children && item.children.length > 0) {
        item.children = handleAuth(item.children);
      }
      list.push(item);
    }
  }
  return list;
}

/**
 * 初始化权限管理
 * @param vueRouter 路由实例
 * @param baseRoutes 基础路由
 * @param addRoutes 动态路由
 */
export function initPermission(vueRouter: Router, baseRoutes: Array<RouteItem>, addRoutes: Array<RouteItem>) {
  // 设置路由实例
  router = vueRouter;

  router.beforeEach(function (to, from, next) {
    NProgress.start();

    if (store.user.info.token) {
      if (store.layout.addRouters.length > 0) {
        next();
      } else {
        store.layout.addRouters = handleAuth(addRoutes);

        // 逐个添加进去
        for (let i = 0; i < store.layout.addRouters.length; i++) {
          const item = store.layout.addRouters[i];
          router.addRoute(item);
        }

        // 在最后加一个404重定向的路由进去

        // vue 2.x 写法
        // router.addRoute({ path: "*", redirect: "/404" });

        // vue 3.x 之后路由取消了自动匹配，要手动设置匹配方式
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
