export { default as Curd } from "./src/index.vue";
export { default as Field } from "./src/Field.vue";
export { default as TableForm } from "./src/TableForm.vue";

export {
  getFieldData,
  getFieldValue,
  getColumnData,
  getActionData,
  getFormConfig,
  exportPropToWindow,
  columnActionKey as columnActionKey,
  actionEditKey,
} from "./src/data";

export type {
  CurdType,
  TableOperationType as TableOperationAction,
} from "./src/types";

