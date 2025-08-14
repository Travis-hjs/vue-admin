import type { App } from "vue";
import { copyText, isMobile } from "./index";
import { message } from "./message";
import ripple from "./ripple";
import { BaseDialog } from "@/components/base-dialog";
import router from "@/router";

/**
 * 注册`vue`相关插件
 * @param app 
 */
export function registerPlugins(app: App<Element>) {
  // 添加一个自定义指令`v-copy`点击复制内容
  app.directive("copy", {
    mounted(el: HTMLElement, binding) {
      el.addEventListener("click", function () {
        copyText(binding.value, () => message.success("复制成功"), tip => message.success(tip));
      });
    }
  });

  // 水波纹指令
  app.directive("ripple", {
    mounted(el: HTMLElement) {
      /** 添加事件类型 */
      const eventType = isMobile() ? "touchstart" : "mousedown";
      el.setAttribute("ripple", "");
      el.addEventListener(eventType, function (e) {
        ripple(e, el);
      });
    }
  });

  // 基础弹框
  app.component("base-dialog", BaseDialog);

  app.use(router);
}
