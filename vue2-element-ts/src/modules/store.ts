import { userState, layoutStateType } from './types';
import { RouteConfig } from 'vue-router';

/** 缓存名 */
const layoutName = 'layout-options';

class ModuleStore {
    constructor() {
        this.updateLayout();
    }

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
    public layoutState: layoutStateType = {
        sidebarTextTheme: false,
        showSidebarLogo: true,
        fixedHeader: false,
        showSettings: true,
        showTagsView: true,
        sidebarOpen: true,
        sidebarWithoutAnimation: false,
        cachedViews: [],
        device: 'desktop',
        theme: '#409EFF'
    }

    /** 登录路由路径 */
    readonly loginPath = '/login';

    /** 动态添加的权限路由 */
    public addRouters: Array<RouteConfig> = [];

    /** (基础路由+动态路由)列表 */
    public completeRouters: Array<RouteConfig> = [];

    /** 用户登录状态信息 */
    public userStateInfo!: userState;

    /** 测试用户类型 */
    readonly testUserList = ['admin', 'editor'];

    /** 更新`layout`操作状态 */
    private updateLayout() {
        const value = sessionStorage.getItem(layoutName);
        const data = value ? JSON.parse(value) : null;
        if (data) {
            this.layoutState = data;
        }
    }

    /** 保存`layout`操作状态 */
    public saveLayout() {
        // 这个方法我用在了`Navbar`组件中用`watch`监听了数据的变动然后执行
        // 这里我只是简单做了两层拷贝，只保存要用到的信息就够了
        const value: any = this.layoutState;
        const data: any = {};
        for (const key in value) {
            data[key] = value[key]
            if (key === 'cachedViews') {
                data[key] = value[key].map((item: any) => {
                    return {
                        name: item.name,
                        meta: {...item.meta},
                        path: item.path,
                        fullPath: item.fullPath
                    }
                });
            }
        }
        // console.log(JSON.stringify(data));
        sessionStorage.setItem(layoutName, JSON.stringify(data));
    }
}

/** `store`模块 */
const store = new ModuleStore();

export default store;
