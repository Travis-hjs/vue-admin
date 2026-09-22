<script lang="ts">
/** 表单项编辑器组件 */
export default {
  name: "FieldEditor"
}
</script>
<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import type { CurdType } from "../types";
import type { FieldEditorType } from "./types";
import { computed, onBeforeMount, reactive, ref } from "vue";
import {
  fieldTitleMap,
  getFieldData,
  dateTypeOptions,
  shortcutMap,
  dataArrayTypes
} from "../data";
import Example from "./Example.vue";
import Field from "../Field.vue";
import { checkType, deepClone, isType } from "@/utils";
import { message } from "@/utils/message";
import { validateEX } from "@/utils/dom";
import { Fields, type FieldType } from "@/components/Fields";
import { getInputRule } from "@/hooks/common";
import { editor } from "../data/html";
import { CodeEditor } from "@/components/CodeEditor";

const props = defineProps<FieldEditorType.Props>();

const emit = defineEmits<{
  (event: "update:show", val: boolean): void;
  (event: "close"): void;
  (event: "closed"): void;
}>();

const open = computed({
  get() {
    return props.show;
  },
  set(val) {
    emit("close");
    emit("update:show", val);
  },
});

function onClose() {
  open.value = false;
}

/** 没有宽度属性的组件类型 */
const noValueWidth = ["checkbox", "radio", "switch"];
/** 是否有选项数据的组件类型 */
const hasOptions = ["select", "radio", "checkbox", "cascader"];
/** 默认值为数字或字符串的组件类型 */
const stringAndNumber = ["input", "textarea", "select", "radio"];
/** 值为数组类型的组件 */
const arrayFields = ["input-between", "checkbox", "cascader"];
/** 允许为数字类型的组件 */
const allowNumberFields = ["input", "select", "radio"];
/** 需要校验为数字类型的组件 */
const checkNumberFields = allowNumberFields.concat(arrayFields);

const shortcutOptions = computed(() => {
  let option: Array<{ label: string; value: number }> = [];
  if (state.formData && state.formData.type === "date") {
    const list = shortcutMap[state.formData.dateType];
    option = list.map((item, index) => ({ label: item.text, value: index }));
  }
  option.unshift({
    label: "将预览组件中的值设为默认",
    value: -1
  });
  return option;
});

const state = reactive({
  step: 0,
  formData: undefined as (CurdType.Field | undefined),
});

function onStep(n: number) {
  state.step = n;
}

const formRules = {
  label: getInputRule("请输入功能标题"),
  key: {
    required: true,
    trigger: "blur",
    validator(_r: any, val: string, callback: (err?: Error) => void) {
      if (!val) {
        callback(new Error("绑定的键值不能为空"));
      } else {
        if (keyList.includes(val)) {
          callback(new Error("当前键值已经被占用！"));
        } else {
          callback();
        }
      }
    }
  },
  format: getInputRule("格式化规则不能为空"),
  separator: getInputRule("请输入串联符号"),
  defaultValue: {
    required: true,
    trigger: "blur",
    validator(_r: any, _v: string, callback: (err?: Error) => void) {
      const res = checkDefaultValue();
      if (res === true) {
        callback();
      } else {
        callback(new Error(res));
      }
      callback();
    }
  },
  options: {
    required: true,
    trigger: "blur",
    validator(_r: any, _v: string, callback: (err?: Error) => void) {
      const res = checkOptions();
      if (res === true) {
        callback();
      } else {
        callback(new Error(res));
      }
    }
  },
  show: {
    trigger: "blur",
    validator(_r: any, v: string, callback: (err?: Error) => void) {
      if (v && !v.includes("return")) {
        callback(new Error("逻辑代码必须包含 return 关键字"));
        return;
      }
      callback();
    }
  },
};

