import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";
import store from "@/store";
import { LayoutMenuItem, RouteItem } from "@/types";
import { initPermission } from "./permission";

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
        meta: { hidden: true, title: "请登陆" },
    }, {
        path: "/404",
        name: "page-404",
        component: () => import("../views/page-404.vue"),
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
        meta: { title: "首页", icon: "excel" }, 
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
                meta: { title: "多级菜单嵌套", icon: "tree-table" },
                component: () => import("../views/example/nested.vue"),
                children: [
                    {
                        path: "/nested/menu-1",
                        name: "nested/menu-1",
                        meta: { title: "菜单 2-1", icon: "tree" },
                        component: () => import("../views/example/menu-1.vue")
                    },
                    {
                        path: "/nested/menu-2",
                        name: "nested/menu-2",
                        meta: { title: "菜单 2-2", icon: "tree" },
                        component: () => import("../views/example/menu-2.vue")
                    },
                    {
                        path: "/nested/three-level",
                        name: "nested/three-level",
                        meta: { title: "三级菜单", icon: "tree" },
                        redirect: "/nested/three-level/menu-1",
                        component: () => import("../views/example/nested.vue"),
                        children: [
                            {
                                path: "/nested/three-level/menu-1",
                                name: "/nested/three-level/menu-1",
                                meta: { title: "菜单 3-1", icon: "tree" },
                                component: () => import("../views/example/menu-1.vue")
                            },
                            {
                                path: "/nested/three-level/menu-2",
                                name: "/nested/three-level/menu-2",
                                meta: { title: "菜单 3-2", icon: "tree" },
                                component: () => import("../views/example/menu-2.vue")
                            },
                        ]
                    },
                ]
            },
            {
                path: "/upload",
                name: "upload",
                meta: { title: "上传图片", icon: "international" },
                component: () => import("../views/example/upload.vue")
            }
        ]
    },
    {
        path: "/" + store.projectInfo.link,
        link: store.projectInfo.link,
        name: "baidu",
        component: () => import("../views/example/home.vue"), // 这里必需给一个组件
        auth: [0],
        meta: {
            icon: "star",
            title: "跳转外部链接"
        }
    }
];

/**
 * 过滤掉侧边导航栏不显示的路由
 * @param array 路由列表
 */
export function filterHidden(array: Array<RouteItem>) {
    array = JSON.parse(JSON.stringify(array));
    const result: Array<LayoutMenuItem> = [];
    for (let i = 0; i < array.length; i++) {
        const item = array[i] as LayoutMenuItem;
        item.isOpen = false;
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