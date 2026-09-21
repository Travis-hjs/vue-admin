import type { RendererElement, RendererNode, VNode } from "vue";
import type {
  FieldEditorType,
  TableActionType,
  TableBatchType,
  TableColumnType,
  TableFormType,
  TableOperationType
} from "./types";
import { createApp, h, ref } from "vue";
import { registerPlugins } from "@/utils/plugins";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import TableAction from "./TableAction.vue";
import TableBatch from "./TableBatch.vue";
import TableColumn from "./TableColumn.vue";
import TableOperation from "./TableOperation.vue";
import TableForm from "./TableForm.vue";
import FieldEditor from "./FieldEditor.vue";

/**
 * 输出组件
 * @param com
 */
export function render(com: () => VNode<RendererNode, RendererElement, { [key: string]: any }>) {
  const app = createApp(() =>
    h(
      ElConfigProvider,
      {
        locale: zhCn,
      },
      {
        default: () => com(),
      },
    ),
  );

  const el = document.createElement("div");
  document.body.appendChild(el);

  registerPlugins(app);
  app.mount(el);

  return [app, el] as const;
}

/**
 * 打开表格操作列配置
 * @param option
 */
export function openTableActionConfig(option: TableActionType.Config) {
  const show = ref(false);

  function onClose() {
    show.value = false;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const component = () => h(TableAction, {
    show: show.value,
    onClosed,
    onClose,
    ...option,
  });

  const [app, el] = render(component);

  show.value = true;
}

/**
 * 打开表格批量操作配置
 * @param option
 */
export function openTableBatchConfig(option: TableBatchType.Config) {
  const show = ref(false);

  function onClose() {
    show.value = false;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const component = () => h(TableBatch, {
    show: show.value,
    onClosed,
    onClose,
    ...option,
  });

  const [app, el] = render(component);

  show.value = true;
}

/**
 * 打开表格列配置
 * @param option
 */
export function openTableColumnConfig(option: TableColumnType.Config) {
  const show = ref(false);

  function onClose() {
    show.value = false;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const component = () => h(TableColumn, {
    show: show.value,
    onClosed,
    onClose,
    ...option,
  });

  const [app, el] = render(component);

  show.value = true;
}

/**
 * 打开表格自定义按钮配置
 * @param option
 */
export function openTableOperationConfig(option: TableOperationType.Config) {
  const show = ref(false);

  function onClose() {
    show.value = false;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const component = () => h(TableOperation, {
    show: show.value,
    onClosed,
    onClose,
    ...option,
  });

  const [app, el] = render(component);

  show.value = true;
}

/**
 * 打开表单配置
 * @param option
 */
export function openTableFormConfig(option: TableFormType.Config) {
  const show = ref(false);

  function onClose() {
    show.value = false;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const component = () => h(TableForm, {
    show: show.value,
    onClosed,
    onClose,
    ...option,
  });

  const [app, el] = render(component);

  show.value = true;
}

/**
 * 打开表单项编辑器组件选项配置
 * @param option
 */
export function openFieldEditor(option: FieldEditorType.Config) {
  const show = ref(false);

  function onClose() {
    show.value = false;
  }

  function onClosed() {
    app.unmount();
    el.remove();
  }

  const component = () => h(FieldEditor, {
    show: show.value,
    onClosed,
    onClose,
    ...option,
  });

  const [app, el] = render(component);

  show.value = true;
}
