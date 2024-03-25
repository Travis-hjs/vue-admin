import { createApp } from "vue";
import App from "./App.vue";
import SvgIcon from "./icons/index.vue";
import BaseDialog from "./components/base-dialog/index.vue";
import router from "./router";
import { copyText, isMobile } from "./utils";
import { version } from "../package.json";
import ripple from "./utils/ripple";
import { message } from "./utils/message";

window.version = version;

const app = createApp(App);

// 添加一个自定义指令`v-copy`点击复制内容
app.directive("copy", {
  mounted(el: HTMLElement, binding) {
    el.addEventListener("click", function () {
      copyText(binding.value, () => message.success("复制成功"), tip => message.success(tip));
    });
  }
})

app.directive("ripple", {
  mounted(el: HTMLElement) {
    /** 添加事件类型 */
    const eventType = isMobile() ? "touchstart" : "mousedown";
    el.setAttribute("ripple", "");
    el.addEventListener(eventType, function (e) {
      ripple(e, el);
    });
  }
})


// 注册全局组件: `svg-icon`
app.component("svg-icon", SvgIcon);
// 基础弹框
app.component("base-dialog", BaseDialog);

app.use(router);

app.mount("#app");

// ---------------- 声明全局组件标签类型提示 ----------------
// declare module "@vue/runtime-core"
declare module "vue" {
  /**
   * 自定义全局组件获得 Volar 提示
   * - 自定义的全局组件需要在这里声明下才能获得 Volar 类型提示
   */
  export interface GlobalComponents {
    BaseDialog: typeof BaseDialog
    SvgIcon: typeof SvgIcon
  }
}
