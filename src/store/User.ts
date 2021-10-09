import { reactive } from "vue";
import { UserInfo } from "../types/user";
import { modifyData } from "../utils";

const cacheName = "ModuleUser";

function createUserInfo(): Readonly<UserInfo> {
    return {
        id: "",
        name: "",
        type: "",
        token: "",
        avatar: "",
        account: "",
        password: ""
    }
}

/**
 * 用户状态模块
 */
export default class ModuleUser {
    constructor() {
        this.init();
    }

    /** 用户信息（包含登录状态） */
    readonly info = reactive(createUserInfo());

    /** 初始化缓存信息 */
    private init() {
        const value = sessionStorage.getItem(cacheName);
        try {
            if (value) {
                const info = JSON.parse(value)
                modifyData(this.info, info);
            }
        } catch (error) {
            console.log("初始化缓存信息出错 >>", error);
        }
    }

    /**
     * 更新（设置）当前的用户信息并缓存到本地
     * @param value 要更新的值
     */
    update(value: Partial<UserInfo>) {
        modifyData(this.info, value);
        sessionStorage.setItem(cacheName, JSON.stringify(this.info));
    }

    /** 重置（清空）用户信息缓存信息 */
    reset() {
        modifyData(this.info, createUserInfo());
        sessionStorage.removeItem(cacheName);
    }

}