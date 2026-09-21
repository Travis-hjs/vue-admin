import { h, onUnmounted, ref } from "vue";
import type { CurdConfig } from "./types";
import { getCurdConfigDefault } from "./data";
import { getCountId } from "@/hooks/common";
import { message, messageBox } from "@/utils/message";
import PopupConfig from "./PopupConfig.vue";
import { render } from "./popup";

/**
 * 打开表单项编辑器组件选项配置
 * @param option
 */
export function openCurdConfig(option: Partial<Omit<CurdConfig.Props, "show">>) {
  if (!option.pageId) {
    console.error("openCurdConfig 缺少页面唯一标识 pageId");
    option.pageId = "null"
  }
  if (!option.title) {
    option.title = "低代码配置";
  }
  if (!option.type) {
    option.type = "search";
  }
  if (!option.config) {
    option.config = getCurdConfigDefault();
  }

  const show = ref(false);

  function onClose() {
    show.value = false;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const component = () => h(PopupConfig, {
    ...(option as CurdConfig.Props),
    onClosed,
    onClose,
    show: show.value,
  });

  const [app, el] = render(component);

  show.value = true;
}

/**
 * 将属性挂载到全局，以下划线为标识符开头
 * - 配合`jsCode`中动态代码调用
 * @param target 
 */
export function exportPropToWindow<T extends object>(target: T) {
  const global: any = window;
  for (const key in target) {
    const props = `_${key}`;
    global[props] = target[key];
  }

  // 组件卸载的时候将全局属性清空，避免占用内存或者爆栈
  onUnmounted(function() {
    for (const key in target) {
      const props = `_${key}`;
      global[props] = null;
    }
  });
}

/**
 * 打开`JSON`回填弹框
 * @param callback
 */
export function openJsonPopup<T = any>(callback: (data: T) => void) {
  const id = getCountId("copy-json");
  const tips = "请粘贴/填写JSON数据";
  messageBox({
    width: "60vw",
    title: "回填JSON数据",
    content: `<div class="el-textarea w-full">
    <textarea
      class="el-textarea__inner"
      placeholder="${tips}"
      rows="20"
      id="${id}"
    ></textarea>
    </div>`,
    cancelText: "取消",
    confirmText: "设置回填数据",
    confirm(cb) {
      const input = document.getElementById(id) as HTMLTextAreaElement;
      const value = input.value;
      if (!value) {
        message.warning(tips);
        return cb(false);
      }
      try {
        const data = JSON.parse(value);
        callback(data);
      } catch (error) {
        console.warn(error);
        message.error(`输入的JSON有误：${error}`);
        return cb(false);
      }
      cb(true);
    }
  });
}
