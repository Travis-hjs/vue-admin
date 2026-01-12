import { onUnmounted, reactive } from "vue";
import type { CurdConfig, CurdType } from "./types";
import { deepClone } from "@/utils";
import { getCurdConfigDefault, getCurdConfigEditor } from "./data";
import { getCountId } from "@/hooks/common";
import { message, messageBox } from "@/utils/message";

export const curdConfigState = reactive<CurdConfig.State>({
  show: false,
  pageId: "",
  title: "",
  type: "search",
  config: {} as CurdType.Config,
  callback: () => {},
  editor: getCurdConfigEditor(),
});

/**
 * 打开`curd`配置操作页
 * - 为什么这里要用这种方式调用？如果有多个`curd`页面需要配置时，可以把`PopupConfig.vue`挂载到`App.vue`下
 * - 形成一个单例调用的操作，多个页面共用同一个配置弹框功能，理论上可以实现无限嵌套的拓展操作
 * @param option 
 */
export function openCurdConfig(option: Partial<Pick<CurdConfig.State, "title" | "config" | "callback" | "type" | "pageId">>) {
  curdConfigState.show = true;
  curdConfigState.pageId = option.pageId || "";
  curdConfigState.title = option.title || "低代码配置";
  curdConfigState.type = option.type || "search";
  curdConfigState.config = option.config ? deepClone(option.config) : getCurdConfigDefault();
  curdConfigState.callback = option.callback || (() => {});
  if (!option.pageId) {
    console.error("openCurdConfig 缺少页面唯一标识 pageId");
  }
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