const formItems = computed(() => {
  const fieldType = state.formData ? state.formData.type : "";
  const list: Array<FieldType.Member<CurdType.Field>> = [
    {
      label: "组件标题",
      prop: "label",
      type: "input",
      placeholder: formRules.label.message
    },
    {
      label: "绑定的键值",
      prop: "key",
      type: "input",
      placeholder: "请输入绑定的键值",
      class: "value-box-short",
    },
    {
      label: "标题宽度",
      prop: "labelWidth",
      type: "number",
      placeholder: "例如：120(px)",
      class: "value-box-short",
    },
    {
      label: "组件宽度",
      prop: "valueWidth",
      type: "number",
      placeholder: "例如：140(px)",
      show: () => !noValueWidth.includes(fieldType),
      class: "value-box-short",
    },
    {
      label: "标题提示文案",
      prop: "tooltip",
      type: "input",
      placeholder: "鼠标移上文字的提示文案"
    },
    {
      label: "提示/规则文字",
      prop: "placeholder",
      type: "slot",
      slotName: "ruleText"
    },
    {
      label: "是否必填",
      prop: "required",
      type: "switch",
    }
  ];

  if (checkNumberFields.includes(fieldType)) {
    const isNumberItem: FieldType.Member<CurdType.Field> = {
      label: "绑定值为数字类型",
      prop: "valueType",
      type: "switch",
      activeValue: "number",
      inactiveValue: "string"
    }
    if (arrayFields.includes(fieldType)) {
      isNumberItem.activeValue = "array<number>";
      isNumberItem.inactiveValue = "array"
    }
    if (hasOptions.includes(fieldType)) {
      isNumberItem.tips = "设为数字类型之后，将会在保存时校验选项数据";
    }
    list.push(isNumberItem);
  }
  
  if (fieldType !== "date") {
    list.push({
      label: "组件默认值",
      prop: "defaultValue" as any,
      type: "slot",
      slotName: "defaultValue"
    });
  }
  
  if (fieldType === "input-between") {
    list.push({
      label: "串联符号",
      prop: "separator" as any,
      type: "input",
      placeholder: formRules.separator.message,
      class: "value-box-short",
    });
  }

  if (hasOptions.includes(fieldType)) {
    const optionItems: Array<FieldType.Member<CurdType.Select>> = [
      {
        label: "选项数据",
        prop: "options",
        type: "slot",
        slotName: "options"
      },
      {
        label: "数据展示字段",
        prop: "optionSetting.label",
        type: "input",
        placeholder: "不填则使用 label",
        class: "value-box-short",
      },
      {
        label: "数据值字段",
        prop: "optionSetting.value",
        type: "input",
        placeholder: "不填则使用 value",
        class: "value-box-short",
      }
    ];

    if (fieldType === "cascader") {
      const cascaderItems: Array<FieldType.Member<CurdType.Cascader>> = [
        {
          label: "下级字段",
          prop: "optionSetting.children",
          type: "input",
          placeholder: "不填则使用 children",
          class: "value-box-short",
        },
        {
          label: "是否多选",
          prop: "multiple",
          type: "switch"
        },
        {
          label: "允许只选中某一项",
          prop: "checkStrictly",
          type: "switch"
        }
      ];
      optionItems.push(...cascaderItems as any);
    }

    if (fieldType === "select") {
      const select = state.formData as CurdType.Select;
      optionItems.push(
        {
          label: "是否为多选",
          prop: "multiple",
          type: "switch",
          onChange(val) {
            json.defaultValue = JSON.stringify({
              value: val ? [] : ""
            });
          },
        },
        {
          label: "选中标签最多数量",
          prop: "max",
          type: "number",
          placeholder: "请输入数量，默认1",
          class: "value-box-short",
          show: () => !!select.multiple,
        },
        {
          label: "串联显示名称",
          prop: "joinShow",
          type: "switch",
          tips: "例如【英雄联盟-12】"
        }
      );
    }

    list.push(...optionItems as any);
  }

  if (fieldType === "date") {
    const dateItems: Array<FieldType.Member<CurdType.Date>> = [
      {
        label: "日期类型",
        prop: "dateType",
        type: "select",
        options: dateTypeOptions,
        noClear: true,
        onChange: onDateType,
        class: "value-box-short",
      },
      {
        label: "日期默认值",
        prop: "shortcutIndex",
        type: "select",
        options: shortcutOptions.value,
        placeholder: "请选择",
        class: "value-box-short",
      },
      {
        label: "格式化规则",
        prop: "format",
        type: "input",
        tooltip: editor.formatTips,
        class: "value-box-short",
      }
    ];

    list.push(...dateItems as any);
  }

  if (props.type === "table") {
    list.push({
      label: "表单显示逻辑",
      prop: "show",
      type: "slot",
      slotName: "showCode",
      tooltip: editor.showTips
    });
  }

  return list;
});

