import ModuleUser from "./User";
import imgLogo from "../assets/logo.png";
import ModuleLayout from "./Layout";
import ModuleGoods from "./Goods";

class ModuleStore {
  constructor() {
    console.log("%c ModuleStore init", "color: #409EFF");
  }

  /** 项目信息 */
  readonly projectInfo = {
    title: "Vue Typescript Admin",
    name: "XXX后台管理平台",
    logo: imgLogo,
    link: "https://github.com/Travis-hjs/vue-admin"
  }

  /** `layout`状态模块 */
  readonly layout = new ModuleLayout();

  /** 用户状态模块 */
  readonly user = new ModuleUser();

  // 以下为测试代码，可随时删除
  // 操作为：没有读取该模块时，不实例化该状态
  private _goods!: ModuleGoods;

  get goods() {
    if (!this._goods) {
      this._goods = new ModuleGoods();
    }
    return this._goods;
  }
  
}

/**
 * 状态管理模块
 * - `OOP`单例设计模式
 * - 参考 [你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
 */
const store = new ModuleStore();

export default store;