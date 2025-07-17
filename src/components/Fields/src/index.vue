<script lang="ts">
/** 基础通用表单项列表 */
export default {
  name: "Fields"
}
</script>
<script lang="ts" setup>
import { ElFormItem } from "element-plus";
import { FilterItem } from "@/components/FilterBox";
import { computed, type PropType } from "vue";
import type { FieldType } from "./types";
import { formatDate, isType } from "@/utils";
import { TheDatePicker, TheSelect, LabelTips } from "./part";

const props = defineProps({
  /**
   * 渲染的 item 类型，默认为`"form"`
   * - form: `<el-form-item>`
   * - search: `<FilterItem>`
   */
  type: {
    type: String as PropType<"form" | "search">,
    default: "form"
  },
  /** 数据对象 */
  data: {
    type: Object,
    required: true
  },
  /** 表单项配置列表 */
  list: {
    type: Array as PropType<Array<FieldType.Member>>,
    required: true
  },
});

const emit = defineEmits<{
  (event: "change", prop: string, value: any): void;
}>();

const fields = computed(() => props.list.filter(item => {
  if (isType(item.show, "boolean")) {
    return item.show;
  } else if (isType(item.show, "function")) {
    return item.show();
  }
  return true;
}));

/**
 * 获取表单项值
 * @param field 表单项配置
 * @param key 指定的键值
 */
function getFieldValue(field: FieldType.Member, key?: string) {
  const _key = key || field.prop;
  const model = props.data;
  // 处理嵌套属性：`props.data["sub.name"]`这种
  if (_key.includes(".")) {
    const empty = [null, undefined];
    const keys = _key.split(".");
    let obj = model;
    for (const k of keys) {
      if (empty.includes(obj[k])) {
        return undefined;
      }
      obj = obj[k];
    }
    return obj;
  }
  return model[field.prop];
}

/**
 * 设置表单项值
 * @param field 表单项配置
 * @param value 变更的值
 * @param key 指定的键值
 */
function setFieldValue(field: FieldType.Member, value: any, key?: string) {
  const _key = key || field.prop;
  const model = props.data;
  // 处理嵌套属性：`props.data["sub.name"]`这种
  if (_key.includes(".")) {
    const keys = _key.split(".");
    let obj = model;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      // 如果当前键不存在，则创建一个空对象
      if (!obj[k]) {
        obj[k] = {};
      }
      obj = obj[k];
    }
    obj[keys[keys.length - 1]] = value;
  } else {
    model[_key] = value;
  }
}

function onChange(field: FieldType.Member, val: any) {
  const key = field.prop;
  const value = val;
  // 日期的特殊处理一下
  if (field.type !== "date") {
    setFieldValue(field, value);
  }
  field.onChange && field.onChange(value);
  emit("change", key, value);
}

function getClassName(field: FieldType.Member) {
  return field.class || (props.type === "form" ? "w-full" : "short-value");
}

function getCommonProps(field: FieldType.Member) {
  const isDisabled = isType(field.disabled, "function") ? field.disabled() : field.disabled;
  return {
    placeholder: (field as any).placeholder,
    disabled: isDisabled,
    class: getClassName(field),
    clearable: field.type === "textarea" ? undefined : field.noClear ? false : true,
    modelValue: getFieldValue(field),
  }
}

function getSelectProps(field: FieldType.Select<any> | FieldType.SelectMultiple<any>) {
  const isMultiple = field.type === "select-multiple";
  const isDisabled = isType(field.disabled, "function") ? field.disabled() : field.disabled;
  const showAll = field.type === "select-multiple" ? field.showAll : false;
  return {
    placeholder: field.placeholder,
    disabled: isDisabled,
    multiple: isMultiple,
    clearable: field.noClear ? false : true,
    filterable: true,
    collapseTags: !showAll,
    class: getClassName(field),
    modelValue: getFieldValue(field),
  }
}

function getTextContent(field: FieldType.Text<any>) {
  const empty = ["", null, undefined];
  const value = props.data[field.prop as string];
  const text = empty.includes(value) ? field.placeholder : value;
  return text || "-";
}

function onDatePicker(field: FieldType.Date<Record<string, any>>, value: any) {
  const keys = field.bind;
  setFieldValue(field, value); // 为什么要先设置值？因为bind的值和组件的值可能是同一个，所以要先设置，最后再格式化
  if (["daterange", "datetimerange"].includes(field.dateType)) {
    if (value) {
      setFieldValue(field, formatDate(value[0], field.format), keys[0]);
      setFieldValue(field, formatDate(value[1], field.format), keys[1]);
    } else {
      setFieldValue(field, undefined, keys[0]);
      setFieldValue(field, undefined, keys[1]);
    }
  } else {
    setFieldValue(field, value ? formatDate(value, field.format) : undefined, keys[0]);
  }
  onChange(field, value);
}
</script>
<template>
  <component
    :is="props.type === 'form' ? ElFormItem : FilterItem"
    v-for="(field, fieldIndex) in fields"
    :key="field.key || `${field.prop}-${fieldIndex}`"
    :label="field.label"
    :label-width="field.labelWidth"
    :prop="field.prop"
    class="the-fields-item"
  >
    <template v-if="field.tooltip" #label>
      <LabelTips :label="field.label" :tips="field.tooltip" />
    </template>
    <el-input
      v-if="field.type === 'input'"
      v-bind="getCommonProps(field)"
      @input="e => onChange(field, e)"
    />
    <el-input
      v-if="field.type === 'textarea'"
      v-bind="getCommonProps(field)"
      :rows="field.rows"
      show-word-limit
      type="textarea"
      @input="e => onChange(field, e)"
    />
    <el-input-number
      v-if="field.type === 'number'"
      v-bind="getCommonProps(field)"
      :min="field.min"
      :max="field.max"
      controls-position="right"
      @input="e => onChange(field, e)"
    />
    <TheSelect
      v-if="field.type === 'select' || field.type === 'select-multiple'"
      :attrs="getSelectProps(field)"
      :field="field"
      @change="e => onChange(field, e)"
    />
    <TheDatePicker
      v-if="field.type === 'date'"
      :attrs="{
        type: field.dateType,
        format: field.formatShow,
        ...getCommonProps(field),
      }"
      @change="(e: any) => onDatePicker(field, e)"
    />
    <el-switch
      v-if="field.type === 'switch'"
      :model-value="getFieldValue(field)"
      inline-prompt
      :active-text="field.activeText || '是'"
      :inactive-text="field.inactiveText || '否'"
      :active-value="field.activeValue"
      :inactive-value="field.inactiveValue"
      @change="e => onChange(field, e)"
    />
    <div v-if="field.type === 'text'" :class="['text-box', field.class || 'w-full'] ">
      <el-text>{{ getTextContent(field) }}</el-text>
    </div>
    <slot v-if="field.type === 'slot' && field.slotName" :name="field.slotName" v-bind="field"></slot>
    <div v-if="field.tips" class="tips-box">
      <span class="the-tag blue">
        <i class="el-icon--left el-icon-info"></i>
        {{ field.tips }}
      </span>
    </div>
  </component>
</template>
<style lang="scss">
.the-fields-item {
  .el-form-item__content {
    font-size: 0;
    line-height: 1;
  }
  .w-full {
    width: 100%;
  }
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .tips-box {
    width: 100%;
    padding-top: 5px;
    .the-tag {
      line-height: 18px;
    }
  }
  .text-box {
    padding: 8px 10px;
    border: dashed 1px #ccc;
    border-radius: var(--border-radius);
  }
}
</style>
