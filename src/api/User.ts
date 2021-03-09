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
     */
    login(params: LoginParam) {
        // 模拟登录
        return new Promise<ApiResult>(function(resolve) {
            /** 缓存信息  */
            const info: UserInfoType = {
                name: params.username,
                token: Math.random().toString(36).substr(2),
                userType: "",
                id: Math.random().toString(36).substr(10)
            }
            setTimeout(() => {
                switch (info.name) {
                    case store.testUserList[0]:
                        info.userType = "admin";
                        store.updateUserInfo(info);
                        resolve({ state: 1, msg: "ok", data: info });
                        break;
    
                    case store.testUserList[1]:
                        info.userType = "editor";
                        store.updateUserInfo(info);
                        resolve({ state: 1, msg: "ok", data: info });
                        break;
    
                    default:
                        resolve({ state: -1, msg: "账户不存在", data: null });
                        break;
                }
            }, 600);
        })
        
        // const res = await request("POST", "/login", params)
        // if (res.state === 1) {
        //     // 录成功后缓存用户信息
        //     res.data.name = params.username;
        //     store.updateUserInfo(res.data);
        // }
        // return res;
    }

}

/** 用户类型接口 */
const apiUser = new ApiUser();

export default apiUser;