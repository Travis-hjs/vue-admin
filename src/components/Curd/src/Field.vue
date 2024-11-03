<template>
  <div class="the-curd-form-field f-vertical short-value" :style="{ width: convertPx(data.valueWidth) }">
    <el-input
      v-if="data.type === 'input'"
      :model-value="data.value"
      :placeholder="data.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      clearable
      class="the-curd-field"
      @input="onInput"
      @blur="onBlur"
    />
    <el-input
      v-if="data.type === 'textarea'"
      v-model="data.value"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :autosize="{ minRows: 2, maxRows: 10 }"
      :placeholder="data.placeholder"
      type="textarea"
      class="the-curd-field"
    />
    <template v-if="data.type === 'input-between'">
      <el-input
        :model-value="data.value[0]"
        :placeholder="data.placeholder[0]"
        :readonly="props.readonly"
        :disabled="props.disabled"
        clearable
        class="f1"
        @input="e => onInputBetween(e, 0)"
        @blur="onBlurBetween(0)"
      />
      <el-text style="padding: 0 6px;">{{ data.separator }}</el-text>
      <el-input
        :model-value="data.value[1]"
        :placeholder="data.placeholder[1]"
        :readonly="props.readonly"
        :disabled="props.disabled"
        clearable
        class="f1"
        @input="e => onInputBetween(e, 1)"
        @blur="onBlurBetween(1)"
      />
    </template>
    <el-select
      v-if="data.type === 'select' || data.type === 'select-multiple'"
      v-model="data.value"
      :placeholder="data.placeholder"
      :disabled="props.disabled"
      :multiple="data.type === 'select-multiple'"
      clearable
      filterable
      collapse-tags
      class="the-curd-field"
    >
      <el-option
        v-for="item in data.options"
        :key="item[optionSetting.value]"
        :value="item[optionSetting.value]"
        :label="item[optionSetting.label]"
      />
    </el-select>
    <template v-if="data.type === 'checkbox'">
      <el-checkbox-group v-model="data.value" :disabled="props.disabled">
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
      <el-radio-group v-model="data.value" :disabled="props.disabled">
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
    />
    <el-date-picker
      v-if="data.type === 'date'"
      v-model="(data.value as any)"
      :placeholder="data.placeholder"
      :type="data.dateType"
      :format="data.formatShow"
      :shortcuts="shortcutMap[data.dateType]"
      :disabled="props.disabled"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      class="the-curd-field"
    />
  </div>
</template>
<script lang="ts">
/** 表单相关功能组件 */
export default {
  name: "Field"
}
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { convertPx, fieldTitleMap, setFieldValue, shortcutMap } from "./data";
import { inputOnlyNumber } from "@/utils";
import type { CurdType } from "./types";

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

// TODO: 初始化时设置默认值给组件
setFieldValue(props.fieldData);

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
  return {
    multiple: cascader.multiple,
    checkStrictly: cascader.checkStrictly,
    value: cascader.optionSetting.value || "value",
    label: cascader.optionSetting.label || "label",
    children: cascader.optionSetting.children || "children"
  }
});

function onInput(value: string) {
  const field = props.fieldData;
  if (field.valueType === "number") {
    field.value = inputOnlyNumber(value, true, true);
  } else {
    field.value = value;
  }
}

function onInputBetween(value: string, index: number) {
  const between = props.fieldData as CurdType.InputBetween;
  if (between.valueType === "array<number>") {
    between.value[index] = inputOnlyNumber(value, true, true);
  } else {
    between.value[index] = value;
  }
}

const numberSymbol = ["-", "."];

function onBlur() {
  const field = props.fieldData;
  if (field.valueType === "number") {
    if (numberSymbol.includes(field.value as string)) {
      field.value = "";
    } else if (field.value !== "") {
      field.value = Number(field.value);
    }
  }
}

function onBlurBetween(index: number) {
  const between = props.fieldData as CurdType.InputBetween;
  if (between.valueType === "array<number>") {
    const val = between.value[index] as string;
    if (numberSymbol.includes(val)) {
      between.value[index] = "";
    } else if (val !== "") {
      between.value[index] = Number(val);
    }
  }
}
</script>
<style lang="scss">
.the-curd-form-field {
  width: 100%;
  .the-curd-field {
    width: 100%;
  }
}
</style>
