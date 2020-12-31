import { router, base, admin, editor } from "./index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "../store";

// NProgress.configure({ showSpinner: false });

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
            router.addRoutes([{ path: "*", redirect: "/404" }]); // 在最后加一个404重定向的路由进去
            store.completeRouters = base.concat(store.addRouters);
            next({ ...to, replace: true });
        }
    } else {
        if (to.path === store.loginPath) {
            next();
        } else {
            next({ path: store.loginPath });
            NProgress.done();
        }
    }
    // try {
    // } catch (error) {
    //     console.log(error);
    //     next("/404");
    // }
    
});

router.afterEach(to => {
    NProgress.done();
    // 根据路由名动态设置文档的标题
    if (to.meta.title) {
        document.title = to.meta.title
    }
})