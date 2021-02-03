import { reactive } from "vue";
import utils from "../utils";
import {
    layoutRouteType,
    LayoutStateKeys,
    LayoutStateType
} from "../utils/interfaces";

const cacheName = "ModuleLayoutInfo";

/**
 * `layout`状态管理模块
 */
export default class ModuleLayout {
    constructor() {
        this.initLayout();
    }

    /** `layout`操作状态 */
    readonly layoutState = reactive<LayoutStateType>({
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
    });

    /**
     * `layout`路由列表对象
     * @description 这里可以不是响应式的，因为在登录之后才会渲染，登录的时候就已经拼接好了
    */
    readonly layoutRoute: layoutRouteType = {
        add: [],
        complete: []
    }

    /** 初始化`layout`操作状态 */
    private initLayout() {
        const cacheInfo = sessionStorage.getItem(cacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            utils.modifyData(this.layoutState, value);
        }
    }

    /** 保存`layout`操作状态 */
    saveLayout() {
        // 这个方法我用在了`Navbar`组件中用`watch`监听了数据的变动然后执行
        // 这里我只是简单做了两层拷贝，只保存要用到的信息就够了
        const data: any = {};
        for (const key in this.layoutState) {
            const k = key as LayoutStateKeys;
            if (k === "historyViews") {
                data[k] = this.layoutState[k].map(item => {
                    return {
                        name: item.name,
                        meta: {...item.meta},
                        path: item.path,
                        // fullPath: item.fullPath || ""
                    }
                });
            } else {
                data[k] = this.layoutState[k];
            }
        }
        // console.log(JSON.stringify(data));
        sessionStorage.setItem(cacheName, JSON.stringify(data));
    }
}