import ModuleLayout from "./Layout";

class ModuleStore extends ModuleLayout {

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

}

/** 状态管理模块 */
const store = new ModuleStore();

export default store;
