<script lang="ts">
/** 表格新增 or 编辑表单 */
export default {
  name: "TableForm"
}
</script>
<script lang="ts" setup>
import { computed, reactive, ref, type PropType } from "vue";
import type { CurdType } from "./types";
import type { FormInstance } from "element-plus";
import { convertPx, getFieldValue, getFormConfig, initFieldValue } from "./data";
import Field from "./Field.vue";
import { deepClone, isType, modifyData } from "@/utils";

const props = defineProps({
  /** 表单配置 */
  config: {
    type: Object as PropType<CurdType.Table.From>,
    default: () => getFormConfig()
  },
  /** 表单类型 */
  type: {
    type: String as PropType<"add" | "edit">
  },
  /** 是否编辑模式 */
  editMode: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  }
});

const formRef = ref<FormInstance>();

const state = reactive({
  config: getFormConfig(),
  form: {} as BaseObj<any>,
  rules: {} as BaseObj<any>
});

/** 表格行数据，不需要为响应式 */
let tableRow = undefined as undefined | BaseObj<any>;

/**
 * 表单验证
 * @param callback 回调函数，第一个参数`formData`为完整对象，第二个参数`current`为当前展示中的字段
 */
function validate(callback?: (formData: BaseObj<any>, current: BaseObj<any>) => void) {
  formRef.value?.validate(val => {
    if (val && callback) {
      let data = formData.value;
      let current: BaseObj<any> = {};
      usableFields.value.forEach(field => {
        current[field.key] = data[field.key];
      });
      // data = formatDeepKeyObj(data);
      // current = formatDeepKeyObj(current);
      if (tableRow) {
        // 编辑逻辑
        const form = JSON.parse(JSON.stringify(tableRow));
        // 将表单项以外的数据合并到表单数据中
        modifyData(form, data);
        // TODO: 用完就清空
        // tableRow = undefined;
        callback(form, current);
      } else {
        // 新增逻辑
        callback(data, current);
      }
    }
  });
}

/** 表单移除验证 */
function clear() {
  setTimeout(() => {
    formRef.value?.clearValidate()
  });
}

/** 表单重置 */
function reset() {
  state.config.fields.forEach(initFieldValue);
}

/**
 * 设置表单数据
 * @param data 
 */
function setFormData(data: BaseObj<any>) {
  state.config.fields.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(data, field.key)) {
      const value = data[field.key];
      if (!value) return;
      switch (field.type) {
        case "date":
          if (isType(value, "array")) {
            field.value = value.map(val => new Date(val));
          } else {
            field.value = new Date(value);
          }
          break;

        // case "cascader":
        //   // TODO: 级联的值处理待开发者自己根据具体情况处理
        //   break;

        default:
          field.value = value;
          break;
      }
    }
    // TODO: 表单回显时，条件显示的表单项会读到默认值，所以这里设置默认值
    (field as any).defaultValue = deepClone(field.value);
  });
  clear();
}

/**
 * 更新表单配置
 * @param config 传入的配置
 */
function update(config: CurdType.Table.From) {
  state.config = deepClone(config || getFormConfig());
  const fields = state.config.fields || [];
  const form: typeof state.form = {};
  const rules: typeof state.rules = {};
  const blurs = ["input", "input-between", "textarea"];
  fields.forEach(field => {
    // TODO: 这里赋值什么都不重要，因为校验规则和组件绑定的数据不是这个对象，只是表单组件需要绑定而已
    form[field.key] = field.value;
    if (field.required) {
      // TODO: 验证数据的操作才是关键
      rules[field.key] = [
        {
          required: true,
          validator(_: any, val: any, callback: (err?: Error) => void) {
            const empty: Array<any> = [undefined, null, ""];
            // console.log("validator >>", val);
            if (field.type === "input-between" && !field.value[0] && !field.value[1]) {
              callback(new Error("请输入两个范围字段"));
              return;
            }
            if (field.valueType === "array" && !(field.value as Array<string>).length) {
              callback(new Error((field.placeholder as string) || "请选择"));
              return;
            }
            if (field.valueType !== "boolean" && empty.includes(field.value)) {
              const tips = blurs.includes(field.type) ? "请输入内容" : "请选择";
              callback(new Error((field.placeholder as string) || tips));
              return;
            }
            callback();
          },
          trigger: blurs.includes(field.type) ? "blur" : "change"
        }
      ];
    }
  });
  state.form = form;
  state.rules = rules;
  clear();
}

const formData = computed(() => {
  const data: BaseObj<any> = {};
  state.config.fields.forEach(field => {
    data[field.key] = getFieldValue(field).value;
  });
  return data;
});

/** 当前出现在界面的表单列表 */
const usableFields = computed(() => {
  return state.config.fields.filter(field => {
    const show = field.show;
    if (!show) return true;
    if (isType(show, "function")) {
      return show(formData.value);
    }
    if (show.includes("return")) {
      try {
        const fn = new Function("formData", show);
        return fn(formData.value);
      } catch (error) {
        console.warn("解析表单展示逻辑代码错误 >>", error);
      }
    }
    return true;
  });
});

/**
 * 解析禁用条件
 * @param val
 */
function getDisabled(val?: boolean | string) {
  if (typeof val !== "string") return val;
  if (!val.includes("return")) return;
  try {
    const fn = new Function("formData", val);
    return fn(formData.value);
  } catch (error) {
    console.warn("解析表单项禁用代码错误 >>", error);
  }
}

defineExpose({
  update,
  validate,
  reset,
  setFormData,
});
</script>
<template>
  <el-form
    ref="formRef"
    :model="state.form"
    :rules="state.rules"
    :label-width="convertPx(state.config.labelWidth)"
    :label-position="state.config.labelPosition"
    :disabled="props.disabled"
  >
    <template v-if="state.config && state.config.fields">
      <el-form-item
        v-for="field in usableFields"
        :key="field.id"
        :label="field.label"
        :prop="field.key"
      >
        <Field :fieldData="field" :disabled="getDisabled(field.disabled)" />
      </el-form-item>
    </template>
  </el-form>
</template>
