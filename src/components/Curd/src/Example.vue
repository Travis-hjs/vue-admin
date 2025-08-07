<script lang="ts">
/** 表单组件示例组件 */
export default {
  name: "Example"
}
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import Field from "./Field.vue";
import { fieldTitleMap, getFieldData } from "./data";
import type { CurdConfig, CurdType } from "./types";

type FieldType = CurdType.Field["type"];

const props = defineProps({
  /** 选中的类型 */
  selected: {
    type: String as PropType<FieldType>
  },
  /** 当前编辑的类型 */
  type: {
    type: String as PropType<CurdConfig.Type>
  }
});

const emit = defineEmits<{
  (event: "choose", type: FieldType): void;
}>();

const example = [
  {
    ...getFieldData("input"),
    placeholder: fieldTitleMap.input
  },
  {
    ...getFieldData("select"),
    placeholder: fieldTitleMap.select
  },
  {
    ...getFieldData("cascader"),
    placeholder: fieldTitleMap.cascader
  },
  {
    ...getFieldData("date"),
    placeholder: fieldTitleMap.date
  },
  {
    ...getFieldData("checkbox"),
    options: [
      { label: "多选-A", value: 1 },
      { label: "多选-B", value: 2 }
    ],
    defaultValue: [1]
  },
  {
    ...getFieldData("radio"),
    options: [
      { label: "单选-A", value: "radio-1" },
      { label: "单选-B", value: "radio-2" }
    ],
    defaultValue: "radio-1"
  },
  {
    ...getFieldData("switch"),
    defaultValue: true
  },
  {
    ...getFieldData("textarea"),
    placeholder: fieldTitleMap.textarea
  },
  {
    ...getFieldData("input-between"),
    placeholder: ["范围区间操作", "范围区间操作"]
  },
];

const exclude: Array<FieldType> = ["radio", "checkbox", "textarea", "switch"];

const fieldList = computed(() => {
  if (props.type === "search") {
    return example.filter(item => !exclude.includes(item.type));
  }
  return example;
});
</script>
<template>
  <div class="the-curd-example">
    <Field
      v-for="item in fieldList"
      :key="item.type"
      :field-data="item"
      :class="['the-curd-example-item fvc', { 'the-curd-selected': props.selected === item.type }]"
      readonly
      @click="emit('choose', item.type)"
    />
  </div>
</template>
