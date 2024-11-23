import { computed, type PropType } from "vue";

export { default as InputSearch } from "./Search.vue";
export { default as InputSelect } from "./Select.vue";

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
