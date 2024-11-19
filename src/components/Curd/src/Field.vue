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
      :autosize="{ minRows: 2, maxRows: 10 }"
      :placeholder="data.placeholder"
      type="textarea"
      class="the-curd-field"
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
    <template v-if="data.type === 'select' || data.type === 'select-multiple'">
      <el-select-v2
        v-if="data.options.length > 50"
        v-model="data.value"
        :options="data.options"
        :props="data.optionSetting"
        v-bind="getSelectProps(data)"
      />
      <el-select v-else v-model="data.value" v-bind="getSelectProps(data)">
        <el-option
          v-for="item in data.options"
          :key="item[optionSetting.value]"
          :value="item[optionSetting.value]"
          :label="item[optionSetting.label]"
        />
      </el-select>
    </template>
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
      :popper-class="data.id.toString()"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      class="the-curd-field"
      @change="resetPanelBtn"
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
import { computed, onMounted, type PropType } from "vue";
import { convertPx, fieldTitleMap, initFieldValue, shortcutMap } from "./data";
import type { CurdType } from "./types";
import { inputOnlyNumber, isType } from "@/utils";

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
initFieldValue(props.fieldData);

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

function getSelectProps(field: CurdType.SelectMultiple | CurdType.Select) {
  const isMultiple = field.type === "select-multiple";
  return {
    placeholder: field.placeholder,
    disabled: props.disabled,
    multiple: field.type === "select-multiple",
    clearable: true,
    filterable: true,
    collapseTags: true,
    class: `field-item${isMultiple ? " is-multiple-select" : ""}`
  }
}

// --------------------------------- 处理日期组件的快捷栏交互细节 ---------------------------------
/** 日期侧边栏按钮列表 */
let shortcutBtnList: Array<HTMLElement> = [];

const className = "the-date-shortcut-selected";

function resetPanelBtn() {
  const selected = document.querySelector(`.${className}`);
  selected && selected.classList.remove(className);
}

function selectPanelBtn(el: HTMLElement) {
  // resetPanelBtn(); // TODO: 因为日期组件的 change 事件会先触发，所以这里不需要再执行多一次了
  el.classList.add(className);
}

onMounted(function () {
  const field = props.fieldData;
  if (field.type === "date") {
    const className = `.${field.id} .el-picker-panel__sidebar`;
    const panel = document.querySelector(className);
    if (!panel) return console.warn("找不到日期快捷面板节点！");
    shortcutBtnList = Array.from(panel.children) as Array<HTMLElement>;
    shortcutBtnList.forEach(btn => {
      btn.addEventListener("click", () => selectPanelBtn(btn));
    });
    const index = field.shortcutIndex;
    if (isType(index, "number") && index >= 0) {
      selectPanelBtn(shortcutBtnList[index]);
    }
  }
});

</script>
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
