import { computed, PropType } from "vue";

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
      type: Object as PropType<Partial<OptionItem>>,
      default: () => ({})
    }
  }
}

export function useSettingComputed(props: { optionSetting: Partial<OptionItem> }) {
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
