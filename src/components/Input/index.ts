import { computed, type PropType } from "vue";

export { default as InputSearch } from "./Search.vue";
export { default as InputSelect } from "./Select.vue";

/** 列表选项结构配置 */
export interface OptionSetting {
  /** 显示值，默认`label` */
  label?: string;
  /** 对应值，默认`value` */
  value?: string;
  /** 下级数据字段，默认`children` */
  children?: string;
  /** 禁用值，默认`disabled` */
  disabled?: string;
  /** 唯一key，默认空 */
  key?: string;
}

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

export function useProps(placeholder: string) {
  return {
    placeholder: {
      type: [String, Number],
      default: placeholder
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    /** 选项数据配置项 */
    optionSetting: {
      type: Object as PropType<Partial<OptionSetting>>,
      default: () => ({})
    }
  }
}

export function useSettingComputed(props: { optionSetting: Partial<OptionSetting> }) {
  return computed(function() {
    const setting = {
      label: "label",
      value: "value",
      key: "value",
      disabled: "disabled"
    }
    return Object.assign(setting, props.optionSetting);
  });
}
