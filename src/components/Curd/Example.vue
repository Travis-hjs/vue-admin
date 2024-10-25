<template>
  <div class="the-curd-example">
    <Field
      v-for="item in example"
      :key="item.type"
      :field-data="item"
      :class="['the-curd-example-item fvc', { 'the-curd-selected': props.selected === item.type }]"
      readonly
      @click="emit('choose', item.type)"
    />
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import Field from "./Field.vue";
import { fieldTitleMap, getFieldData, type CurdType } from "./index";

type FieldType = CurdType.Field["type"];

const props = defineProps({
  /** 选中的类型 */
  selected: String as PropType<FieldType>
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
    ...getFieldData("select-multiple"),
    placeholder: fieldTitleMap["select-multiple"]
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
</script>
<style lang="scss"></style>
