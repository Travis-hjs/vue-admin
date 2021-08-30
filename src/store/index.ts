import ModuleLayout from "./Layout";
import ModuleUser from "./User";
import img401 from "../assets/401-images/401.gif";
import img404 from "../assets/404-images/404.png";
import img404cloud from "../assets/404-images/404-cloud.png";
import imgLogo from "../assets/logo.png";

class ModuleStore {
    constructor() {
        console.log("%c ModuleStore init", "color: #409EFF");
    }
    
    /** 项目信息 */
    readonly projectInfo = {
        title: "Vue Typescript Admin",
        name: "XXX后台管理平台",
        logo: imgLogo,
        link: "https://github.com/Hansen-hjs/vue-admin/tree/next"
    }

    /** 页面图片资源 */
    get imgInfo() {
        return {
            img401,
            img404,
            img404cloud,
            dance: "https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646"
        }
    }

    /** `layout`状态管理模块 */
    readonly layout = new ModuleLayout();

    /** 用户状态管理模块 */
    readonly user = new ModuleUser();
    
}

/**
 * 状态管理模块
 * - `OOP`单例设计模式
 * - 参考 [你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
 */
const store = new ModuleStore();

export default store;