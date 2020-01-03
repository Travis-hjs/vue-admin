import { router, admin, editor } from './index';
import apiUser from '../api/user';
import store from '../modules/store';

// 权限管理
router.beforeEach((to, from, next) => {

    /** 缓存信息 */
    const userInfo = store.userStateInfo || apiUser.fetchUserState();

    if (userInfo && userInfo.accessToken) {
        if (to.path === store.loginPath) {
            next({ path: '/' });
        } else {
            if (store.addRouters.length > 0) {
                next();
            } else {
                switch (userInfo.loginType) {
                    case 1:
                        store.addRouters = admin;
                        router.addRoutes(admin);
                        break;
                
                    case 2:
                        store.addRouters = editor;
                        router.addRoutes(editor);
                        break;
                }
                next({ ...to, replace: true });
                // console.log(router);
            }
        }
    } else {
        if (to.path === store.loginPath) {
            next();
        } else {
            next({ path: store.loginPath });
        }
    }

})