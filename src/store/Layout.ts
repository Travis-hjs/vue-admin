import utils from "../utils";
import {
    LayoutState,
    RouteItem
} from "../utils/interfaces";

import elementVariables from "../styles/element-variables.scss";

const cacheName = "ModuleLayout";

/**
 * `layout`状态管理模块
 */
export default class ModuleLayout {
    constructor() {
        this.init();
    }

    /** 动态添加的权限路由 */
    addRouters: Array<RouteItem> = [];
 
    /** (基础路由+动态路由)列表 */
    completeRouters: Array<RouteItem> = [];

    /**
     * 默认主题颜色
     * @description `/styles/element-variables.scss`中的`$--color-primary`
     */
    readonly defaultTheme = elementVariables.theme;

    /** `layout`操作状态 */
    readonly state: LayoutState = {
        sidebarTextTheme: false,
        showSidebarLogo: true,
        fixedHeader: true,
        showSettings: true,
        showHistoryView: true,
        sidebarOpen: true,
        historyViews: [],
        device: "desktop",
        theme: elementVariables.theme
    }

    /** 初始化`layout`操作状态 */
    private init() {
        const cacheInfo = sessionStorage.getItem(cacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            utils.modifyData(this.state, value);
        }
    }

    /**
     * 保存`layout`操作状态
     * @description 这个方法我用在了`src/layout/index.vue`组件中用`watch`监听了数据的变动然后执行
     */
    saveLayout() {
        // 这里我只是简单做了两层拷贝，只保存要用到的信息就够了
        const value = this.state;
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
                data[key] = value[key as keyof LayoutState];
            }
        }
        // console.log(JSON.stringify(data));
        sessionStorage.setItem(cacheName, JSON.stringify(data));
    }

}