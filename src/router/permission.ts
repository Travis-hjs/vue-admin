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
 * 404的路径匹配
 * @learn https://my.oschina.net/qinghuo111/blog/4832051
 */
const path404 = "/:catchAll(.*)";

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
            if (router.hasRoute(path404)) {
                router.addRoute({ path: path404, redirect: "/404" });
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
 * @description 不知道为什么在`src/layout/components/Navbar.vue`文件中使用`import { removeRoutes } from "../../router/permission"`;
 * 会导致`router`为`undefined`，所以暂时不使用
*/
export function removeRoutes() {
    const list = store.layoutRoute.add;
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (router.hasRoute(item.path)) {
            router.removeRoute(item.path);
        }
    }
    // 和上面对应的 404
    router.removeRoute(path404);
    // 清空缓存对象
    store.layoutRoute.add = store.layoutRoute.complete = [];
}