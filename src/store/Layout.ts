import { modifyData } from "@/utils";
import { LayoutInfo, RouteItem } from "@/types";

const cacheName = "ModuleLayout";

/**
 * `layout`状态管理模块
 */
export default class ModuleLayout {
    constructor() {
        this.init();
    }

    /**
     * 动态添加的权限路由
     * @description 这里可以不是响应式的，因为在登录之后才会渲染，登录的时候就已经拼接好了
     */
    addRouters: Array<RouteItem> = [];
 
    /**
     * (基础路由+动态路由)列表
     * @description 这里可以不是响应式的，因为在登录之后才会渲染，登录的时候就已经拼接好了
     */
    completeRouters: Array<RouteItem> = [];

    /** `layout`操作状态 */
    readonly info: LayoutInfo = {
        showTagsView: true,
        sidebarOpen: true,
        showSidebarLogo: true,
        historyViews: []
    }

    private init() {
        const value = sessionStorage.getItem(cacheName);
        try {
            if (value) {
                modifyData(this.info, JSON.parse(value));
            }
        } catch (error) {
            console.log("ModuleLayout init fail >>", error);
        }
    }

    /**
     * 保存`layout`操作状态
     * @description 这个方法我用在了`src/layout/index.vue`组件中用`watch`监听了数据的变动然后执行
     */
    saveInfo() {
        sessionStorage.setItem(cacheName, JSON.stringify(this.info));
    }

    /** 
     * 菜单组件尺寸对象
     */
    readonly menuSizeInfo = {
        /** `the-layout-menu-title`实际高度 */
        titleHeight: 0,
        /** `the-layout-menu-item`实际高度 */
        itemHeight: 0
    }

}