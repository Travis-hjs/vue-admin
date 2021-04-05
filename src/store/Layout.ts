import { reactive, watch } from "vue";
import utils from "../utils";
import {
    layoutRouteType,
    LayoutStateKeys,
    LayoutStateType,
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
        watch(this.state, this.saveLayout.bind(this));
    }

    // 这里可以不是响应式的，因为在登录之后才会渲染，登录的时候就已经拼接好了
    
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
    readonly state = reactive<LayoutStateType>({
        sidebarTextTheme: false,
        showSidebarLogo: true,
        fixedHeader: false,
        showSettings: true,
        showHistoryView: true,
        sidebarOpen: true,
        historyViews: [],
        device: "desktop",
        theme: elementVariables.theme
    });

    /** 初始化`layout`操作状态 */
    private init() {
        const cacheInfo = sessionStorage.getItem(cacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            utils.modifyData(this.state, value);
        }
    }

    /**
     * 保存`layout`操作状
    */
    private saveLayout() {
        // console.count("saveLayout");
        // 这里我只是简单做了两层拷贝，只保存要用到的信息就够了
        const data: any = {};
        for (const key in this.state) {
            const k = key as LayoutStateKeys;
            if (k === "historyViews") {
                data[k] = this.state[k].map(item => {
                    return {
                        name: item.name,
                        meta: {...item.meta},
                        path: item.path,
                        // fullPath: item.fullPath || ""
                    }
                });
            } else {
                data[k] = this.state[k];
            }
        }
        // console.log(JSON.stringify(data));
        sessionStorage.setItem(cacheName, JSON.stringify(data));
    }
}