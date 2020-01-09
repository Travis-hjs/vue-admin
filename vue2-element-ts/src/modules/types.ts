import { RouteConfig } from 'vue-router';

export interface AjaxType {
    /** 请求路径 */
    url: string,
    /** 请求方法 */
    method: 'POST' | 'GET',
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

export interface requestFail {
    /** 请求错误提示信息 */
    message: string,
    /** 请求错误数据 */
    data?: any
}

export interface loginParam {
    username: string,
    password: string
}

export interface userState {
    /** 用户名 */
    username?: string,
    /** 用户token */
    accessToken: string,
    /** 用户类型 1：admin | 2：editor */
    loginType: 1 | 2,
    /** 用户id */
    userId: number | string
}

export interface layoutStateType {
    /** 显示设置 */
    showSettings: boolean
    /** 显示历史记录列表 */
    showTagsView: boolean
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
    cachedViews: Array<RouteConfig>
    /** 系统信息 */
    device: 'desktop' | 'mobile'
    /** 主题颜色 */
    theme: string
}