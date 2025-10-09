<script lang="ts">
/** 表单相关功能组件 */
export default {
  name: "Field"
}
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { convertPx, fieldTitleMap, initField } from "./data";
import type { CurdType } from "./types";
import { deepClone, inputOnlyNumber, isType } from "@/utils";
import { DatePicker, SelectField } from "./part";

const props = defineProps({
  fieldData: {
    type: Object as PropType<CurdType.Field>,
    required: true
  },
  /**
   * 是否为编辑模式
   * - 主要为`radio`和`checkbox`组件做空数据占位显示用
   */
  editMode: Boolean,
  readonly: Boolean,
  disabled: Boolean
});

const emit = defineEmits<{
  (event: "change", val: any): void;
}>();

// TODO: 初始化时设置默认值给组件
initField(props.fieldData);

function onChange<T>(val?: T) {
  let result = val || props.fieldData.value;
  if (isType(result, "array")) {
    result = deepClone(result);
  }
  emit("change", result);
}

const data = computed(() => props.fieldData);

const optionSetting = computed(() => {
  const setting = (props.fieldData as CurdType.Select).optionSetting || {};
  return {
    value: setting.value || "value",
    label: setting.label || "label"
  }
});

const cascaderProps = computed(() => {
  const cascader = props.fieldData as CurdType.Cascader;
  const setting = cascader.optionSetting;
  return {
    multiple: cascader.multiple,
    checkStrictly: cascader.checkStrictly,
    value: setting.value || "value",
    label: setting.label || "label",
    children: setting.children || "children"
  }
});

function getInputProps(index?: number) {
  const tips = data.value.placeholder as string;
  return {
    disabled: props.disabled,
    readonly: props.readonly,
    clearable: true,
    placeholder: isType(index, "number") ? tips[index] : tips
  }
}

function onInput(value: string) {
  const field = props.fieldData;
  if (field.valueType === "number") {
    field.value = inputOnlyNumber(value, true, true);
    onChange(Number(field.value));
  } else {
    field.value = value;
    onChange();
  }
}

function onInputBetween(value: string, index: number) {
  const between = props.fieldData as CurdType.InputBetween;
  if (between.valueType === "array<number>") {
    between.value[index] = inputOnlyNumber(value, true, true);
    onChange(between.value.map(v => Number(v)));
  } else {
    between.value[index] = value;
    onChange();
  }
}

const numberSymbol: Array<any> = ["-", ".", "", null, undefined];

function onBlur() {
  const field = props.fieldData;
  if (field.valueType === "number") {
    if (numberSymbol.includes(field.value)) {
      field.value = "";
    } else {
      field.value = Number(field.value);
    }
  }
}

function onBlurBetween(index: number) {
  const between = props.fieldData as CurdType.InputBetween;
  if (between.valueType === "array<number>") {
    const val = between.value[index];
    if (numberSymbol.includes(val)) {
      between.value[index] = "";
    } else {
      between.value[index] = Number(val);
    }
  }
}
</script>
<template>
  <div class="the-curd-form-field f-vertical short-value" :style="{ width: convertPx(data.valueWidth) }">
    <el-input
      v-if="data.type === 'input'"
      :model-value="data.value"
      v-bind="getInputProps()"
      class="the-curd-field"
      @input="onInput"
      @blur="onBlur"
    />
    <el-input
      v-if="data.type === 'textarea'"
      v-model="data.value"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :placeholder="data.placeholder"
      type="textarea"
      class="the-curd-field"
      @input="onChange()"
    />
    <template v-if="data.type === 'input-between'">
      <el-input
        :model-value="data.value[0]"
        v-bind="getInputProps(0)"
        class="f1"
        @input="e => onInputBetween(e, 0)"
        @blur="onBlurBetween(0)"
      />
      <el-text style="padding: 0 6px;">{{ data.separator }}</el-text>
      <el-input
        :model-value="data.value[1]"
        v-bind="getInputProps(1)"
        class="f1"
        @input="e => onInputBetween(e, 1)"
        @blur="onBlurBetween(1)"
      />
    </template>
    <SelectField
      v-if="data.type === 'select'"
      :config="data"
      :setting="optionSetting"
      :disabled="props.disabled"
      @change="onChange()"
    />
    <template v-if="data.type === 'checkbox'">
      <el-checkbox-group v-model="data.value" :disabled="props.disabled" @change="onChange()">
        <el-checkbox
          v-for="item in data.options"
          :key="item[optionSetting.value]"
          :value="item[optionSetting.value]"
        >
          {{ item[optionSetting.label] }}
        </el-checkbox>
      </el-checkbox-group>
      <el-text v-if="props.editMode && !data.options.length" type="primary">
        {{ fieldTitleMap.checkbox }}（空数据）
      </el-text>
    </template>
    <template v-if="data.type === 'radio'">
      <el-radio-group v-model="data.value" :disabled="props.disabled" @change="onChange()">
        <el-radio
          v-for="item in data.options"
          :key="item[optionSetting.value]"
          :value="item[optionSetting.value]"
        >
          {{ item[optionSetting.label] }}
        </el-radio>
      </el-radio-group>
      <el-text v-if="props.editMode && !data.options.length" type="primary">
        {{ fieldTitleMap.radio }}（空数据）
      </el-text>
    </template>
    <el-switch
      v-if="data.type === 'switch'"
      v-model="data.value"
      inline-prompt
      active-text="是"
      inactive-text="否"
      @change="onChange()"
    />
    <el-cascader
      v-if="data.type === 'cascader'"
      v-model="data.value"
      :options="data.options"
      :props="cascaderProps"
      :placeholder="data.placeholder"
      :disabled="props.disabled"
      clearable
      collapse-tags
      collapse-tags-tooltip
      filterable
      class="the-curd-field"
      @change="onChange()"
    />
    <DatePicker
      v-if="props.fieldData.type === 'date'"
      :config="props.fieldData"
      :disabled="props.disabled"
      @change="onChange()"
    />
  </div>
</template>
<style lang="scss">
.the-curd-form-field {
  width: 100%;

  .the-curd-field {
    width: 100%;
  }

  .is-multiple-select {
    .el-select__selection {
      flex-wrap: nowrap;
    }
  }
}

.the-date-shortcut-selected {
  color: var(--blue);
  background-color: var(--el-color-primary-light-9);
}
</style>
