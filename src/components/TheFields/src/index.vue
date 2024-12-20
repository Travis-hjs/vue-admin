<template>
  <component
    :is="props.type === 'form' ? ElFormItem : FilterItem"
    v-for="(field, fieldIndex) in fields"
    :key="`${field.prop}-${fieldIndex}`"
    :label="field.label"
    :prop="field.prop"
    class="the-base-field-item"
  >
    <template v-if="field.tooltip" #label>
      <LabelTips :label="field.label" :tips="field.tooltip" />
    </template>
    <el-input
      v-if="field.type === 'input'"
      v-model="props.data[field.prop]"
      v-bind="getCommonProps(field)"
      @input="onChange(field)"
    />
    <el-input
      v-if="field.type === 'textarea'"
      v-model="props.data[field.prop]"
      v-bind="getCommonProps(field)"
      show-word-limit
      type="textarea"
      @input="onChange(field)"
    />
    <el-input-number
      v-if="field.type === 'number'"
      v-model="props.data[field.prop]"
      v-bind="getCommonProps(field)"
      :min="field.min"
      :max="field.max"
      controls-position="right"
      @input="onChange(field)"
    />
    <template v-if="field.type === 'select' || field.type === 'select-multiple'">
      <el-select-v2
        v-if="field.options.length > 36"
        v-model="props.data[field.prop]"
        :options="field.options"
        :props="getOptionSetting(field)"
        v-bind="getSelectProps(field)"
        @change="onChange(field)"
      >
        <template #default="{ item }">
          <span :title="getSelectLabel(field, item)">
            {{ getSelectLabel(field, item) }}
          </span>
        </template>
      </el-select-v2>
      <el-select
        v-else
        v-model="props.data[field.prop]"
        v-bind="getSelectProps(field)"
        @change="onChange(field)"
      >
        <el-option
          v-for="item in field.options"
          :key="item[getOptionSetting(field).value]"
          :value="item[getOptionSetting(field).value]"
          :label="getSelectLabel(field, item)"
        />
      </el-select>
    </template>
    <el-date-picker
      v-if="field.type === 'date'"
      v-model="props.data[field.prop]"
      :type="field.dateType"
      :format="field.formatShow"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      v-bind="getCommonProps(field)"
      @change="onDatePicker(field)"
    />
    <el-switch
      v-if="field.type === 'switch'"
      v-model="props.data[field.prop]"
      inline-prompt
      :active-text="field.activeText || '是'"
      :inactive-text="field.inactiveText || '否'"
      :active-value="field.activeValue"
      :inactive-value="field.inactiveValue"
      @change="onChange(field)"
    />
    <div v-if="field.type === 'text'" :class="['text-box', field.class || 'w-full'] ">
      <el-text>{{ getTextContent(field) }}</el-text>
    </div>
    <div v-if="field.tips" class="tips-box">
      <span class="the-tag blue">
        <i class="el-icon--left el-icon-info"></i>
        {{ field.tips }}
      </span>
    </div>
  </component>
</template>
<script lang="ts">
/** 基础通用表单项列表 */
export default {
  name: "TheFields"
}
</script>
<script lang="ts" setup>
import { ElFormItem } from "element-plus";
import { FilterItem } from "@/components/FilterBox";
import { computed, type PropType } from "vue";
import type { TheField } from "./types";
import { formatDate, isType } from "@/utils";
import { LabelTips } from "@/components/Curd";

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
    type: Array as PropType<Array<TheField.Type>>,
    required: true
  },
});

const emit = defineEmits<{
  (event: "change", prop: string, value: any): void;
}>();

function onChange(field: TheField.Type) {
  const key = field.prop;
  const value = props.data[key];
  field.onChange && field.onChange(value);
  emit("change", key, value);
}

const fields = computed(() => props.list.filter(item => {
  if (isType(item.show, "boolean")) {
    return item.show;
  } else if (isType(item.show, "function")) {
    return item.show();
  }
  return true;
}));

function getClassName(field: TheField.Type) {
  return field.class || (props.type === "form" ? "w-full" : "short-value");
}

function getCommonProps(field: TheField.Type) {
  const isDisabled = isType(field.disabled, "function") ? field.disabled() : field.disabled;
  return {
    placeholder: (field as any).placeholder,
    disabled: isDisabled,
    class: getClassName(field),
    clearable: field.type === "textarea" ? undefined : true,
  }
}

function getOptionSetting(field: TheField.HasOption) {
  const setting = field.optionSetting || {};
  return {
    value: setting.value || "value",
    label: setting.label || "label",
  }
}

function getSelectProps(field: TheField.Select<any> | TheField.SelectMultiple<any>) {
  const isMultiple = field.type === "select-multiple";
  const isDisabled = isType(field.disabled, "function") ? field.disabled() : field.disabled;
  const showAll = field.type === "select-multiple" ? field.showAll : false;
  return {
    placeholder: field.placeholder,
    disabled: isDisabled,
    multiple: isMultiple,
    clearable: true,
    filterable: true,
    collapseTags: !showAll,
    class: getClassName(field),
  }
}

function getSelectLabel(field: TheField.HasOption, option: Record<string, any>) {
  const setting = getOptionSetting(field);
  return `${option[setting.label] || option[setting.value]}`;
}

function getTextContent(field: TheField.Text<any>) {
  const empty = ["", null, undefined];
  const value = props.data[field.prop as string];
  const text = empty.includes(value) ? field.placeholder : value;
  return text || "-";
}

function onDatePicker(field: TheField.Date<Record<string, any>>) {
  const model = props.data;
  const value = model[field.prop];
  const bind = field.bind;
  if (["daterange", "datetimerange"].includes(field.dateType)) {
    if (value) {
      model[bind[0]] = formatDate(value[0], field.format);
      model[bind[1]] = formatDate(value[1], field.format);
    } else {
      model[bind[0]] = undefined;
      model[bind[1]] = undefined;
    }
  } else {
    model[bind[0]] = value ? formatDate(value, field.format) : undefined;
  }
  onChange(field);
}
</script>
<style lang="scss">
.the-base-field-item {
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
  }
  .text-box {
    padding: 8px 10px;
    border: dashed 1px #ccc;
    border-radius: var(--border-radius);
  }
}
</style>
