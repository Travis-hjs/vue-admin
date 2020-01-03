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
    success?: Function,
    /** 失败回调 */
    fail?: Function,
    /** 超时回调 */
    timeout?: Function,
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
    /** 用户类型 1：广告 | 2：流量 */
    loginType: 1 | 2,
    /** 用户id */
    userId: number | string
}

interface routeMeta {
    /** 导航文字 */
    title: string
    /** 导航icon */
    icon?: string
}

/** 路由数组对象 */
export interface routeItem {
    name?: string
    /** 路由组件 */
    component: any
    /** 路由路径 */
    path: string
    /** 路由信息 */
    meta?: routeMeta
    /** 是否导航隐藏 */
    hidden?: boolean
    /** 定义菜单组件时用到的展开 */
    open?: boolean
    /** 子路由 */
    children?: Array<routeItem>
}

export interface layoutStateType {
    /** 侧边栏展开 */
    sidebarOpen: boolean
    /** 侧边栏动画 */
    sidebarWithoutAnimation: boolean
    /** 历史记录列表 */
    cachedViews: Array<string>
    /** 系统信息 */
    device: 'desktop' | 'mobile'
}