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

/**
 * 重定向到`/404`的路由名
 */
const redirectRouteName = "redirect404";

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

            // 逐个添加进去
            for (let i = 0; i < store.layoutRoute.add.length; i++) {
                const item = store.layoutRoute.add[i];
                router.addRoute(item);
            }

            // 在最后加一个404重定向的路由进去

            // vue 2.x 写法
            // router.addRoute({ path: "*", redirect: "/404" });

            // vue 3.x 之后路由取消了自动匹配，要手动设置匹配方式
            // learn https://my.oschina.net/qinghuo111/blog/4832051
            if (!router.hasRoute(redirectRouteName)) {
                // router.addRoute({ path: "/:catchAll(.*)", name: redirectRouteName, redirect: "/404" });
                // 不重定向到`/404`
                router.addRoute({...base[1], path: "/:catchAll(.*)", name: redirectRouteName });
            }

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
export function openNextPage() {
    router.replace({
        path: routerTo.path,
        query: routerTo.query
    })
}

/** 
 * 移除已添加的路由列表
 * @description 退出登录时用
*/
export function removeRoutes() {
    const list = store.layoutRoute.add;
    for (let i = list.length - 1; i > -1; i--) {
        const item = list[i];
        if (item.name && router.hasRoute(item.name)) {
            router.removeRoute(item.name);
        }
    }
    // 和上面对应的 404
    router.removeRoute(redirectRouteName);
    // 清空路由缓存对象
    store.layoutRoute.add = store.layoutRoute.complete = [];
}
