import utils from "@/utils";
import { DeepPartial, DeepReadonly } from "@/types";
import { UserInfo } from "@/types/user";

const cacheName = "ModuleUser";

/** 创建用户信息 */
function createUserInfo(): DeepReadonly<UserInfo> {
    return {
        id: "",
        name: "",
        type: "",
        token: "",
        account: "",
        password: ""
    }
}

/**
 * 用户状态管理模块
 */
export default class ModuleUser {
    constructor() {
        this.init();
    }

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
     * @param value 更新的值
     */
    update(value: DeepPartial<UserInfo>) {
        utils.modifyData(this.info, value);
        sessionStorage.setItem(cacheName, JSON.stringify(this.info));
    }

    /** 清空用户信息缓存信息 */
    reset() {
        utils.modifyData(this.info, createUserInfo());
        sessionStorage.removeItem(cacheName);
    }

}