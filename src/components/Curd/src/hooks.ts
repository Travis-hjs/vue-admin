import { reactive } from "vue";
import type { CurdConfig, CurdType } from "./types";
import { deepClone } from "@/utils";
import { getCurdConfigDefault, getCurdConfigEditor } from "./data";

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
