import { RouteItem } from "@/types";

/**
 * `layout`状态模块
*/
export default class ModuleLayout {
    constructor() {
        
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

    
}
