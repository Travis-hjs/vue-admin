import type { ExtractPropTypes } from "vue";
import { createApp, h, ref } from "vue";
import BaseDialog from "./index.vue";
import { registerPlugins } from "@/utils/plugins";

type DialogProps = ExtractPropTypes<InstanceType<typeof BaseDialog>>;

interface DialogParams<Props> {
  /** 弹框内容插槽组件 */
  component: any;
  /** 组件参数 */
  props?: Props;
  /** 弹框参数 */
  dialogProps?: Partial<Omit<DialogProps, "show">>;
  /** 确认回调 */
  confirm?: () => void;
  /** 确认按钮文字，默认为`"确认"` */
  confirmText?: string;
  /** 取消回调 */
  cancel?: () => void;
  /** 取消按钮文字，不传则没有取消操作 */
  cancelText?: string;
}

/**
 * 函数式打开弹框
 * @param params 参数配置
 */
export function openDialog<Props extends object>(params: DialogParams<Props>) {
  const {
    component,
    props = {},
    dialogProps = {},
    confirmText = "确认",
    cancelText,
    confirm,
    cancel,
  } = params;

  const show = ref(false);

  function onClose() {
    show.value = false;
    cancel && cancel();
  }

  function onClosed() {
    app.unmount();
    div.remove();
  }

  function onConfirm() {
    show.value = false;
    confirm && confirm();
  }

  const btnList = [h("button", { class: "the-btn blue", onClick: onConfirm }, confirmText)];

  if (cancelText) {
    btnList.unshift(h("button", { class: "the-btn", onClick: onClose }, cancelText));
  }

  const dialog = () => h(
    BaseDialog,
    { ...dialogProps, show: show.value, onClose, onClosed },
    {
      default: () => h(component, props),
      footer: () => btnList,
    }
  );
  
  const app = createApp(dialog);

  const div = document.createElement("div");
  
  document.body.appendChild(div);
  
  registerPlugins(app);

  app.mount(div);
  
  show.value = true;
}

export { BaseDialog }
