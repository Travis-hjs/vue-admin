import { router, base, admin, editor } from "./index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import apiUser from "../api/user";
import store from "../store";

// NProgress.configure({ showSpinner: false });

// 权限管理
router.beforeEach((to, from, next) => {
    NProgress.start();

    /** 缓存信息 */
    const userInfo = store.userStateInfo || apiUser.fetchUserState();

    if (userInfo && userInfo.accessToken) {
        if (store.addRouters.length > 0) {
            next();
        } else {
            switch (userInfo.loginType) {
                case 1:
                    store.addRouters = admin;
                    break;
            
                case 2:
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
    
    if (to.meta.title) {
        document.title = to.meta.title
    }
})