const formRef = ref<FormInstance>();

const json = reactive({
  /**
   * 选项数据
   * - 字符串格式为`[]`
   */
  options: "",
  /**
   * 组件默认值
   * - 字符串格式为`{ "value": "xxx" }`
   */
  defaultValue: ""
});

function setJson(field: CurdType.Field) {
  if (field.type !== "date") {
    json.defaultValue = JSON.stringify({
      value: field.defaultValue
    });
  }
  if (hasOptions.includes(field.type)) {
    json.options = JSON.stringify((field as CurdType.Select).options);
  }
}

/**
 * 选中某个组件
 * @param type
 */
function chooseField(type: CurdType.Field["type"]) {
  const field = getFieldData(type, "", props.type === "search");
  state.formData = field;
  setJson(field);
  formRef.value?.clearValidate();
  onStep(1);
}

/** 检查默认值是否合法 */
function checkDefaultValue() {
  const formatError = `输入的格式必须为 { "value": "input value" }`;
  const val = json.defaultValue;
  if (!val) return formatError;
  const type = state.formData!.type;
  const valueType = state.formData!.valueType;
  const name = fieldTitleMap[type];
  const isMultiple = type === "select" && (state.formData as CurdType.Select).multiple;
  try {
    const obj = JSON.parse(val);
    if (!isType<{ value: any }>(obj, "object")) return formatError;
    if (type === "switch") {
      if (!isType(obj.value, "boolean")) return `${name}的绑定值应该为 boolean 类型`;
    }
    if (arrayFields.includes(type) || isMultiple) {
      if (!isType(obj.value, "array")) return `${name}的绑定值应该为 array 类型`;
      if (valueType === "array<number>" && obj.value.some(val => (val !== "" && !isType(val , "number")))) return "数组中只能出现数字";
    }
    if (stringAndNumber.includes(type) && !isMultiple) {
      if (!["string", "number"].includes(checkType(obj.value))) return `${name}的绑定值应该为 string/number 类型`;
    }
    if (type === "date") {
      const field = state.formData as CurdType.Date;
      if (dataArrayTypes.includes(field.dateType)) {
        if (!isType(obj.value, "array")) return "范围日期绑定值应该为 array 类型";
      }
      else {
        if (!isType(obj.value, "string")) return "日期类型绑定值应该为 string 类型";
      }
    }
    if (allowNumberFields.includes(type) && valueType === "number" && obj.value !== "" && !isType(obj.value, "number")) {
      return `${name}的绑定值应该为 number 类型`;
    }
  } catch (error) {
    console.warn("检查默认值是否合法错误 >>", error);
    return `${error}`;
  }
  return true;
}

/** 检查数据选项是否合法 */
function checkOptions() {
  const val = json.options;
  if (!val) return "选项数据不能为空！";
  try {
    const list = JSON.parse(val);
    if (!isType(list, "array")) return "选项数据格式不正确，需要为数组类型！";
    const field = state.formData as CurdType.Select;
    const key = field.optionSetting.value! || "value";
    const empty = [undefined, null];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (!isType<BaseObj<any>>(item, "object")) {
        return "数组项必须为对象！";
      }
      if (empty.includes(item[key])) {
        return `数组项的值不能为${empty.join("/")}`;
      }
      if (["array<number>", "number"].includes(field.valueType) && !isType(item[key], "number") && item[key] !== "") {
        return "数组项的值必须为 number 类型"
      }
    }
    return true;
  } catch (error) {
    console.warn("checkOptions >>", error);
    return "不合法的JSON,注意使用双引号,结尾不能为逗号等";
  }
}

