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
import { fieldTitleMap, useFieldData, type CurdType } from "./index";

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
    ...useFieldData("input"),
    placeholder: fieldTitleMap.input
  },
  {
    ...useFieldData("select"),
    placeholder: fieldTitleMap.select
  },
  {
    ...useFieldData("select-multiple"),
    placeholder: fieldTitleMap["select-multiple"]
  },
  {
    ...useFieldData("cascader"),
    placeholder: fieldTitleMap.cascader
  },
  {
    ...useFieldData("date"),
    placeholder: fieldTitleMap.date
  },
  {
    ...useFieldData("checkbox"),
    options: [
      { label: "多选-A", value: 1 },
      { label: "多选-B", value: 2 }
    ],
    defaultValue: [1]
  },
  {
    ...useFieldData("radio"),
    options: [
      { label: "单选-A", value: "radio-1" },
      { label: "单选-B", value: "radio-2" }
    ],
    defaultValue: "radio-1"
  },
  {
    ...useFieldData("switch"),
    defaultValue: true
  },
  {
    ...useFieldData("textarea"),
    placeholder: fieldTitleMap.textarea
  },
  {
    ...useFieldData("input-between"),
    placeholder: ["范围区间操作", "范围区间操作"]
  },
];
</script>
<style lang="scss"></style>
