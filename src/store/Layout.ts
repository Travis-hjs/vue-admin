import utils from "../utils";
import {
    LayoutStateType,
    RouteItem
} from "../utils/interfaces";

const cacheName = "ModuleLayoutInfo";
export default class ModuleLayout {
    constructor() {
        this.initLayout();
    }

    /** `layout`操作状态 */
    public readonly layoutState: LayoutStateType = {
        sidebarTextTheme: false,
        showSidebarLogo: true,
        fixedHeader: false,
        showSettings: true,
        showHistoryView: true,
        sidebarOpen: true,
        historyViews: [],
        device: "desktop",
        theme: "#409EFF"
    }

    /** 动态添加的权限路由 */
    public addRouters: Array<RouteItem> = [];

    /** (基础路由+动态路由)列表 */
    public completeRouters: Array<RouteItem> = [];

    /** 初始化`layout`操作状态 */
    private initLayout() {
        const cacheInfo = sessionStorage.getItem(cacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            utils.modifyData(this.layoutState, value);
        }
    }

    /**
     * 保存`layout`操作状态
     * @description 这个方法我用在了`src/layout/index.vue`组件中用`watch`监听了数据的变动然后执行
    */
    public saveLayout() {
        // 这里我只是简单做了两层拷贝，只保存要用到的信息就够了
        const value = this.layoutState;
        const data: any = {};
        for (const key in value) {
            if (key === "historyViews") {
                data[key] = value["historyViews"].map(item => {
                    return {
                        name: item.name,
                        meta: {...item.meta},
                        path: item.path,
                        // fullPath: item.fullPath || ""
                    }
                });
            } else {
                data[key] = value[key as keyof LayoutStateType];
            }
        }
        // console.log(JSON.stringify(data));
        sessionStorage.setItem(cacheName, JSON.stringify(data));
    }

}