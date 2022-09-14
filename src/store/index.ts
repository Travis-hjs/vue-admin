import ModuleLayout from "./Layout";
import ModuleUser from "./User";

class ModuleStore {
  constructor() {
    console.log("%c ModuleStore init", "color: #409EFF");
  }

  /** 项目信息 */
  readonly projectInfo = {
    title: "Vue Typescript Admin",
    name: "XXX后台管理平台",
    logo: require("@/assets/logo.png"),
    link: "https://github.com/Hansen-hjs/vue-admin/tree/v2"
  }

  /** 页面图片资源 */
  get imageInfo() {
    return {
      /** 404图片 */
      image404: require("@/assets/404-images/404.png"),
      /** 404（云朵）图片 */
      image404cloud: require("@/assets/404-images/404-cloud.png")
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
