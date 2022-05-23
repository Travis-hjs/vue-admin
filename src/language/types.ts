/** 语言配置信息 */
export interface LanguageInfo {
    login: {
        /** 账号 */
        account: string
        /** 密码 */
        password: string
        /** 注册 */
        register: string
        /** 登录按钮 */
        signin: string
        /** 退出登录按钮 */
        logout: string
    },
    /** 输入提示 */
    input: string
    /** 项目名称 */
    projectName: string
    /** 语言设置 */
    languageSetting: string
}

/** 语言种类 */
export type LanguageType = "zh" | "en" | "ja";

/** 语言状态 */
export interface LanguageState {
    /** 当前应用的语言类型 */
    type: LanguageType
    /** 是否需要缓存操作 */
    cache: boolean
}
