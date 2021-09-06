import { RouteConfig } from "vue-router";

/** 深层递归所有属性为可选 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

/** 深层递归所有属性为只读 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
}

/** 深层递归所有属性为必选选（貌似不生效） */
export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? Required<T[P]> : T[P]
}

/** 运算符号 */
export type NumberSymbols = "+" | "-"| "*" | "/";

/** JavaScript类型 */
export type JavaScriptTypes = "string" | "number" | "array" | "object" | "function" | "null" | "undefined" | "regexp";

export interface AjaxParams {
    /** 请求路径 */
    url: string,
    /** 请求方法 */
    method: "GET" | "POST" | "PUT" | "DELETE",
    /** 传参对象 */
    data: any,
    /** 超时毫秒 */
    overtime?: number,
    /** 
     * `form`表单式传参：上传图片就是使用这种传参方式；使用`formData`时将覆盖`data`
     * @description 
     * ### 上传图片时使用 
     * ```js
     * const formdata = new FormData(); 
     * formData.append("img", file); // `img`是跟后台约定好的`key`字段
     * ```
     * ### 普通表单传参使用
     * ```js
     * const formdata = "name=hjs&id=123";
     * ```
     */
    formData?: FormData | string,
    /** `XMLHttpRequest.header`设置对象 */
    headers?: { [key: string]: string }
    /** 成功回调 */
    success?(
        /** 响应结果 */
        res: any,
        /** 响应原数据结果 */ 
        response: XMLHttpRequest
    ): void,
    /** 失败回调 */
    fail?(value: XMLHttpRequest): void,
    /** 超时回调 */
    timeout?(value: XMLHttpRequest): void,
    /** 请求进度 */
    progress?(event: ProgressEvent<XMLHttpRequestEventTarget>): void
}

/** `layout`状态类型 */
export interface LayoutState {
    /** 显示设置 */
    showSettings: boolean
    /** 显示历史记录列表 */
    showHistoryView: boolean
    /** 固定头部 */
    fixedHeader: boolean
    /** 侧边栏展开 */
    sidebarOpen: boolean
    /** 显示侧边栏logo */
    showSidebarLogo: boolean
    /** 显示侧边栏文字应用主题色 */
    sidebarTextTheme: boolean
    /** 历史记录列表 */
    historyViews: Array<RouteItem>
    /** 系统信息 */
    device: "desktop" | "mobile"
    /** 主题颜色 */
    theme: string
}

/** 接口请求基础响应数据 */
export interface ApiResult {
    /** 接口状态`code === 1`为成功 */
    code: number
    /** 接口响应数据 */
    data: any
    /** 接口响应信息 */
    msg: string
}

/** 自定义的路由类型-继承`RouteConfig` */
export interface RouteItem extends RouteConfig {
    /** 完整地址 */
    fullPath?: string
    /**
     * 可以访问该权限的用户类型数组，与`userInfo.type`对应；
     * 传空数组或者不写该字段代表可以全部用户访问
     * 
     * | number | 用户类型 |
     * | --- | --- |
     * | 0 | 超级管理员 |
     * | 1 | 普通用户 |
     */
    auth?: Array<number>
    /** 子级路由 */
    children?: Array<RouteItem>
}

/**
 * 上传图片`change`回调类型
 */
export interface UploadChange<T = string | number> {
    /** 和当前上传组件绑定的`id` */
    id: T
    /** 图片路径 */
    src: string
}

/** 分页器组件数据类型 */
export interface PageInfoType {
    /** 一页多少条 */
    pageSize: number
    /** 当前页 */
    currentPage: number
    /** 后端返回的总数 */
    total: number
}

/** 分页器组件`change`回调类型 */
export interface PaginationChange {
    type: "pageSize" | "currentPage",
    value: number
}
