import { userState, routeItem, layoutStateType } from './types';

class ModuleStore {
    /** 页面图片资源 */
    readonly pageImage = {
        /** 404图片 */
        image404: require('@/assets/404-images/404.png'),
        /** 404（云朵）图片 */
        image404cloud: require('@/assets/404-images/404-cloud.png'),
        /** 401gif */
        image401: require('@/assets/401-images/401.gif'),
        /** 跳舞gif */
        image401ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646'
    }

    /** `layout`操作状态 */
    readonly layoutState: layoutStateType = {
        sidebarOpen: true,
        sidebarWithoutAnimation: false,
        cachedViews: [],
        device: 'desktop',
    }

    /** 登录路由路径 */
    readonly loginPath = '/login';

    /** 动态添加的权限路由 */
    public addRouters: Array<routeItem> = [];

    /** 用户登录状态信息 */
    public userStateInfo!: userState;

    /** 测试用户类型 */
    readonly testUserList = ['admin', 'editor'];

}

/** `store`模块 */
const store = new ModuleStore();

export default store;
