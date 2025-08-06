import { formatDate, isType } from "@/utils";
import {
  computed,
  defineComponent,
  // ref,
  type PropType,
} from "vue";
import type { FieldType } from "./types";

interface LabelTipsProps {
  /** `<el-form-item :label="label">` */
  label: string;
  /** `<el-tooltip />`提示内容 */
  tips: string;
}

/**
 * 表单`label`文字 + 提示文字组件
 * @param props
 */
export function LabelTips(props: LabelTipsProps) {
  return (
    <>
      {props.label}
      <el-tooltip
        effect="dark"
        content={props.tips}
        raw-content
        placement="top-start"
      >
        <el-button type="info" link style="height: 32px;">
          <i class="el-icon-question"></i>
        </el-button>
      </el-tooltip>
    </>
  );
}

/**
 * 日期选择器
 * - 为什么要单独提取出来？因为 element-plus 的日期选择器有个 bug，如果通过`v-bind`的方式绑定`modelValue`，则无法触发`onChange`事件, 所以需要通过`v-model`的方式绑定
 */
export const TheDatePicker = defineComponent({
  props: {
    field: {
      type: Object as PropType<FieldType.Date<any>>,
      required: true,
    },
    getValueByKey: {
      type: Function as PropType<(key: string) => string>,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const date = computed({
      get() {
        const getValue = props.getValueByKey;
        const keys = props.field.bind as Array<string>;
        const first = keys[0] ? getValue(keys[0]) : undefined;
        const second = keys[1] ? getValue(keys[1]) : undefined;
        if (props.field.dateType.includes("range")) {
          const values = [];
          if (first) {
            values.push(new Date(first));
          }
          if (second) {
            values.push(new Date(second));
          }
          return values;
        }
        return first ? new Date(first) : undefined;
      },
      set(val) {
        const list = val as Array<Date>;
        // 处理两个相同的范围日期
        if (props.field.dateType.includes("range")) {
          if (list && new Date(list[0]).getTime() === new Date(list[1]).getTime()) {
            list[1] = new Date(formatDate(list[1], "Y-M-D 23:59:59"));
          }
        }
        emit("change", list);
      }
    });

    return () => (
      <el-date-picker
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class={props.field.class}
        placeholder={props.field.placeholder}
        disabled={typeof props.field.disabled === "function" ? props.field.disabled() : props.field.disabled}
        clearable={props.field.noClear ? false : true}
        type={props.field.dateType}
        format={props.field.formatShow}
        disabled-date={props.field.disabledDate}
        v-model={date.value}
        // onChange={(e: any) => emit("change", e)}
      />
    );
  },
});

/**
 * 下拉选择器
 * - 尝试修复`el-select-v2`组件在多选的情况下产生的 bug：选择前几条数据，然后再拖到底部随便选择一条，会跳回到顶部
 * 之所以有这种情况是因为`el-select-v2`组件如果通过函数实时获取的绑定值会导致内部重新触发更新，所以解决方案就是将其用`computed`缓存起来即可
 */
export const TheSelect = defineComponent({
  props: {
    attrs: {
      type: Object,
      required: true,
    },
    field: {
      type: Object as PropType<FieldType.Select<any>>,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    const select = computed({
      get() {
        return props.attrs.modelValue;
      },
      set(val) {
        emit("change", val);
      },
    });

    const setting = computed(() => {
      const opt = props.field.optionSetting || {};
      return {
        value: opt.value || "value",
        label: opt.label || "label",
      }
    });

    function getSelectLabel(option: Record<string, any>) {
      const opt = setting.value;
      return `${option[opt.label] || option[opt.value]}`;
    }

    return () => props.field.options.length > 36 ? (
      <el-select-v2
        {...props.attrs}
        options={props.field.options}
        props={setting.value}
        v-model={select.value}
        v-slots={{
          default: ({ item }: { item: any }) => (
            <span title={getSelectLabel(item)}>{getSelectLabel(item)}</span>
          ),
        }}
      />
    ) : (
      <el-select {...props.attrs} v-model={select.value}>
        {props.field.options.map((item) => (
          <el-option
            key={item[setting.value.value]}
            label={getSelectLabel(item)}
            value={item[setting.value.value]}
          />
        ))}
      </el-select>
    );
  },
});
