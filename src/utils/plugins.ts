import type { App } from "vue";
import { copyText, isMobile } from "./index";
import { message } from "./message";
import ripple from "./ripple";
import { BaseDialog } from "@/components/base-dialog";
import router from "@/router";
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
  ElInputTag,
  vLoading,
} from "element-plus";

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
    ElInputTag,
  ];

  elComponents.forEach(item => {
    app.use(item);
  });

  app.directive("loading", vLoading);

  app.use(router);
}
