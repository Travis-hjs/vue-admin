/**
 * 用户信息
 */
export interface UserInfo {
    /** 用户`id` */
    id: number | string
    /** 用户名 */
    name: string
    /** 登录接口中返回的`token`字段 */
    token: string
    /**
     * 用户类型
     * 
     * | number | 用户类型 |
     * | --- | --- |
     * | 0 | 超级管理员 |
     * | 1 | 普通用户 |
     */
    type: number | ""
    /** 用户账户 */
    account?: string | number
    /** 用户密码 */
    password?: string
    /** 用户头像 */
    avatar: string
}

/** 登陆接口传参 */
export interface LoginParams {
    account: string
    password: string
}