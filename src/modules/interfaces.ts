import { RouteConfig } from "vue-router";

export interface AjaxParams {
    /** 请求路径 */
    url: string,
    /** 请求方法 */
    method: "GET" | "POST" | "PUT" | "DELETE",
    /** 传参对象 */
    data: any,
    /** 超时毫秒 */
    overtime?: number,
    /** 是否上传文件 通常是图片 */
    file?: FormData,
    /** 成功回调 */
    success?: (res: any) => void,
    /** 失败回调 */
    fail?: (value: XMLHttpRequest) => void,
    /** 超时回调 */
    timeout?: (value: XMLHttpRequest) => void,
    /** 请求进度 (ev: ProgressEvent<XMLHttpRequestEventTarget>) => void */
    progress?: (ev: any) => void
}

export interface RequestFail {
    /** 请求错误提示信息 */
    message: string,
    /** 请求错误数据 */
    data?: any
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

/** 自定义的路由类型-继承`RouteConfig` */
export interface RouteItem extends RouteConfig {
    /** 完整地址 */
    fullPath?: string
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
    /** 侧边栏动画 */
    sidebarWithoutAnimation: boolean
    /** 历史记录列表 */
    historyViews: Array<RouteItem>
    /** 系统信息 */
    device: "desktop" | "mobile"
    /** 主题颜色 */
    theme: string
}

export type LayoutStateKeys = keyof LayoutStateType;

/** 运算符号 */
export type NumberSymbols = "+" | "-"| "*" | "/";

/** JavaScript类型 */
export type JavaScriptTypes = "string" | "number" | "array" | "object" | "function" | "null" | "undefined";

export interface UploadImage {
    /** 和当前上传组件绑定的`id` */
    id: string | number
    /** 图片路径 */
    src: string
}