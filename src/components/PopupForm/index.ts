import type { PopupFormProp } from "./src/types";
import { createApp, h, ref } from "vue";
import PopupForm from "./src/index.vue";
import { registerPlugins } from "@/utils/plugins";

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
    div.remove();
  }

  const dialog = () => h(
    PopupForm,
    { ...props, show: show.value, onClose, onClosed } as any,
  );

  const app = createApp(dialog);

  const div = document.createElement("div");

  document.body.appendChild(div);

  registerPlugins(app);

  app.mount(div);

  show.value = true;
}
