import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { routeItem } from '../modules/types';
import store from '../modules/store';
import Layout from '../layout/index.vue';
import Login from '../views/login.vue';
import Page404 from '../views/404.vue';
import Page401 from '../views/401.vue';

Vue.use(VueRouter);

const base: Array<routeItem> = [
    {
        path: store.loginPath,
        name: 'login',
        component: () => import('@/views/login.vue'),
        hidden: true,
    }, {
        path: '/404',
        name: 'page-404',
        component: () => import('@/views/404.vue'),
        hidden: true,
    }, {
        path: '/401',
        name: 'page-401',
        component: () => import('@/views/401.vue'),
        hidden: true,
    }
];

export const admin: Array<routeItem> = [
    {
        path: '/',
        name: 'home',
        component: Layout,
        hidden: false,
        meta: { title: '首页', icon: 'excel' }, 
        children: [
            {
                path: 'about',
                meta: { title: '选项一', icon: 'international' },
                component: () => import('../views/About.vue'),
                children: [
                    {
                        path: 'about',
                        meta: { title: '2-1', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-2', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-1', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-2', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-1', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-2', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-1', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-2', icon: 'international' },
                        component: Page404
                    }
                ]
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }
        ]
    },
    {
        path: '/about',
        name: 'about',
        meta: { title: '栏目', icon: 'excel' }, 
        component: Layout,
        // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        children: [
            {
                path: 'about',
                meta: { title: '选项一', icon: 'international' },
                component: () => import('../views/About.vue'),
                children: [
                    {
                        path: 'about',
                        meta: { title: '2-1', icon: 'international' },
                        component: Page404
                    }, {
                        path: 'about',
                        meta: { title: '2-2', icon: 'international' },
                        component: Page404
                    }
                ]
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: Page404
            }
        ]
    }
]

export const editor: Array<routeItem> = [
    {
        path: '/',
        name: 'home',
        component: Layout
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

export const router = new VueRouter({
    routes: base
});

