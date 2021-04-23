import VueRouter from "vue-router";
import { PermissionOptions } from "../utils/interfaces";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "../store";
// NProgress.configure({ showSpinner: false });

/** 路由初始化时信息对象 */
const routerTo = {
    path: "/",
    query: {}
}

/**
 * 路由实例
 * @description 
 * 这里不使用 `import router from "./index.ts"`的原因是因为如果该文件在
 * `src/layout/components/Navbar.vue`文件中导入某个方法的时候，会导致循环引用而产生的`router = undefined`;
 * 原因是文件引用的先后顺序问题，如果有比当前文件过早引用的情况下就会出现这类情况，为了兼容所以使用这种动态变量设置方式
 */
let router: VueRouter;

/**
 * 初始化权限管理
 * @param vueRouter 
 * @param options 路由配置项
 */
export function initPermission(vueRouter: VueRouter, options: PermissionOptions) {
    // 设置路由实例
    router = vueRouter;

    router.beforeEach((to, from, next) => {
        NProgress.start();

        if (store.user.info.token) {
            if (store.layout.addRouters.length > 0) {
                next();
            } else {
                switch (store.user.info.userType) {
                    case "admin":
                        store.layout.addRouters = options.admin;
                        break;
                
                    case "editor":
                        store.layout.addRouters = options.editor;
                        break;
                }
                router.addRoutes(store.layout.addRouters);
                // 在最后加一个404重定向的路由进去
                // router.addRoutes([{ path: "*", redirect: "/404" }]);
                // 不重定向到`/404`
                router.addRoutes([{...options.base[1], name: "page404", path: "*"}]);
                store.layout.completeRouters = options.base.concat(store.layout.addRouters);
                next({ ...to, replace: true });
            }
        } else {
            if (to.path === store.user.loginPath) {
                next();
            } else {
                routerTo.path = to.path;
                routerTo.query = to.query;
                next({ path: store.user.loginPath });
                NProgress.done();
            }
        }
        
    });

    router.afterEach(to => {
        NProgress.done();
        // 根据路由名动态设置文档的标题
        if (to.meta.title) {
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