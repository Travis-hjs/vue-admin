import { router, admin1, admin2 } from './index';
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
                        router.addRoutes(admin1);
                        store.addRouters = admin1;
                        break;
                
                    case 2:
                        router.addRoutes(admin2);
                        store.addRouters = admin2;
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