import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '../modules/store';
import Layout from '../layout/index.vue';

Vue.use(VueRouter);

/**
 * 基础路由
 * learn: https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html
 */
export const base: Array<RouteConfig> = [
    {
        path: store.loginPath,
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: { hidden: true },
    }, {
        path: '/404',
        name: 'page-404',
        component: () => import('@/views/404.vue'),
        meta: { hidden: true, title: '不存在该页面' },
    }, {
        path: '/401',
        name: 'page-401',
        component: () => import('@/views/401.vue'),
        meta: { hidden: true, title: '暂无权限访问' },
    }
];

/** 用户类型一路由 */
export const admin: Array<RouteConfig> = [
    {
        path: '/',
        name: 'index',
        redirect: '/home',
        component: Layout,
        meta: { title: '首页', icon: 'excel' }, 
        children: [
            {
                path: 'home',
                meta: { title: '首页展示', icon: 'guide' },
                component: () => import('../views/pages/page-1.vue')
            },
            {
                path: 'class',
                name: 'class',
                meta: { title: '多级菜单', icon: 'tree-table' },
                component: () => import('../views/pages/page-2.vue'),
                children: [
                    {
                        path: 'class1',
                        name: 'class/2-1',
                        meta: { title: 'class/2-1', icon: 'tree' },
                        component: () => import('../views/pages/page-3.vue')
                    }, {
                        path: 'class2',
                        name: 'class/2-2',
                        meta: { title: 'class/2-2', icon: 'tree' },
                        component: () => import('../views/pages/page-4.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '/column',
        name: 'column',
        redirect: '/column/column1',
        meta: { title: '栏目', icon: 'dashboard' }, 
        component: Layout,
        children: [
            {
                path: 'column1',
                name: 'column1',
                meta: { title: '栏目一', icon: 'theme' },
                component: () => import('../views/pages/page-5.vue'),
            }, {
                path: 'column2',
                name: 'column2',
                meta: { title: '栏目二', icon: 'table' },
                component: () => import('../views/pages/page-6.vue')
            }
        ]
    },
    {
        path: '/icon',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import(/* webpackChunkName: "icons" */ '../views/pages/icons.vue'),
                name: 'Icons',
                meta: {
                    title: 'icons',
                    icon: 'icon',
                    noCache: true
                }
            }
        ]
    }
]

/** 用户类型二路由（懒得整多一份了，直接用上面的） */
export const editor = admin;

export const router = new VueRouter({
    routes: base
});

