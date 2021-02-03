import { reactive } from "vue";
import ModuleLayout from "./Layout";
import utils from "../utils";
import { DeepReadonly, UserInfoType } from "../utils/interfaces";

/** 用户信息缓存字段 */
const cacheName = "store-user-info";

/** 创建用户信息 */
function createUserInfo(): DeepReadonly<UserInfoType> {
    return {
        id: "",
        name: "",
        token: "",
        userType: "",
    }
}

class ModuleStore extends ModuleLayout {
    constructor() {
        super();
        this.initUserInfo();
    }

    /** 页面图片资源 */
    get imageInfo() {
        return {
            /** 404图片 */
            image404: require("@/assets/404-images/404.png"),
            /** 404（云朵）图片 */
            image404cloud: require("@/assets/404-images/404-cloud.png"),
            /** 401gif */
            image401: require("@/assets/401-images/401.gif"),
            /** 跳舞gif */
            image401ewizardClap: "https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646"
        }
    }

    /** 用户信息（包含登录状态） */
    readonly userInfo = reactive(createUserInfo());

    /** 初始化缓存信息 */
    private initUserInfo() {
        const cacheInfo = sessionStorage.getItem(cacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            utils.modifyData(this.userInfo, value);
        }
    }

    /**
     * 更新当前的`userInfo`值并缓存到本地
     * @param value 更新内容
     */
    updateUserInfo(value: Partial<UserInfoType>) {
        utils.modifyData(this.userInfo, value);
        sessionStorage.setItem(cacheName, JSON.stringify(this.userInfo));
    }

    /** 清空缓存信息 */
    removeUserState() {
        utils.modifyData(this.userInfo, createUserInfo());
        sessionStorage.removeItem(cacheName);
    }

    /** 测试用户类型 */
    readonly testUserList = ["admin", "editor"];
    
}

/**
 * 状态管理模块实例对象
 * 
 * 参考[你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
*/
const store = new ModuleStore();

export default store;