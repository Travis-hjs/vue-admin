export { default as Curd } from "./src/index.vue";
export { default as Field } from "./src/Field.vue";
export { default as TableForm } from "./src/TableForm.vue";

export {
  getFieldData,
  getFieldValue,
  getColumnData,
  getActionData,
  getFormConfig,
  getBoldLabel,
  getCurdConfigDefault,
} from "./src/data";

export { exportPropToWindow } from "./src/hooks";

export { openCurdConfig } from "./src/popup";

export type { ComponentProps, CurdType } from "./src/types";

export { CurdEnum } from "./src/types";
