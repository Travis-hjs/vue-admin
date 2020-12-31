import ModuleLayout from "./Layout";
import { DeepReadonly, UserInfoType } from "../utils/interfaces";

/** 缓存名称 */
const UserCacheName = "ApiUserInfo";

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
        this.init();
    }

    /** 页面图片资源 */
    get imageInfo () {
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
    
    /** 登录路由路径 */
    readonly loginPath = "/login";

    /** 测试用户类型 */
    readonly testUserList = ["admin", "editor"];

    /** 用户信息（包含登录状态） */
    readonly userInfo = createUserInfo();

    /** 初始化缓存信息 */
    private init() {
        const cacheInfo = sessionStorage.getItem(UserCacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            this.modifyData(this.userInfo, value);
        }
    }

    /**
     * 更新当前的`userInfo`值并缓存到本地
     * @param value 缓存的对象
     */
    updateUserInfo(value: Partial<UserInfoType>) {
        this.modifyData(this.userInfo, value);
        sessionStorage.setItem(UserCacheName, JSON.stringify(this.userInfo));
    }

    /** 清空缓存信息 */
    removeUserState() {
        this.modifyData(this.userInfo, createUserInfo());
        sessionStorage.removeItem(UserCacheName);
    }

}

/**
 * 状态管理模块
 * 
 * [你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
*/
const store = new ModuleStore();

export default store;
