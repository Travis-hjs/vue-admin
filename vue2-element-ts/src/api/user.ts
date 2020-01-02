import baseRequest from "../modules/ajax";
import { loginParam, requestFail, userState } from '../modules/types';
import store from '../modules/store';

/** 缓存`key`值 */
const cacheName = 'systemCache';

class ApiUser { 
    /**
     * 缓存用户登录信息
     * @param data 缓存的对象
     */
    saveUserState(data: userState) {
        sessionStorage.setItem(cacheName, JSON.stringify(data));
    }

    /** 获取缓存信息 */
    fetchUserState() {
        /** 缓存信息  */
        let data: userState = {
            username: '',
            accessToken: '',
            loginType: 1,
            userId: 0
        }
        const cacheInfo =  sessionStorage.getItem(cacheName);
        data = cacheInfo ? JSON.parse(cacheInfo) : null;
        return data;
    }

    /** 清空缓存信息 */
    removeUserState() {
        sessionStorage.removeItem(cacheName);
    }

    /**
     * 登录
     * @param data 登录信息
     * @param success 成功回调
     * @param fail 失败回调
     */
    login(data: loginParam, success: Function, fail?: (error: requestFail) => void) {
        /** 模拟登录 */
        const testLogin = () => {
            /** 缓存信息  */
            let info: userState = {
                username: data.username,
                accessToken: Math.random().toString(36).substr(2),
                loginType: 1,
                userId: Math.random().toString(36).substr(10)
            }
            switch (info.username) {
                case store.testUserList[0]:
                    info.loginType = 1;
                    this.saveUserState(info);
                    if (success) success(info);
                    break;

                case store.testUserList[1]:
                    info.loginType = 2;
                    this.saveUserState(info);
                    if (success) success(info);
                    break;

                default:
                    if (fail) fail({ message: '账户不存在' });
                    break;
            }
            
        }
        testLogin();
        return;
        baseRequest('POST', '/login', data, (res: any) => {
            // 录成功后缓存用户信息
            res.username = data.username;
            store.userStateInfo = res;
            this.saveUserState(res);
            // console.log('录成功后缓存用户信息', res);
            if (success) success(res);
        }, err => {
            if (fail) fail(err);
        });
    }
}

/** 用户类型接口 */
const apiUser = new ApiUser();

export default apiUser;