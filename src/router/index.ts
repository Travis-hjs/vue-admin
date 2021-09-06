import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Layout from "../layout/index.vue";
import { RouteItem } from "../types";
import { initPermission } from "./permission";

Vue.use(VueRouter);

/**
 * 基础路由
 */
export const base: Array<RouteItem> = [
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login.vue"),
        meta: { hidden: true, title: "请登陆" },
    }, {
        path: "/404",
        name: "page-404",
        component: () => import("@/views/404.vue"),
        meta: { hidden: true, title: "不存在该页面" },
    }, {
        path: "/401",
        name: "page-401",
        component: () => import("@/views/401.vue"),
        meta: { hidden: true, title: "暂无权限访问" },
    }
];

/**
 * 动态路由
 */
export const add: Array<RouteItem> = [
    {
        path: "/",
        name: "index",
        redirect: "/home",
        component: Layout,
        meta: { title: "首页", icon: "excel" }, 
        children: [
            {
                path: "/home",
                meta: { title: "首页展示", icon: "guide" },
                component: () => import("@/views/example/home.vue")
            },
            {
                path: "/nested",
                name: "nested",
                redirect: "/nested/menu-1",
                meta: { title: "多级菜单嵌套", icon: "tree-table" },
                component: () => import("@/views/example/nested.vue"),
                children: [
                    {
                        path: "/nested/menu-1",
                        name: "nested/menu-1",
                        meta: { title: "菜单 2-1", icon: "tree" },
                        component: () => import("@/views/example/menu-1.vue")
                    }, {
                        path: "/nested/menu-2",
                        name: "nested/menu-2",
                        meta: { title: "菜单 2-2", icon: "tree" },
                        component: () => import("@/views/example/menu-2.vue")
                    }
                ]
            },
            {
                path: "/the-component",
                name: "the-component",
                meta: { title: "上传图片", icon: "international" },
                component: () => import("@/views/example/the-component.vue")
            }
        ]
    },
    {
        path: "/column",
        name: "column",
        redirect: "/column/column-1",
        meta: { title: "栏目", icon: "dashboard" },
        component: Layout,
        children: [
            {
                path: "/column/column-1",
                name: "column/column-1",
                meta: { title: "栏目一", icon: "theme" },
                auth: [0],
                component: () => import("@/views/example/column-1.vue"),
            }, {
                path: "/column/column-2",
                name: "column/column-2",
                meta: { title: "栏目二", icon: "table" },
                component: () => import("@/views/example/column-2.vue")
            }
        ]
    },
    {
        path: "/excel",
        name: "excel",
        redirect: "/excel/export",
        meta: { title: "excel表格", icon: "excel" },
        component: Layout,
        children: [
            {
                path: "export",
                name: "export-excel",
                meta: { title: "导出excel", icon: "excel" },
                component: () => import("@/views/excel/exportExcel.vue"),
            },
            {
                path: "merge",
                name: "export-merge",
                meta: { title: "导出多级表头", icon: "excel" },
                component: () => import("@/views/excel/exportMergeExcel.vue"),
            },
            {
                path: "import",
                name: "import-excel",
                meta: { title: "导入excel", icon: "excel" },
                component: () => import("@/views/excel/importExcel.vue"),
            },
        ]
    },
    {
        path: "/richtext",
        name: "richtext",
        redirect: "/richtext/home",
        meta: { title: "富文本", icon: "component" },
        component: Layout,
        children: [
            {
                path: "home",
                name: "richtext-home",
                meta: { title: "富文本", icon: "component" },
                component: () => import("@/views/richtext/index.vue"),
            }
        ]
    },
    {
        path: "/chart",
        name: "chart",
        redirect: "/chart/home",
        meta: { title: "Echarts", icon: "component" },
        component: Layout,
        children: [
            {
                path: "home",
                name: "chart-home",
                meta: { title: "图表", icon: "chart" },
                component: () => import("@/views/chart/index.vue"),
            }
        ]
    },
    {
        path: "/request",
        name: "request",
        redirect: "/request/weather",
        meta: { title: "http请求", icon: "guide" },
        auth: [0],
        component: Layout,
        children: [
            {
                path: "/request/weather",
                name: "request/weather",
                meta: { title: "获取天气数据", icon: "international" },
                component: () => import("@/views/example/http.vue"),
            }
        ]
    },
    {
        path: "/icon",
        auth: [0],
        component: Layout,
        children: [
            {
                path: "/icon/index",
                component: () => import(/* webpackChunkName: "icons" */ "@/views/example/icons.vue"),
                name: "Icons",
                meta: {
                    title: "icons",
                    icon: "icon",
                    noCache: true
                }
            }
        ]
    },
    {
        path: store.projectInfo.link,
        auth: [0],
        meta: {
            icon: "star",
            title: "跳转外部链接"
        }
    }
]

// ========================== 测试 ==========================
// for (let i = 3; i < 18; i++) {
//     const first = add[0].children as Array<RouteItem>
//     const second = first[1].children as Array<RouteItem>
//     second.push({
//         path: "menu-" + i,
//         name: "nested/menu-" + i,
//         meta: { title: "菜单 2-" + i, icon: "tree" },
//         component: () => import("@/views/example/menu-1.vue")
//     })
// }

/** `VueRouter`路由实例化对象 */
const router = new VueRouter({
    routes: base
});

initPermission(router, base, add)

export default router;
