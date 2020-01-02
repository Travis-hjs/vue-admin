import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../modules/store';
import Layout from '../layout/index.vue';
import Login from '../views/login.vue';
import Page404 from '../views/404.vue';
import Page401 from '../views/401.vue';

Vue.use(VueRouter);

const base = [
    {
        path: store.loginPath,
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: { hidden: true }
    }, {
        path: '/404',
        name: 'page-404',
        component: () => import('@/views/404.vue'),
        meta: { hidden: true }
    }, {
        path: '/401',
        name: 'page-401',
        component: () => import('@/views/401.vue'),
        meta: { hidden: true }
    }
];

export const admin1 = [
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
                component: () => import('../views/About.vue')
            }, {
                path: 'about',
                meta: { title: '选项二', icon: 'guide' },
                component: () => import('../views/About.vue')
            }
        ]
    },
    {
        path: '/about',
        name: 'about',
        meta: { title: '栏目', icon: 'excel' }, 
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

export const admin2 = [
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

