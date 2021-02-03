import request from "../utils/request";
import store from "../store";
import { 
    LoginParam, 
    ApiResult, 
    UserInfoType 
} from "../utils/interfaces";


class ApiUser {

    /**
     * 登录
     * @param params 登录信息
     * @param success 成功回调
     * @param fail 失败回调
     */
    login(params: LoginParam, success?: (res: UserInfoType) => void, fail?: (error: ApiResult) => void) {
        /** 模拟登录 */
        function testLogin() {
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
                    store.updateUserInfo(info);
                    success && success(info);
                    break;

                case store.testUserList[1]:
                    info.userType = "editor";
                    store.updateUserInfo(info);
                    success && success(info);
                    break;

                default:
                    fail && fail({ state: -1, msg: "账户不存在", data: null });
                    break;
            }
            
        }
        testLogin();
        
        // request("POST", "/login", params, res => {
        //     // 录成功后缓存用户信息
        //     res.data.name = params.username;
        //     store.updateUserInfo(res.data);
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