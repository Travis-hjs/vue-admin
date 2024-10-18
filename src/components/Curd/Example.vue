<template>
  <div class="the-curd-example">
    <Field
      class="the-curd-example-item fvc"
      :class="[{ 'is-select': props.selected === 'input' }]"
      :field-data="example.input"
      readonly
      @click="emit('choose', 'input')"
    />
    <Field
      class="the-curd-example-item fvc no-r"
      :class="[{ 'is-select': props.selected === 'select' }]"
      :field-data="example.select"
      @click="emit('choose', 'select')"
    />
    <Field
      class="the-curd-example-item fvc"
      :class="[{ 'is-select': props.selected === 'select-multiple' }]"
      :field-data="example['select-multiple']"
      @click="emit('choose', 'select-multiple')"
    />
    <Field
      class="the-curd-example-item fvc no-r"
      :class="[{ 'is-select': props.selected === 'cascader' }]"
      :field-data="example.cascader"
      @click="emit('choose', 'cascader')"
    />
    <Field
      class="the-curd-example-item fvc full no-r"
      :class="[{ 'is-select': props.selected === 'input-between' }]"
      :field-data="example['input-between']"
      readonly
      @click="emit('choose', 'input-between')"
    />
    <Field
      class="the-curd-example-item fvc"
      :class="[{ 'is-select': props.selected === 'checkbox' }]"
      :field-data="example.checkbox"
      @click="emit('choose', 'checkbox')"
    />
    <Field
      class="the-curd-example-item fvc no-r"
      :class="[{ 'is-select': props.selected === 'radio' }]"
      :field-data="example.radio"
      @click="emit('choose', 'radio')"
    />
    <Field
      class="the-curd-example-item fvc"
      :class="[{ 'is-select': props.selected === 'switch' }]"
      :field-data="example.switch"
      @click="emit('choose', 'switch')"
    />
    <Field
      class="the-curd-example-item fvc no-r"
      :class="[{ 'is-select': props.selected === 'date' }]"
      :field-data="example.date"
      @click="emit('choose', 'date')"
    />
    <Field
      class="the-curd-example-item fvc full no-r no-b"
      :class="[{ 'is-select': props.selected === 'textarea' }]"
      :field-data="example.textarea"
      readonly
      @click="emit('choose', 'textarea')"
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

const example = {
  input: {
    ...useFieldData("input"),
    placeholder: fieldTitleMap.input
  },
  textarea: {
    ...useFieldData("textarea"),
    placeholder: fieldTitleMap.textarea
  },
  "input-between": {
    ...useFieldData("input-between"),
    placeholder: ["范围区间操作", "范围区间操作"]
  },
  select: {
    ...useFieldData("select"),
    placeholder: fieldTitleMap.select
  },
  "select-multiple": {
    ...useFieldData("select-multiple"),
    placeholder: fieldTitleMap["select-multiple"]
  },
  checkbox: {
    ...useFieldData("checkbox"),
    options: [
      { label: "多选-A", value: 1 },
      { label: "多选-B", value: 2 }
    ],
    value: [1]
  },
  radio: {
    ...useFieldData("radio"),
    options: [
      { label: "单选-A", value: "radio-1" },
      { label: "单选-B", value: "radio-2" }
    ],
    value: "radio-1"
  },
  switch: {
    ...useFieldData("switch"),
    value: true
  },
  date: {
    ...useFieldData("date"),
    placeholder: fieldTitleMap.date
  },
  cascader: {
    ...useFieldData("cascader"),
    placeholder: fieldTitleMap.cascader
  }
};
</script>
<style lang="scss">
.the-curd-example {
  --border: dashed 1px #ccc;

  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: var(--border);

  .the-curd-example-item {
    position: relative;
    width: 50%;
    min-height: 54px;
    padding: 4px 10px;
    border-right: var(--border);
    border-bottom: var(--border);

    &.no-r {
      border-right: none;
    }

    &.no-b {
      border-bottom: none;
    }

    &::after {
      position: absolute;
      width: 100%;
      height: 100%;
      cursor: pointer;
      content: "";
    }

    &.full {
      width: 100%;
    }
  }

  .the-curd-example-item.is-select::after {
    background-color: var(--select-mask);
    // content: "当前选中";
  }
}
</style>
