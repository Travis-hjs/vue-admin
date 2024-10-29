<template>
  <section :class="['the-curd-editor the-curd-scrollbar', { 'is-show': props.show }]">
    <transition name="the-curd-editor-move">
      <div v-if="props.show" class="the-curd-editor-content">
        <h2 class="the-title mgb-20">基础设置</h2>
        <el-form label-position="right" label-width="120px">
          <template v-if="provideState.editor.type === 'search'">
            <el-form-item label="整体标题宽度">
              <el-input-number
                v-model="props.config.search.labelWidth"
                class="w-full"
                controls-position="right"
                placeholder="例如：120px"
              />
            </el-form-item>
            <el-form-item label="标题靠右对齐">
              <el-switch
                v-model="props.config.search.labelRight"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </template>
          <template v-if="provideState.editor.type === 'table' && provideState.editor.form">
            <el-form-item label="表单宽度">
              <el-input-number
                v-model="provideState.editor.form.width"
                class="w-full"
                controls-position="right"
                placeholder="请输入宽度(px)"
                clearable
              />
            </el-form-item>
            <el-form-item label="文字宽度">
              <el-input-number
                v-model="provideState.editor.form.labelWidth"
                class="w-full"
                controls-position="right"
                placeholder="请输入标题宽度(px)"
                clearable
              />
            </el-form-item>
            <el-form-item label="文字靠右排版">
              <el-switch
                v-model="provideState.editor.form.labelPosition"
                inline-prompt
                active-value="right"
                inactive-value="left"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </template>
        </el-form>
        <template v-if="state.step === 0">
          <div class="f-vertical f-between mgb-20">
            <h2 class="the-title">第1步：点击选取组件</h2>
            <el-button link type="primary" @click="onClose()">退出编辑</el-button>
          </div>
          <Example
            :selected="state.formData?.type"
            :type="provideState.editor.type"
            @choose="chooseField"
          />
        </template>
        <template v-if="state.step === 1">
          <div class="f-vertical mgb-20">
            <h2 class="the-title">第2步：配置{{ fieldTitleMap[state.formData!.type] }}</h2>
            <div class="f1"></div>
            <el-button link type="success" @click="onStep(0)">上一步</el-button>
            <el-button link type="primary" @click="onClose()">退出编辑</el-button>
          </div>
          <div v-if="state.formData" class="the-curd-target-box">
            <Field :field-data="state.formData" edit-mode />
          </div>
          <el-form
            v-if="state.formData"
            id="the-editor-form"
            ref="formRef"
            :model="state.formData"
            :rules="formRules"
            label-position="right"
            label-width="128px"
          >
            <el-form-item label="组件标题" prop="label">
              <el-input v-model="state.formData.label" clearable :placeholder="formRules.label[0].message" />
            </el-form-item>
            <el-form-item label="绑定的键值" prop="key">
              <el-input v-model="state.formData.key" clearable placeholder="请输入绑定的键值" />
            </el-form-item>
            <el-form-item label="标题宽度" prop="labelWidth">
              <el-input-number
                v-model="state.formData.labelWidth"
                class="w-full"
                controls-position="right"
                placeholder="请输入宽度，例如：120"
              />
            </el-form-item>
            <el-form-item v-if="!noValueWidth.includes(state.formData.type)" label="组件宽度" prop="valueWidth">
              <el-input-number
                v-model="state.formData.valueWidth"
                class="w-full"
                controls-position="right"
                placeholder="请输入宽度，例如：140"
              />
            </el-form-item>
            <el-form-item label="提示/规则文字" prop="placeholder">
              <template v-if="state.formData.type === 'input-between'">
                <el-input
                  v-model="state.formData.placeholder[0]"
                  class="f1"
                  clearable
                  placeholder="文字-1"
                />
                <el-text style="padding: 0 6px;">-</el-text>
                <el-input
                  v-model="state.formData.placeholder[1]"
                  class="f1"
                  clearable
                  placeholder="文字-2"
                />
              </template>
              <el-input v-else v-model="state.formData.placeholder" clearable placeholder="请输入规则提示/输入框提示文字" />
            </el-form-item>
            <el-form-item v-if="state.formData.type !== 'date'" prop="defaultValue">
              <template #label>
                组件默认值
                <el-tooltip
                  v-if="hasOptions.includes(state.formData.type)"
                  :content="numberTips"
                  effect="dark"
                  raw-content
                  placement="top-start"
                >
                  <el-button type="info" link style="height: 32px;">
                    <i class="el-icon-question"></i>
                  </el-button>
                </el-tooltip>
              </template>
              <el-input
                v-model="json.defaultValue"
                type="textarea"
                clearable
                placeholder="请输入JSON，值为 value"
                @blur="onDefaultValue()"
              />
            </el-form-item>
            <el-form-item v-if="state.formData.type === 'input-between'" label="串联符号" prop="separator">
              <el-input
                v-model="(state.formData as CurdType.InputBetween).separator"
                clearable
                :placeholder="formRules.separator[0].message"
              />
            </el-form-item>
            <template v-if="hasOptions.includes(state.formData.type)">
              <el-form-item label="选项数据" prop="options">
                <el-input
                  v-model="json.options"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  placeholder="请输入数组JSON"
                  class="mbg-10"
                  @blur="onOptions()"
                />
              </el-form-item>
              <el-form-item label="数据展示字段" prop="optionSetting.label">
                <el-input
                  v-model="(state.formData as CurdType.Select).optionSetting.label"
                  clearable
                  placeholder="不填则使用 label"
                />
              </el-form-item>
              <el-form-item label="数据值字段" prop="optionSetting.value">
                <el-input
                  v-model="(state.formData as CurdType.Select).optionSetting.value"
                  clearable
                  placeholder="不填则使用 value"
                />
              </el-form-item>
              <template v-if="state.formData.type === 'cascader'">
                <el-form-item label="下级字段" prop="optionSetting.children">
                  <el-input
                    v-model="state.formData.optionSetting.children"
                    clearable
                    placeholder="不填则使用 children"
                  />
                </el-form-item>
                <el-form-item label="是否多选" prop="multiple">
                  <el-switch
                    v-model="state.formData.multiple"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                  ></el-switch>
                </el-form-item>
                <el-form-item label="允许只选中某一项" prop="checkStrictly">
                  <el-switch
                    v-model="state.formData.checkStrictly"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                  ></el-switch>
                </el-form-item>
              </template>
            </template>
            <template v-if="state.formData.type === 'date'">
              <el-form-item label="日期类型" prop="dateType">
                <el-select v-model="state.formData.dateType" style="width: 100%;" @change="onDateType">
                  <el-option
                    v-for="item in dateTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="日期默认值" prop="shortcutIndex">
                <el-select v-model="state.formData.shortcutIndex" style="width: 100%;" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in dateShortcutOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="format">
                <template #label>
                  格式化规则
                  <el-tooltip
                    effect="dark"
                    :content="formatTips"
                    raw-content
                    placement="top-start"
                  >
                    <el-button type="info" link style="height: 32px;">
                      <i class="el-icon-question"></i>
                    </el-button>
                  </el-tooltip>
                </template>
                <el-input
                  v-model="state.formData.format"
                  clearable
                  :placeholder="formRules.format[0].message"
                />
              </el-form-item>
            </template>
            <el-form-item v-if="provideState.editor.type === 'table'" label="是否必填" prop="required">
              <el-switch
                v-model="state.formData.required"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
            <div class="f-right">
              <el-button @click="onClose()">关闭</el-button>
              <el-button v-if="isAdd" type="primary" @click="onSubmit()">
                <i class="el-icon--left el-icon-plus"></i>
                新增
              </el-button>
              <el-button v-else type="success" @click="onSubmit()">
                <i class="el-icon--left el-icon-edit"></i>
                确认
              </el-button>
            </div>
          </el-form>
        </template>
      </div>
    </transition>
  </section>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, watch, type PropType } from "vue";
