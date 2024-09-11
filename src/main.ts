import { createApp } from "vue";
import App from "./App.vue";
import SvgIcon from "./icons";
import BaseDialog from "./components/base-dialog";
import BaseTable from "./components/base-table";
import BaseTableActions from "./components/base-table-actions";
import BasePagination from "./components/base-pagination";
import router from "./router";
import { copyText, isMobile } from "./utils";
import { version } from "../package.json";
import ripple from "./utils/ripple";
import { message } from "./utils/message";

import "element-plus/dist/index.css";
import "./styles/element-plus.scss";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

window.version = version;

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
})

// 添加一个自定义指令`v-copy`点击复制内容
app.directive("copy", {
  mounted(el: HTMLElement, binding) {
    el.addEventListener("click", function () {
      // TODO: binding.value不是动态的，所以这里设置多一个动态绑定值作为取值使用
      const value = el.getAttribute("copy-data") || binding.value || "";
      copyText(value, () => message.success("复制成功"), tip => message.success(tip));
    });
  }
});

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

// 注册全局组件: `svg-icon`
app.component("svg-icon", SvgIcon);
// 基础弹框
app.component("base-dialog", BaseDialog);
// 全局表格
app.component('base-table', BaseTable);
// 全局表格选项
app.component('base-table-actions', BaseTableActions);
// 全局分页
app.component('base-pagination', BasePagination);

app.use(router);

app.mount("#app");

