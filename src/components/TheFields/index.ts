import type { TheField } from "./src/types";

export { default as TheFields } from "./src/index.vue";

export { LabelTips } from "./src/part";

export type { TheField } from "./src/types";

/**
 * 设置表单项组件`<TheFields />`选项数据
 * - 考虑到数组中直接通过`list[number].options = xxx`这种方式不够方便
 * - 例如：1.类型要指定；2.数组顺序可能会被调整；
 * - 所以提供一个方法进行精准匹配并设置
 * @param list
 * @param prop
 * @param options
 */
export function setFieldOptions<T extends object>(
  list: Array<TheField.Type<T>>,
  prop: keyof T,
  options: Array<any>
) {
  for (let i = 0; i < list.length; i++) {
    const field = list[i];
    if (field.prop === prop) {
      (field as TheField.Select<T>).options = options;
      break;
    }
  }
}
