import type { RendererElement, RendererNode, VNode } from "vue";
import type { PopupFormProp } from "./src/types";
import { createApp, h, ref } from "vue";
import { registerPlugins } from "@/utils/plugins";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import PopupForm from "./src/index.vue";

/**
 * 渲染组件到`body`中
 * - 包含了`el-plus`配置
 * @param component
 */
export function render(component: () => VNode<RendererNode, RendererElement, { [key: string]: any }>) {
  const app = createApp(() => h(
    ElConfigProvider,
    {
      locale: zhCn,
    },
    {
      default: () => component(),
    },
  ));

  const el = document.createElement("div");
  document.body.appendChild(el);

  registerPlugins(app);
  app.mount(el);

  return [app, el] as const;
}

/**
 * 指令时打开表单弹框
 * @param props
 */
export function openPopupForm<T extends BaseObj<any>>(props: Omit<PopupFormProp<T>, "show">) {
  const show = ref(false);

  function onClose(val: boolean) {
    show.value = val;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const popup = ref();

  const dialog = () => h(
    PopupForm,
    { ...props, show: show.value, onClose, onClosed, ref: popup } as any,
  );

  const [app, el] = render(dialog);

  show.value = true;

  return {
    getFromData(): T {
      return popup.value?.getFormData();
    },
  }
}
