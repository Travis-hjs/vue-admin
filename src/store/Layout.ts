import { ModuleModifyObject } from "./ModifyObject";
import {
    LayoutStateType,
    RouteItem,
    LayoutStateKeys,
} from "../modules/interfaces";

const cacheName = "ModuleLayoutInfo";
export default class ModuleLayout extends ModuleModifyObject {
    constructor() {
        super();
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
        sidebarWithoutAnimation: false,
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
            this.modifyData(this.layoutState, value);
        }
    }

    /** 保存`layout`操作状态 */
    public saveLayout() {
        // 这个方法我用在了`Navbar`组件中用`watch`监听了数据的变动然后执行
        // 这里我只是简单做了两层拷贝，只保存要用到的信息就够了
        const value = this.layoutState;
        const data: any = {};
        for (const key in value) {
            const k = key as LayoutStateKeys;
            if (k === "historyViews") {
                data[k] = value[k].map(item => {
                    return {
                        name: item.name,
                        meta: {...item.meta},
                        path: item.path,
                        // fullPath: item.fullPath || ""
                    }
                });
            } else {
                data[k] = value[k];
            }
        }
        // console.log(JSON.stringify(data));
        sessionStorage.setItem(cacheName, JSON.stringify(data));
    }

}