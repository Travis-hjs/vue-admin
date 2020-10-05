import { layoutStateType, userState } from "../modules/types";
import { RouteConfig } from "vue-router";

const cacheName = "ModuleLayoutInfo";
export default class ModuleLayout {
    constructor() {
        this.updateLayout();
    }

    /** `layout`操作状态 */
    public layoutState: layoutStateType = {
        sidebarTextTheme: false,
        showSidebarLogo: true,
        fixedHeader: false,
        showSettings: true,
        showHistoryView: true,
        sidebarOpen: true,
        sidebarWithoutAnimation: false,
        historyViews: [],
        device: "desktop",
        theme: "#409EFF"
    }

    /** 动态添加的权限路由 */
    public addRouters: Array<RouteConfig> = [];

    /** (基础路由+动态路由)列表 */
    public completeRouters: Array<RouteConfig> = [];

    /** 用户登录状态信息 */
    public userStateInfo!: userState;

    /** 更新`layout`操作状态 */
    private updateLayout() {
        const value = sessionStorage.getItem(cacheName);
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
            if (key === "historyViews") {
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
        sessionStorage.setItem(cacheName, JSON.stringify(data));
    }

}