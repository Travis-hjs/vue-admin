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
router.beforeEach(function(to, from, next) {
    NProgress.start();

    if (store.userInfo.token) {
        if (store.layoutRoute.add.length > 0) {
            next();
        } else {
            switch (store.userInfo.userType) {
                case store.testUserList[0]:
                    store.layoutRoute.add = admin;
                    break;
            
                case store.testUserList[1]:
                    store.layoutRoute.add = editor;
                    break;
            }
            for (let i = 0; i < store.layoutRoute.add.length; i++) {
                const item = store.layoutRoute.add[i];
                router.addRoute(item);
            }
            // 在最后加一个404重定向的路由进去
            // learn https://my.oschina.net/qinghuo111/blog/4832051
            // router.addRoute({ path: "*", redirect: "/404" });
            router.addRoute({ path: "/:catchAll(.*)", redirect: "/404" });
            store.layoutRoute.complete = base.concat(store.layoutRoute.add);
            next({ ...to, replace: true });
        }
    } else {
        if (to.path === "/login") {
            next();
        } else {
            routerTo.path = to.path;
            routerTo.query = to.query;
            next({ path: "/login" });
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