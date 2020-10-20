import request from "../modules/request";
import store from "../store";
import { ModuleModifyObject } from "../store/ModifyObject";
import { 
    LoginParam, 
    RequestFail, 
    UserInfoType 
} from "../modules/interface";

/** 缓存名称 */
const cacheName = "ApiUserInfo";

/** 创建用户信息 */
function createUserInfo(): UserInfoType {
    return {
        id: "",
        name: "",
        token: "",
        userType: "",
    }
}

class ApiUser extends ModuleModifyObject { 

    constructor() {
        super();
        this.init();
    }

    /** 用户信息（包含登录状态） */
    public readonly userInfo = createUserInfo();

    /**
     * 更新当前的`userInfo`值并缓存到本地
     * @param value 缓存的对象
     */
    private updateUserInfo(value: Partial<UserInfoType>) {
        this.modifyData(this.userInfo, value);
        sessionStorage.setItem(cacheName, JSON.stringify(this.userInfo));
    }

    /** 初始化缓存信息 */
    private init() {
        const cacheInfo = sessionStorage.getItem(cacheName);
        const value = cacheInfo ? JSON.parse(cacheInfo) : null;
        if (value) {
            this.modifyData(this.userInfo, value);
        }
    }

    /** 清空缓存信息 */
    removeUserState() {
        this.modifyData(this.userInfo, createUserInfo());
        sessionStorage.removeItem(cacheName);
    }

    /**
     * 登录
     * @param params 登录信息
     * @param success 成功回调
     * @param fail 失败回调
     */
    login(params: LoginParam, success?: (res: UserInfoType) => void, fail?: (error: RequestFail) => void) {
        /** 模拟登录 */
        const testLogin = () => {
            /** 缓存信息  */
            const info: UserInfoType = {
                name: params.username,
                token: Math.random().toString(36).substr(2),
                userType: "",
                id: Math.random().toString(36).substr(10)
            }
            switch (info.name) {
                case store.testUserList[0]:
                    info.userType = "admin";
                    this.updateUserInfo(info);
                    success && success(info);
                    break;

                case store.testUserList[1]:
                    info.userType = "editor";
                    this.updateUserInfo(info);
                    success && success(info);
                    break;

                default:
                    fail && fail({ message: "账户不存在" });
                    break;
            }
            
        }
        testLogin();
        
        // request("POST", "/login", params, res => {
        //     // 录成功后缓存用户信息
        //     res.data.name = params.username;
        //     this.updateUserInfo(res.data);
        //     // console.log("录成功后缓存用户信息", res);
        //     success && success(res);
        // }, err => {
        //     fail && fail(err);
        // });
    }

}

/** 用户类型接口 */
const apiUser = new ApiUser();

export default apiUser;