import type { FieldType } from "./src/types";

export { default as Fields } from "./src/index.vue";

export { LabelTips } from "./src/part";

export type { FieldType } from "./src/types";

/**
 * 设置表单项组件选项数据
 * - 考虑到数组中直接通过`list[number].options = xxx`这种方式不够方便
 * - 例如：1.类型要指定；2.数组顺序可能会被调整；
 * - 所以提供一个方法进行精准匹配并设置
 * @param list
 * @param prop
 * @param options
 * @param repeat 是否对重复的`prop`属性项进行赋值
 */
export function setFieldOptions<T extends object>(
  list: Array<FieldType.Member<T>>,
  prop: keyof T,
  options: Array<any>,
  repeat?: boolean
) {
  for (let i = 0; i < list.length; i++) {
    const field = list[i] as FieldType.Select<T>;
    if (field.prop === prop) {
      field.options = options;
      if (!repeat) {
        break;
      }
    }
  }
}
