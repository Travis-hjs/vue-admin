import Layout from "@/layout/index.vue";
import store from "@/store";
import Page404 from "@/views/page-404.vue";
import type { RouteItem } from "./types";

/**
 * 获取组件并设置组件名称
 * - 用于便捷操作，不需要在对应文件定义`name`
 * @param path 组件文件路径
 * @param name 组件名称
 */
async function getComponent(path: string, name: string) {
  const res = await import(path);
  res.default.name = name;
  return res;
}

/**
 * 动态路由
 */
export const dynamicRouters: Array<RouteItem> = [
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
        component: getComponent("../views/example/home.vue", "home")
      },
      {
        path: "/nested",
        name: "nested",
        redirect: "/nested/menu-1",
        meta: { title: "多级菜单嵌套", icon: "tdesign:tree-square-dot", keepAlive: true },
        component: () => import("../views/example/nested.vue"),
        children: [
          {
            path: "/nested/menu-1",
            name: "nested/menu-1",
            meta: { title: "el-plus 表格", keepAlive: true },
            component: getComponent("../views/example/menu-1.vue", "nested/menu-1")
          },
          {
            path: "/nested/menu-2",
            name: "nested/menu-2",
            meta: { title: "el-plus 表单验证", keepAlive: true },
            component: getComponent("../views/example/menu-2.vue", "nested/menu-2")
          },
          {
            path: "/nested/three-level",
            name: "nested/three-level",
            meta: { title: "三级菜单", keepAlive: true },
            redirect: "nested/three-level/menu-1",
            component: getComponent("../views/example/nested.vue", "nested/three-level"),
            children: [
              {
                path: "/nested/three-level/menu-1",
                name: "nested/three-level/menu-1",
                meta: { title: "菜单 3-1", keepAlive: true },
                component: getComponent("../views/example/menu-1.vue", "nested/three-level/menu-1")
              },
              {
                path: "/nested/three-level/menu-2",
                name: "nested/three-level/menu-2",
                meta: { title: "菜单 3-2", keepAlive: true },
                component: getComponent("../views/example/menu-2.vue", "nested/three-level/menu-2")
              },
            ]
          },
          {
            path: "/nested/four-level",
            name: "nested/four-level",
            meta: { title: "三级菜单-2", keepAlive: true },
            redirect: "/nested/four-level/menu-1",
            component: getComponent("../views/example/nested.vue", "nested/four-level"),
            children: [
              {
                path: "/nested/four-level/menu-1",
                name: "nested/four-level/menu-1",
                meta: { title: "菜单 3-2-1", keepAlive: true },
                component: getComponent("../views/example/menu-1.vue", "nested/four-level/menu-1")
              },
              // {
              //     path: "/nested/four-level/menu-2",
              //     name: "/nested/four-level/menu-2",
              //     meta: { title: "菜单 3-2-2", keepAlive: true },
              //     component: () => import("../views/example/menu-2.vue")
              // },
            ]
          },
          {
            path: "/nested/menu-3",
            name: "nested/menu-3",
            meta: { title: "菜单 2-3", keepAlive: true },
            component: getComponent("../views/example/menu-3.vue", "nested/menu-3")
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
        component: getComponent("../views/example/menu-4.vue", "menu-4")
      }
    ]
  },
  {
    path: "/example",
    name: "example",
    component: Layout,
    meta: { title: "示例页栏目", icon: "tdesign:play-demo", keepAlive: true },
    redirect: "/example/request",
    children: [
      {
        path: "/example/request",
        name: "example-request",
        meta: { title: "http-请求示例", keepAlive: true },
        component: getComponent("../views/example/request.vue", "example-request"),
      },
      {
        path: "/example/components",
        name: "example-components",
        meta: { title: "自定义组件", keepAlive: true },
        component: getComponent("../views/example/the-components.vue", "example-components")
      },
      {
        path: "/example/tsx",
        name: "example-tsx",
        meta: { title: "tsx-示例", keepAlive: true },
        component: getComponent("../views/tsx/example", "example-tsx")
      },
      {
        path: "/example/no-found",
        name: "no-found",
        meta: {
          title: "404 页面",
          link: `${location.origin + location.pathname}#/is-error-path`,
        },
        component: Page404
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
  }
];