function onOptions() {
  const res = checkOptions();
  if (res === true) {
    (state.formData as CurdType.Select).options = JSON.parse(json.options);
  }
}

function onDefaultValue() {
  const res = checkDefaultValue();
  if (res === true) {
    const field = state.formData!;
    const value = JSON.parse(json.defaultValue).value;
    if (field.type !== "date") {
      field.defaultValue = value;
    }
  }
}

function onDateType(type: CurdType.Date["dateType"]) {
  const item = dateTypeOptions.find(item => item.value === type)!;
  const dateField = state.formData as CurdType.Date;
  dateField.shortcutIndex = "";
  if (dataArrayTypes.includes(item.value)) {
    dateField.value = [];
    dateField.valueType = "array";
  } else {
    dateField.value = "";
    dateField.valueType = "string";
  }
  dateField.formatShow = item.formatShow;
  dateField.format = item.format;
}

function isNumber(value: string) {
  return /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(value);
}

function onSubmit() {
  formRef.value?.validate(valid => {
    validateEX(".the-curd-editor-form", valid);
    if (!valid) return;
    onDefaultValue();
    hasOptions.includes(state.formData!.type) && onOptions();
    const form = deepClone<any>(state.formData, true);
    hasOptions.includes(form.type) && onOptions();
    // TODO: 处理空类型
    if (!form.valueType) {
      form.valueType = checkType(form.defaultValue);
    }
    // TODO: 判断选项数据是否合法并进行值的转换
    if (hasOptions.includes(form.type) && ["number", "array<number>"].includes(form.valueType)) {
      let optionKey = form.optionSetting.value;
      // 当没有配置字段时，默认设置为`"value"`
      if (!optionKey) {
        optionKey = "value";
        form.optionSetting.value = optionKey;
      }
      for (let i = 0; i < form.options.length; i++) {
        const option = form.options[i];
        const optionValue = option[optionKey];
        if ([null, undefined].includes(optionValue as any)) return message.error(`数据值字段与选项数据不匹配，请检查！`);
        if (isNumber(optionValue.toString())) {
          option[optionKey] = Number(optionValue);
        } else {
          const label = option[form.optionSetting.label];
          return message.error(`选项数据中【${label}】的值应该为数字！`);
        }
      }
    }
    // TODO: 处理日期默认值
    if (form.type === "date") {
      if (form.shortcutIndex === -1) {
        form.shortcutDate = form.value;
      }
      form.value = form.valueType === "array" ? [] : "";
    }
    // console.log("submit form >>", form);
    const actionMap = {
      search(add: boolean) {
        if (add) {
          props.searches!.push(form);
        } else {
          props.searches![props.index] = form;
        }
      },
      table(add: boolean) {
        if (add) {
          props.form!.fields.push(form);
        } else {
          props.form!.fields[props.index] = form;
        }
      }
    }
    const isAdd = props.action !== "edit";
    actionMap[props.type!](isAdd);
    onClose();
  });
}

let keyList: Array<string> = [];

/**
 * 更新表单项`key`列表
 * @param excludeKey 需要排除的值
 */
function updateKeyList(excludeKey?: string) {
  keyList = [];
  const actionMap = {
    search() {
      keyList = props.searches!.map(item => item.key);
    },
    table() {
      keyList = props.form!.fields.map(item => item.key);
    }
  }
  actionMap[props.type!]();
  if (excludeKey) {
    keyList = keyList.filter(val => val !== excludeKey);
  }
}

