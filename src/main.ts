import { createApp } from "vue";
import App from "./App.vue";
import BaseDialog from "./components/base-dialog";
import router from "./router";
import { copyText, isMobile } from "./utils";
import ripple from "./utils/ripple";
import { message } from "./utils/message";

import "./styles/tailwind.css";
import "./styles/index.scss";
import "element-plus/dist/index.css";
import "./styles/element-plus.scss";

// import ElementPlus from "element-plus";
import {
  ElButton,
  ElButtonGroup,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElColorPicker,
  ElDatePicker,
  ElSelectV2,
  ElIcon,
  ElInputNumber,
  ElTooltip,
  ElDivider,
  ElText,
  ElTreeSelect,
  ElTable,
  ElTableColumn,
  ElTableV2,
  ElScrollbar,
  ElPagination,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElEmpty,
  ElConfigProvider,
  ElCascader,
  ElImage,
  ElImageViewer,
  ElPopconfirm,
  ElPopover,
  vLoading,
} from "element-plus";

const app = createApp(App);

// app.use(ElementPlus);

// 用到哪些单独手动去加
const elComponents = [
  ElButton,
  ElButtonGroup,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElColorPicker,
  ElDatePicker,
  ElSelectV2,
  ElIcon,
  ElInputNumber,
  ElTooltip,
  ElDivider,
  ElText,
  ElTreeSelect,
  ElTable,
  ElTableColumn,
  ElTableV2,
  ElScrollbar,
  ElPagination,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElEmpty,
  ElConfigProvider,
  ElCascader,
  ElImage,
  ElImageViewer,
  ElPopconfirm,
  ElPopover,
]

elComponents.forEach(item => {
  app.use(item);
});

app.directive("loading", vLoading);

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

// 基础弹框
app.component("base-dialog", BaseDialog);

app.use(router);

app.mount("#app");

