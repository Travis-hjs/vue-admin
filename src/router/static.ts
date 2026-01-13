import Layout from "@/layout/index.vue";
import store from "@/store";
import Page404 from "@/views/page-404.vue";
import type { RouteItem } from "./types";

/**
 * 静态路由
 */
export const staticRouters: Array<RouteItem> = [
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: Layout,
    meta: { title: "首页", icon: "tdesign:home" },
    children: [
      {
        path: "/home",
        name: "home",
        meta: { title: "首页展示", icon: "tdesign:bookmark-double", keepAlive: true },
        component: () => import("../views/example/home.vue"),
      },
      {
        path: "/nested",
        name: "nested",
        redirect: "/nested/menu-1",
        meta: { title: "多级菜单嵌套", icon: "tdesign:tree-square-dot" },
        component: () => import("../views/example/nested.vue"),
        children: [
          {
            path: "/nested/menu-1",
            name: "nested/menu-1",
            meta: { title: "el-plus 表格", keepAlive: true },
            component: () => import("../views/example/menu-1.vue"),
          },
          {
            path: "/nested/menu-2",
            name: "nested/menu-2",
            meta: { title: "el-plus 表单验证", keepAlive: true },
            component: () => import("../views/example/menu-2.vue"),
          },
          {
            path: "/nested/three-level",
            name: "nested/three-level",
            meta: { title: "三级菜单", keepAlive: true },
            redirect: "nested/three-level/menu-1",
            component: () => import("../views/example/nested.vue"),
            children: [
              {
                path: "/nested/three-level/menu-1",
                name: "nested/three-level/menu-1",
                meta: { title: "菜单 3-1", keepAlive: true },
                component: () => import("../views/example/menu-1.vue"),
              },
              {
                path: "/nested/three-level/menu-2",
                name: "nested/three-level/menu-2",
                meta: { title: "菜单 3-2", keepAlive: true },
                component: () => import("../views/example/menu-2.vue"),
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
                name: "nested/four-level/menu-1",
                meta: { title: "菜单 3-2-1", keepAlive: true },
                component: () => import("../views/example/menu-1.vue"),
              },
              // {
              //     path: "/nested/four-level/menu-2",
              //     name: "/nested/four-level/menu-2",
              //     meta: { title: "菜单 3-2-2", keepAlive: true },
              //     component: () => () => import("/example/menu-2.vue")
              // },
            ]
          },
          {
            path: "/nested/menu-3",
            name: "nested/menu-3",
            meta: { title: "菜单 2-3", keepAlive: true },
            component: () => import("../views/example/menu-3.vue"),
          }
        ]
      },
      {
        path: "/link-baidu",
        name: "link-baidu",
        component: Page404, // 这里必需给一个组件
        meta: {
          title: "百度一下",
          icon: "tdesign:system-search-filled",
          link: "https://www.baidu.com"
        },
      },
      {
        path: "/menu-4",
        name: "menu-4",
        meta: { title: "换行菜单标题换行菜单标题", icon: "tdesign:component-layout", keepAlive: true },
        component: () => import("../views/example/menu-4.vue"),
      }
    ]
  },
  {
    path: "/example",
    name: "example",
    component: Layout,
    meta: { title: "示例页栏目", icon: "tdesign:play-demo" },
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
        meta: { title: "自定义组件", keepAlive: true },
        component: () => import("../views/example/the-components.vue"),
      },
      {
        path: "/example/tsx",
        name: "example-tsx",
        meta: { title: "tsx-示例", keepAlive: true },
        component: () => import("../views/tsx/example"),
      },
      {
        path: "/example/no-found",
        name: "no-found",
        meta: {
          title: "404 页面",
          link: `${location.origin + location.pathname}#/is-error-path`,
        },
        component: Page404
      },
      {
        path: "/example/curd",
        name: "example-curd",
        meta: { title: "curd 低代码" },
        component: () => import("../views/example/curd-page.vue")
      },
      {
        path: "/example/curd-config",
        name: "example-curd-config",
        meta: { title: "curd 低代码配置" },
        component: () => import("../views/example/curd-config.vue")
      },
      {
        path: "/example/table-page",
        name: "example-table-page",
        meta: { title: "通用表格页" },
        component: () => import("../views/example/table-page.vue")
      }
    ]
  },
  {
    path: "/" + store.projectInfo.link,
    name: "GitHub-Travis",
    component: Page404, // 这里必需给一个组件
    meta: {
      title: "项目地址",
      icon: "tdesign:logo-github-filled",
      link: store.projectInfo.link,
      auth: [0],
    }
  },
  {
    path: "/menu",
    name: "menu",
    meta: { title: "菜单管理" },
    component: Layout,
    redirect: "/menu/list",
    children: [
      {
        path: "/menu/list",
        name: "menu-list",
        component: () => import("../views/menu/index.vue"),
        meta: { title: "菜单管理", icon: "tdesign:app" }
      }
    ]
  },
];