import { fieldTitleMap, getFieldData, useProvideState, type CurdType } from "./index";
import Example from "./Example.vue";
import Field from "./Field.vue";
import type { FormInstance } from "element-plus";
import { checkType, isType } from "@/utils";
import { dateTypeOptions, shortcutMap } from "./date";
import { message } from "@/utils/message";
import { validateEX } from "@/utils/dom";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object as PropType<CurdType.Config>,
    required: true
  }
});

const emit = defineEmits<{
  (event: "update:show", val: boolean): void;
}>();

function onClose(val = false) {
  emit("update:show", val);
}

const noValueWidth = ["checkbox", "radio", "switch"];

const hasOptions = ["select", "select-multiple", "radio", "checkbox", "cascader"];

const stringAndNumber = ["input", "textarea", "select", "radio"];

const arrayField = ["input-between", "select-multiple", "checkbox"];

const arrayDate = ["daterange", "datetimerange"];

const numberTips = `
<p>当需要设置组件的绑定值为数字类型时，</p>
<p>可以填入<b style="color: var(--yellow)"> {"value": -1} </b>来实现，</p>
<p><b style="color: var(--yellow)"> -1 </b>为代码中约定的特殊处理，</p>
<p>默认值依然是空的字符串</p>
`;

const formatTips = `
<p>参考 src/utils/index.ts 中的<b style="color: var(--yellow)"> formatDate </b>函数</p>
`

