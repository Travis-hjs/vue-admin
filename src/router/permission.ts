import router, { base, admin, editor } from "./index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "../store";

// NProgress.configure({ showSpinner: false });

/** 路由初始化时信息对象 */
const routerTo = {
    path: "/",
    query: {}
}

// 权限管理
router.beforeEach((to, from, next) => {
    NProgress.start();

    if (store.userInfo.token) {
        if (store.addRouters.length > 0) {
            next();
        } else {
            switch (store.userInfo.userType) {
                case "admin":
                    store.addRouters = admin;
                    break;
            
                case "editor":
                    store.addRouters = editor;
                    break;
            }
            router.addRoutes(store.addRouters);
            // 在最后加一个404重定向的路由进去
            router.addRoutes([{ path: "*", redirect: "/404" }]);
            store.completeRouters = base.concat(store.addRouters);
            next({ ...to, replace: true });
        }
    } else {
        if (to.path === store.loginPath) {
            next();
        } else {
            routerTo.path = to.path;
            routerTo.query = to.query;
            next({ path: store.loginPath });
            NProgress.done();
        }
    }
    
});

router.afterEach(to => {
    NProgress.done();
    // 根据路由名动态设置文档的标题
    if (to.meta.title) {
        document.title = to.meta.title
    }
})

/**
 * 跳转路由初始化页面 
 * @description 登录成功之后用
*/
export default function openNextPage() {
    router.replace({
        path: routerTo.path,
        query: routerTo.query
    })
}