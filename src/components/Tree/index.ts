export { default as Tree } from "./index.vue";

/** 多级树节点对象 */
export interface TreeItem<T = any> {
  /** 字段名 */
  label: string;
  /** 对应的值 */
  value: string;
  /** 下级数据 */
  children: Array<TreeItem>;
  /** 唯一`key` */
  key: string;
  /** 索引，多层用`-`串联 */
  indexs: string;
  /** 是否展开下级 */
  open: boolean;
  /** 是否选中 */
  checked: boolean;
  /** 是否禁用 */
  disabled: boolean;
  /** 组件展开收起高度，默认`30` */
  height: number;
  /** 原始数据 */
  original: T;
}

/** `<Level>`组件相同字段 */
export function useLevelProps() {
  return {
    /** 选择父节点时，是否也选中所有其子节点 */
    checkChild: {
      type: Boolean,
      default: false
    },
    /** 是否需要选择功能 */
    checkbox: {
      type: Boolean,
      default: false
    },
  }
}