/** 父组件注入的对象 */
const provideState = useProvideState();

const isAdd = computed(() => provideState.editor.action === "add");

const dateShortcutOptions = computed(() => {
  if (state.formData && state.formData.type === "date") {
    const list = shortcutMap[state.formData.dateType];
    return list.map((item, index) => ({ label: item.text, value: index }));
  }
  return [];
});

const state = reactive({
  step: 0,
  formData: undefined as (CurdType.Field | undefined),
});

function onStep(n: number) {
  state.step = n;
}

const formRules = {
  label: [{ required: true, message: "请输入功能标题", trigger: "blur" }],
  key: [
    {
      required: true,
      trigger: "blur",
      validator(r: any, val: string, callback: (err?: Error) => void) {
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
    }
  ],
  format: [{ required: true, message: "格式化规则不能为空", trigger: "blur" }],
  separator: [{ required: true, message: "请输入串联符号", trigger: "blur" }],
  defaultValue: [
    {
      required: true,
      trigger: "blur",
      validator(r: any, v: string, callback: (err?: Error) => void) {
        const res = checkDefaultValue();
        if (res === true) {
          callback();
        } else {
          callback(new Error(res));
        }
        callback();
      }
    }
  ],
  options: [
    {
      required: true,
      trigger: "blur",
      validator(r: any, v: string, callback: (err?: Error) => void) {
        const res = checkOptions();
        if (res === true) {
          callback();
        } else {
          callback(new Error(res));
        }
      }
    }
  ],

};

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
  const editor = provideState.editor;
  const field = getFieldData(type, "", editor.type === "search");
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
  const name = fieldTitleMap[type];
  try {
    const obj = JSON.parse(val);
    if (!isType<{ value: any }>(obj, "object")) return formatError;
    if (type === "switch") {
      if (!isType(obj.value, "boolean")) return `${name}的绑定值应该为 boolean 类型`;
    }
    else if (arrayField.includes(type)) {
      if (!isType(obj.value, "array")) return `${name}的绑定值应该为 array 类型`;
    }
    else if (stringAndNumber.includes(type)) {
      if (!["string", "number"].includes(checkType(obj.value))) return `${name}的绑定值应该为 string/number 类型`;
    }
    else if (type === "date") {
      const field = state.formData as CurdType.Date;
      if (arrayDate.includes(field.dateType)) {
        if (!isType(obj.value, "array")) return "范围日期绑定值应该为 array 类型";
      }
      else {
        if (!isType(obj.value, "string")) return "日期类型绑定值应该为 string 类型";
      }
    }
  } catch (error) {
    console.warn("checkDefaultValue >>", error);
    return formatError;
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
    const isAccord = list.every(item => isType(item, "object"));
    if (!isAccord) return "数组项必须为对象！";
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
  // console.log("选择日期类型 >>", item);
  dateField.shortcutIndex = "";
  if (arrayDate.includes(item.value)) {
    dateField.value = [];
  } else {
    dateField.value = "";
  }
  dateField.formatShow = item.formatShow;
  dateField.format = item.format;
}

function isNumber(value: string) {
  return /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(value);
}

function onSubmit() {
  formRef.value?.validate(valid => {
    validateEX("#the-editor-form", valid);
    if (!valid) return
    onDefaultValue();
    hasOptions.includes(state.formData!.type) && onOptions();
    const editor = provideState.editor;
    const data: CurdType.Select = JSON.parse(JSON.stringify(state.formData));
    hasOptions.includes(data.type) && onOptions();
    data.valueType = checkType(data.defaultValue);
    // TODO: 转换数字类型处理
    if (data.defaultValue === -1) {
      data.defaultValue = "";
      data.valueType = "number";
    }
    // TODO: 判断选项数据是否合法并进行值的转换
    if (hasOptions.includes(data.type) && data.valueType === "number") {
      const optionKey = data.optionSetting.value;
      // 当没有配置字段时，默认设置为`"value"`
      if (!optionKey) {
        data.optionSetting.value = "value";
      }
      for (let i = 0; i < data.options.length; i++) {
        const option = data.options[i];
        const optionValue = option[optionKey];
        if ([null, undefined].includes(optionValue as any)) return message.error(`数据值字段与选项数据不匹配，请检查！`);
        if (isNumber(optionValue.toString())) {
          option[optionKey] = Number(optionValue);
        } else {
          const label = option[data.optionSetting.label];
          return message.error(`选项数据中【${label}】的值应该为数字！`);
        }
      }
    }
    const actionMap = {
      search(add: boolean) {
        if (add) {
          props.config.search.list.push(data);
        } else {
          props.config.search.list[editor.index] = data;
        }
      },
      table(add: boolean) {
        if (add) {
          const fields = JSON.parse(JSON.stringify(editor.form!.fields));
          fields.push(data);
          editor.form!.fields = fields;
          // TODO: 这里不直接调用数组方法或者修改的理由是想要出发配置表单组件里面的`watch`
          // 因为不想`deep`去遍历深层，在有选项数据的时候会有性能问题，所以这里用最原始的方式处理
          // 在 vue3.5+ deep可以设置层数，那样就可以不用这么麻烦
          // editor.form!.fields.push(data);
        } else {
          const fields = JSON.parse(JSON.stringify(editor.form!.fields));
          fields[editor.index] = data;
          editor.form!.fields = fields;
          // TODO: 与上面同理
          // editor.form!.fields[editor.index] = data;
        }
      }
    }
    actionMap[editor.type!](isAdd.value);
    onClose();
  });
}

let keyList: Array<string> = [];

/**
 * 更新表单项`key`列表
 * @param excludeKey 需要排除的值
 */
function updateKeyList(excludeKey?: string) {
  const editor = provideState.editor;
  keyList = [];
  const actionMap = {
    search() {
      keyList = props.config.search.list.map(item => item.key);
    },
    table() {
      keyList = editor.form!.fields.map(item => item.key);
    }
  }
  actionMap[editor.type!]();
  if (excludeKey) {
    keyList = keyList.filter(val => val !== excludeKey);
  }
}

watch(() => props.show, function(show) {
  if (!show) {
    state.formData = undefined;
    return;
  }
  const editor = provideState.editor;
  if (editor.action === "add") {
    state.step = 0;
    state.formData = undefined;
    updateKeyList();
  } else {
    const current = editor.index;
    const actionMap = {
      search() {
        state.formData = JSON.parse(JSON.stringify(props.config.search.list[current]));
      },
      table() {
        state.formData = JSON.parse(JSON.stringify(editor.form?.fields[current]));
      }
    }
    actionMap[editor.type!]();
    setJson(state.formData!);
    updateKeyList(state.formData!.key);
    state.step = 1;
  }
});
</script>
<style lang="scss"></style>