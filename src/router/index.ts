import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";
import store from "@/store";
import type { RouteItem } from "@/types";
import { initPermission } from "./permission";
import Page404 from "@/views/page-404.vue";

/**
 * 基础路由
 * @description 
 * - `vue-router 4.x`之后路由路径匹配规则改了，不再是智能匹配，所以在定义路由的时候必须要在前面加上`/`
 * - 重定向`redirect`也要加"/"
 * - 子路由`children`里面的路由也是需要基于父级来定义，从下面代码观察一下就会发现规律了
 */
const base: Array<RouteItem> = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login.vue"),
    meta: { hidden: true, title: "请登录" },
  }, {
    path: "/404",
    name: "page-404",
    component: Page404,
    meta: { hidden: true, title: "不存在该页面" },
  }, {
    path: "/401",
    name: "page-401",
    component: () => import("../views/page-401.vue"),
    meta: { hidden: true, title: "暂无权限访问" },
  }
];

/**
 * 动态路由
 */
const add: Array<RouteItem> = [
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: Layout,
    meta: { title: "首页", icon: "home" },
    children: [
      {
        path: "/home",
        meta: { title: "首页展示", icon: "guide" },
        component: () => import("../views/example/home.vue")
      },
      {
        path: "/nested",
        name: "nested",
        redirect: "/nested/menu-1",
        meta: { title: "多级菜单嵌套", icon: "tree" },
        component: () => import("../views/example/nested.vue"),
        children: [
          {
            path: "/nested/menu-1",
            name: "nested/menu-1",
            meta: { title: "el-plus 表格" },
            component: () => import("../views/example/menu-1.vue")
          },
          {
            path: "/nested/menu-2",
            name: "nested/menu-2",
            meta: { title: "el-plus 表单验证" },
            component: () => import("../views/example/menu-2.vue")
          },
          {
            path: "/nested/three-level",
            name: "nested/three-level",
            meta: { title: "三级菜单" },
            redirect: "/nested/three-level/menu-1",
            component: () => import("../views/example/nested.vue"),
            children: [
              {
                path: "/nested/three-level/menu-1",
                name: "/nested/three-level/menu-1",
                meta: { title: "菜单 3-1" },
                component: () => import("../views/example/menu-1.vue")
              },
              {
                path: "/nested/three-level/menu-2",
                name: "/nested/three-level/menu-2",
                meta: { title: "菜单 3-2" },
                component: () => import("../views/example/menu-2.vue")
              },
            ]
          },
          {
            path: "/nested/four-level",
            name: "nested/four-level",
            meta: { title: "三级菜单-2" },
            redirect: "/nested/four-level/menu-1",
            component: () => import("../views/example/nested.vue"),
            children: [
              {
                path: "/nested/four-level/menu-1",
                name: "/nested/four-level/menu-1",
                meta: { title: "菜单 3-2-1" },
                component: () => import("../views/example/menu-1.vue")
              },
              // {
              //     path: "/nested/four-level/menu-2",
              //     name: "/nested/four-level/menu-2",
              //     meta: { title: "菜单 3-2-2" },
              //     component: () => import("../views/example/menu-2.vue")
              // },
            ]
          },
          {
            path: "/nested/menu-3",
            name: "nested/menu-3",
            meta: { title: "菜单 2-3" },
            component: () => import("../views/example/menu-3.vue")
          }
        ]
      },
      {
        path: "/link-baidu",
        name: "link-baidu",
        component: Page404, // 这里必需给一个组件
        meta: {
          title: "百度一下",
          icon: "baidu",
          link: "https://www.baidu.com"
        },
      },
      {
        path: "/menu-4",
        name: "menu-4",
        meta: { title: "换行菜单标题换行菜单标题", icon: "nested" },
        component: () => import("../views/example/menu-4.vue")
      }
    ]
  },
  {
    path: "/example",
    name: "example",
    component: Layout,
    meta: { title: "示例页栏目", icon: "menu" },
    redirect: "/example/request",
    children: [
      {
        path: "/example/request",
        name: "example-request",
        meta: { title: "http-请求示例", keepAlive: true },
        component: () => import("../views/example/request.vue"),
      },
      {
        path: "/example/components",
        name: "example-components",
        meta: { title: "自定义组件" },
        component: () => import("../views/example/the-components.vue")
      },
      {
        path: "/example/tsx",
        name: "example-tsx",
        meta: { title: "tsx-示例" },
        component: () => import("../views/tsx/example")
      }
    ]
  },
  {
    path: "/icon",
    name: "icon",
    meta: { title: "图标栏目", auth: [0], },
    component: Layout,
    redirect: "/icon/svg-icons",
    children: [
      {
        path: "/icon/svg-icons",
        name: "svg-icons",
        component: () => import(/* webpackChunkName: "icons" */ "../views/svg-icons/index.vue"),
        meta: { title: "svg-图标", icon: "svg-icon" }
      }
    ]
  },
  {
    path: "/" + store.projectInfo.link,
    name: "GitHub-Travis",
    component: Page404, // 这里必需给一个组件
    meta: {
      title: "项目地址",
      icon: "github",
      link: store.projectInfo.link,
      auth: [0],
    }
  }
];

/**
 * 过滤掉侧边导航栏不显示的路由
 * @param array 路由列表
 */
export function filterHidden(array: Array<RouteItem>) {
  array = JSON.parse(JSON.stringify(array));
  const result: Array<RouteItem> = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (!item.meta || (item.meta && !item.meta.hidden)) {
      result.push(item);
      if (item.children && item.children.length > 0) {
        item.children = filterHidden(item.children);
      }
    }
  }
  return result;
}

/**
 * 路由实例 
 * [文档地址](https://next.router.vuejs.org/introduction.html)
*/
const router = createRouter({
  history: createWebHashHistory(),
  routes: base
})

initPermission(router, base, add);

export default router;