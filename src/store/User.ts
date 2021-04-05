import utils from "../utils";
import { DeepPartial, DeepReadonly, UserInfoType } from "../utils/interfaces";

const cacheName = "ModuleUser";

/** 创建用户信息 */
function createUserInfo(): DeepReadonly<UserInfoType> {
    return {
        id: "",
        name: "",
        token: "",
        userType: "",
    }
}

/**
 * 用户状态管理模块
 */
export default class ModuleUser {
    constructor() {
        this.init();
    }

    /** 登录路由路径 */
    readonly loginPath = "/login";

    /** 测试用户类型 */
    readonly testUserList = ["admin", "editor"];

    /** 用户信息（包含登录状态） */
    readonly info = createUserInfo();

    /** 初始化缓存信息 */
    private init() {
        const cacheInfo = sessionStorage.getItem(cacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            utils.modifyData(this.info, value);
        }
    }

    /**
     * 更新（设置）当前的用户信息并缓存到本地
     * @param value 缓存的对象
     */
    update(value: DeepPartial<UserInfoType>) {
        utils.modifyData(this.info, value);
        sessionStorage.setItem(cacheName, JSON.stringify(this.info));
    }

    /** 清空用户信息缓存信息 */
    reset() {
        utils.modifyData(this.info, createUserInfo());
        sessionStorage.removeItem(cacheName);
    }

}