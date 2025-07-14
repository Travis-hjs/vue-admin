export { default as Curd } from "./src/index.vue";
export { default as Field } from "./src/Field.vue";
export { default as TableForm } from "./src/TableForm.vue";
export { default as CurdPopupConfig } from "./src/PopupConfig.vue";

export {
  getFieldData,
  getFieldValue,
  getColumnData,
  getActionData,
  getFormConfig,
  getBoldLabel,
  getCurdConfigDefault,
  exportPropToWindow,
  actionEditKey,
} from "./src/data";

export {
  openCurdConfig,
} from "./src/hooks";

export type {
  CurdType,
  TableOperationType as TableOperationAction,
} from "./src/types";
