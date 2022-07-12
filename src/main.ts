import Vue from "vue";
import App from "./App.vue";
import SvgIcon from "./icons/index.vue";
import BaseDialog from "./components/base-dialog/index.vue";
import router from "./router";
import ElementUI from "element-ui";
import Language from "@/language";
import { copyText } from "./utils";
// import "element-ui/lib/theme-chalk/index.css"; // index.scss里面已经引入了，所以这里可以不用
import "./styles/index.scss";
import "./styles/layout.scss";
import "./styles/element-variables.scss";

import { version } from "../package.json";

window.version = version;

// 注册全局组件: `svg-icon`
Vue.component("svg-icon", SvgIcon);
// 基础弹框
Vue.component("base-dialog", BaseDialog);

Vue.use(ElementUI);

Vue.use(Language, {
    cache: true
});

Vue.config.productionTip = false;

// 添加一个自定义指令`v-copy`点击复制内容
Vue.directive("copy", {
  inserted(el, binding) {
    el.addEventListener("click", function () {
      copyText(binding.value, () => ElementUI.Message.success("复制成功"), tip => ElementUI.Message.warning(tip));
    })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")

