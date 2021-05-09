import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../layout/index.vue";
import { RouteItem } from "../utils/interfaces";
import { initPermission } from "./permission";

/**
 * 基础路由
 * @description 
 * - `vue-router 4.x`之后路由路径匹配规则改了，不再是只能匹配，所以在定义路由的时候必须要在前面加上`/`
 * - 重定向`redirect`也要加"/"
 * - 子路由`children`里面的路由也是需要基于父级来定义，从下面代码观察一下就会发现规律了
 */
const base: Array<RouteItem> = [
    {
        path: "/login",
        name: "login",
        component: () => import("../views/login.vue"),
        meta: { hidden: true, title: "请登陆" },
    }, {
        path: "/404",
        name: "page-404",
        component: () => import("../views/404.vue"),
        meta: { hidden: true, title: "不存在该页面" },
    }, {
        path: "/401",
        name: "page-401",
        component: () => import("../views/401.vue"),
        meta: { hidden: true, title: "暂无权限访问" },
    }
];

/** 用户类型一路由 */
const admin: Array<RouteItem> = [
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
                component: () => import("../views/pages/home.vue")
            },
            {
                path: "/nested",
                name: "nested",
                redirect: "/nested/menu-1",
                meta: { title: "多级菜单嵌套", icon: "tree-table" },
                component: () => import("../views/pages/nested.vue"),
                children: [
                    {
                        path: "/nested/menu-1",
                        name: "nested/menu-1",
                        meta: { title: "菜单 2-1", icon: "tree" },
                        component: () => import("../views/pages/menu-1.vue")
                    }, {
                        path: "/nested/menu-2",
                        name: "nested/menu-2",
                        meta: { title: "菜单 2-2", icon: "tree" },
                        component: () => import("../views/pages/menu-2.vue")
                    }
                ]
            },
            {
                path: "/the-component",
                name: "the-component",
                meta: { title: "上传图片", icon: "international" },
                component: () => import("../views/pages/the-component.vue")
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
                component: () => import("../views/pages/column-1.vue"),
            }, {
                path: "/column/column-2",
                name: "column/column-2",
                meta: { title: "栏目二", icon: "table" },
                component: () => import("../views/pages/column-2.vue")
            }, {
                path: "/column/tsx",
                name: "tsx-example",
                meta: { title: "tsx-示例", icon: "skill" },
                component: () => import("../views/tsx/example")
            }
        ]
    },
    {
        path: "/request",
        name: "request",
        redirect: "/request/weather",
        meta: { title: "http请求", icon: "guide" },
        component: Layout,
        children: [
            {
                path: "/request/weather",
                name: "request/weather",
                meta: { title: "获取天气数据", icon: "international" },
                component: () => import("../views/pages/http.vue"),
            }
        ]
    },
    {
        path: "/icon",
        component: Layout,
        name: "icon",
        children: [
            {
                path: "/icon/index",
                component: () => import(/* webpackChunkName: "icons" */ "../views/pages/icons.vue"),
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
        path: "/https://github.com/Hansen-hjs/vue-admin/tree/next",
        name: "baidu",
        component: () => import("../views/404.vue"),
        meta: {
            icon: "star",
            title: "跳转外部链接"
        }
    }
]
// ========================== 测试 ==========================
// for (let i = 3; i < 18; i++) {
//     const first = admin[0].children as Array<RouteItem>
//     const second = first[1].children as Array<RouteItem>
//     second.push({
//         path: "menu-" + i,
//         name: "nested/menu-" + i,
//         meta: { title: "菜单 2-" + i, icon: "tree" },
//         component: () => import("../views/pages/menu-1.vue")
//     })
// }

/** 用户类型二路由（懒得整多一份了，直接用上面的） */
const editor = [admin[0]];

/**
 * 路由实例 
 * [文档地址](https://next.router.vuejs.org/introduction.html)
*/
const router = createRouter({
    history: createWebHashHistory(),
    routes: base
})

initPermission(router, {
    base,
    admin,
    editor
})

export default router;
