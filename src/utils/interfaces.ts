import { RouteRecordRaw } from "vue-router";

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

/** 接口请求基础响应数据 */
export interface ApiResult {
    /** 接口状态（1为成功） */
    code: number
    /** 接口响应数据 */
    data: any
    /** 接口响应信息 */
    msg: string
}

export interface LoginParam {
    username: string,
    password: string
}

export interface UserInfoType {
    /** 用户`id` */
    id: number | string
    /** 用户名 */
    name: string
    /** 登录接口中返回的`token`字段 */
    token: string
    /** 用户类型 */
    userType: "admin" | "editor" | ""
}

/** 自定义的路由类型-继承`RouteRecordRaw` */
export type RouteItem = {
    /** 完整地址 */
    fullPath?: string
    /** 路由第一层必须要设置，因为动态路由删除时需要用到，且唯一 */
    name: string
} & RouteRecordRaw

/** 权限路由配置项 */
export interface PermissionOptions {
    /** 基础路由 */
    base: Array<RouteItem>
    admin: Array<RouteItem>
    editor: Array<RouteItem>
}

export interface LayoutStateType {
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
    /** 显示侧边栏文字主题色 */
    sidebarTextTheme: boolean
    /** 历史记录列表 */
    historyViews: Array<RouteItem>
    /** 系统信息 */
    device: "desktop" | "mobile"
    /** 主题颜色 */
    theme: string
}

export interface layoutRouteType {
    /** 动态添加的权限路由 */
    add: Array<RouteItem>
    /** (基础路由+动态路由)列表 */
    complete: Array<RouteItem>
}

export type LayoutStateKeys = keyof LayoutStateType;

/** 运算符号 */
export type NumberSymbols = "+" | "-"| "*" | "/";

/** JavaScript类型 */
export type JavaScriptTypes = "string" | "number" | "array" | "object" | "function" | "null" | "undefined";

export interface UploadChange {
    /** 和当前上传组件绑定的`id` */
    id: string | number
    /** 图片路径 */
    src: string
}

/** `variables.scss`变量导出类型 */
export interface ScssVariables {
    menuBg: string
    menuText: string
    menuActiveText: string
    theme: string
}

export interface PageInfoType {
    pageSize: number
    total: number
    currentPage: number
}

export interface PaginationChange {
    type: "pageSize"|"currentPage",
    value: number
}
