<template>
  <div class="the-curd-form-field f-vertical short-value" :style="{ width: data.valueWidth }">
    <el-input
      v-if="data.type === 'input'"
      v-model="data.value"
      :placeholder="data.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      clearable
      class="the-curd-field"
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
        v-model="data.value[0]"
        :placeholder="data.placeholder[0]"
        :readonly="props.readonly"
        :disabled="props.disabled"
        clearable
        class="f1"
      />
      <el-text style="padding: 0 6px;">{{ data.separator }}</el-text>
      <el-input
        v-model="data.value[1]"
        :placeholder="data.placeholder[1]"
        :readonly="props.readonly"
        :disabled="props.disabled"
        clearable
        class="f1"
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
      class="the-curd-field"
    >
      <el-option
        v-for="item in data.options"
        :key="item[optionSetting.value]"
        :value="item[optionSetting.value]"
        :label="item[optionSetting.label]"
      />
    </el-select>
    <el-checkbox-group v-if="data.type === 'checkbox'" v-model="data.value" :disabled="props.disabled">
      <el-checkbox
        v-for="item in data.options"
        :key="item[optionSetting.value]"
        :value="item[optionSetting.value]"
      >
        {{ item[optionSetting.label] }}
      </el-checkbox>
    </el-checkbox-group>
    <el-radio-group v-if="data.type === 'radio'" v-model="data.value" :disabled="props.disabled">
      <el-radio
        v-for="item in data.options"
        :key="item[optionSetting.value]"
        :value="item[optionSetting.value]"
      >
        {{ item[optionSetting.label] }}
      </el-radio>
    </el-radio-group>
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
      class="the-curd-field"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { setFieldDefaultValue, type CurdType } from "./index";
import { shortcutMap } from "./date";

const props = defineProps({
  fieldData: {
    type: Object as PropType<CurdType.Field>,
    required: true
  },
  readonly: Boolean,
  disabled: Boolean
});

// TODO: 设置默认值给组件
setFieldDefaultValue(props.fieldData);

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
</script>
<style lang="scss">
.the-curd-form-field {
  width: 100%;
  .the-curd-field {
    width: 100%;
  }
}
</style>
