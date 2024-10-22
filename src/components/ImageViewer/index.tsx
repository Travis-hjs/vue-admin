import { useZIndex } from "@/hooks/common";
import { message } from "@/utils/message";
import { reactive } from "vue";

const state = reactive({
  /** 图片预览链接列表 */
  urls: [] as Array<string>,
  /** 定位层级，默认使用`useZIndex()` */
  zIndex: 0,
  /** 当前图片预览索引 */
  index: 0,
  /** 是否显示预览组件 */
  show: false
});

/**
 * 打开图片预览工具
 * @param params
 */
export function openPreview(params: Partial<Omit<typeof state, "show">>) {
  if (!params.urls) return message.warning("当前没有可以预览的图片~");
  state.urls = params.urls;
  state.index = params.index || 0;
  state.zIndex = params.zIndex || useZIndex();
  state.show = true;
}

function onClose() {
  state.show = false;
}

export function ImageViewer() {
  return state.show ? (
    <el-image-viewer
      url-list={state.urls}
      z-index={state.zIndex}
      initial-index={state.index}
      onClose={onClose}
    ></el-image-viewer>
  ) : null;
}