const title = computed(() => {
  let text = `配置${props.type === "search" ? "筛选项" : "表单项"}`;
  if (state.step && state.formData) {
    text = `${text} 《${fieldTitleMap[state.formData.type]}》`;
  }
  return text;
});

onBeforeMount(() => {
  if (props.action === "add") {
    updateKeyList();
  } else {
    const current = props.index;
    const actionMap = {
      search() {
        state.formData = deepClone(props.searches![current], true);
      },
      table() {
        state.formData = deepClone(props.form?.fields[current], true);
      }
    }
    actionMap[props.type!]();
    if (props.action === "copy") {
      state.formData!.id += `${state.formData!.id}-copy-${Date.now()}`;
      state.formData!.key = "";
    }
    setJson(state.formData!);
    updateKeyList(state.formData!.key);
    state.step = 1;
  }
})
</script>
<template>
  <base-dialog
    :show="open"
    :title="title"
    width="680px"
    @close="onClose"
    @closed="emit('closed')"
  >
    <template v-if="state.step === 0">
      <h2 class="the-title mb-[20px]">第1步：点击选取组件</h2>
      <Example
        :selected="state.formData?.type"
        :type="props.type"
        @choose="chooseField"
      />
    </template>
    <template v-if="state.step === 1 && state.formData">
      <div class="f-vertical mb-[20px]">
        <h2 class="the-title">第2步：配置{{ fieldTitleMap[state.formData!.type] }}</h2>
        <div class="f1"></div>
        <el-button size="small" type="warning" @click="onStep(0)">
          <i class="el-icon--left el-icon-back" />
          上一步
        </el-button>
      </div>
      <div v-if="state.formData" class="the-curd-target-box">
        <Field :field-data="state.formData" edit-mode />
      </div>
      <el-form
        v-if="state.formData"
        ref="formRef"
        class="the-curd-editor-form"
        :model="state.formData"
        :rules="formRules"
        label-position="right"
        label-width="140px"
      >
        <Fields :data="state.formData" :list="formItems">
          <template #ruleText>
            <template v-if="state.formData.type === 'input-between'">
              <el-input
                v-model="state.formData.placeholder[0]"
                class="f1"
                clearable
                placeholder="请输入提示-1"
              />
              <el-text class="px-[6px]!">-</el-text>
              <el-input
                v-model="state.formData.placeholder[1]"
                class="f1"
                clearable
                placeholder="请输入提示-2"
              />
            </template>
            <el-input
              v-else
              v-model="state.formData.placeholder"
              clearable
              placeholder="请输入规则提示/输入框提示文字"
            />
          </template>
          <template #defaultValue>
            <CodeEditor
              v-model:value="json.defaultValue"
              language="json"
              placeholder="请输入JSON，值为 value"
              @blur="onDefaultValue()"
            />
          </template>
          <template #options>
            <CodeEditor
              v-model:value="json.options"
              language="json"
              placeholder="请输入JSON数组"
              class="mb-[10px]"
              @blur="onOptions()"
            />
            <el-button link type="primary">
              <a href="https://www.json.cn/" target="_blank">
                JSON编辑工具
              </a>
            </el-button>
          </template>
          <template #showCode>
            <CodeEditor
              v-model:value="(state.formData.show as string)"
              language="js"
              placeholder="请输入条件代码，为空则默认展示"
              class="mb-[10px]"
              @blur="onOptions()"
            />
          </template>
        </Fields>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="onClose">退出编辑</el-button>
      <template v-if="state.step === 1">
        <el-button type="warning" @click="onStep(0)">
          <i class="el-icon--left el-icon-back" />
          上一步
        </el-button>
        <el-button v-if="props.action === 'edit'" type="success" @click="onSubmit">
          <i class="el-icon--left el-icon-edit"></i>
          保存修改
        </el-button>
        <el-button v-else type="primary" @click="onSubmit">
          <i class="el-icon--left el-icon-plus"></i>
          {{ props.action === 'copy' ? '新增复制' : '新 增' }}
        </el-button>
      </template>
    </template>
  </base-dialog>
</template>
