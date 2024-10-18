import { isType } from "@/utils";
import { shortcutMap } from "./date";
import { inject } from "vue";
import type { CascaderOption } from "element-plus";

export { default as Curd } from "./Main.vue";

type NativeDate = Date;

export namespace CurdType {
  interface Base {
    id: number | string;
  }

  interface BaseField<T> extends Base {
    label?: string;
    /** 单独的`label`宽度 */
    labelWidth?: string;
    /** 内容部分宽度 */
    valueWidth?: string;
    /** 接收值的字段 */
    key: string;
    /**
     * 输入提示文案
     * - 表单验证也是这个提示文案
     */
    placeholder: string;
    /** 选项数据 */
    options: Array<Record<string, string | number>>;
    /** 选项数据字段配置对象 */
    optionSetting: {
      /**
       * 展示字段
       * - 默认`"label"`
       */
      label: string;
      /**
       * 绑定值字段
       * - 默认`"value"`
       */
      value: string;
      /**
       * 下级数组字段
       * - 默认`"children"`
       */
      children?: string;
    };
    /**
     * 选项数据接口请求路径
     * - 预留字段，可以动态配置请求接口，暂未用到该字段
     */
    optionApi?: string;
    /**
     * 组件绑定的值
     * - 当`type: "cascader"`多选的时候为二唯数据，在提交时可以拍平+去重处理，最后再发送请求
     */
    value: T;
    /**
     * 值的类型，提交给后端的时候可能会用到，前端也可以通过该值去做一些特殊处理
     * - 当为`defaultValue: -1`的时候要将`defaultValue = ""`，约定为`number`类型，但初始值为空
     */
    valueType: JavaScriptTypes | "";
    /**
     * 组件默认值
     * - 注意！！！该值只会在初始化的时候设置，具体看`Field.vue`
     * - 当`type: "cascader"`多选的时候为二唯数据，在提交时可以拍平+去重处理，最后再发送请求
     */
    defaultValue: T;
  }

  type HasOption = "options" | "optionSetting" | "optionApi";

  export interface Input extends Omit<BaseField<string>, HasOption> {
    type: "input" | "textarea";
  }

  export interface InputBetween extends Omit<BaseField<Array<string>>, HasOption | "placeholder"> {
    type: "input-between";
    placeholder: Array<string>;
    /**
     * 中间串联的符号文案
     * - 默认`"-"`
     */
    separator: string;
  }

  export interface Select extends BaseField<string | number> {
    type: "select";
  }

  export interface SelectMultiple extends BaseField<Array<string | number>> {
    type: "select-multiple";
  }

  export interface Checkbox extends BaseField<Array<string | number>> {
    type: "checkbox";
  }

  export interface Radio extends BaseField<string | number> {
    type: "radio";
  }

  export interface Switch extends Omit<BaseField<boolean>, HasOption> {
    type: "switch";
  }

  export interface Date extends Omit<BaseField<NativeDate | Array<NativeDate> | string>, HasOption | "defaultValue"> {
    type: "date";
    /**
     * 日期选择类型
     * - [参考](https://element-plus.org/zh-CN/component/datetime-picker.html#attributes)
     */
    dateType:
      | "year"
      | "month"
      | "week"
      | "date"
      | "datetime"
      | "datetimerange"
      | "daterange";
    /**
     * 组件展示格式化规则
     * - [参考](https://day.js.org/docs/zh-CN/display/format)
     */
    formatShow: string;
    /**
     * 值的格式化
     * - 参考`src/utils/index.ts`中的`formatDate`方法
     */
    format: string;
    /**
     * 默认值的预设选项索引
     * - 注意！！！该值只会在初始化的时候设置，具体看`Field.vue`
     */
    shortcutIndex: number | "";
  }

  export interface Cascader extends Omit<BaseField<Array<string | number> | Array<Array<string | number>>>, "options"> {
    type: "cascader";
    /** 多层选项数据 */
    options: Array<CascaderOption>;
    /** 是否多选 */
    multiple: boolean;
    /** 是否可以只选中某一项 */
    checkStrictly: boolean;
  }

  /**
   * 表单组件
   * | type 字段 | 说明 |
   * | --- | --- |
   * | input | 普通输入框 |
   * | input-between | 输入框-串联 |
   * | textarea | 文本域 |
   * | select | 下拉框-单选 |
   * | select-multiple | 下拉框-多选 |
   * | checkbox | 多选复选框 |
   * | radio | 单选选择框 |
   * | switch | 开关切换 |
   * | date | 日期选择器 |
   * | cascader | 级联选择器 |
   */
  export type Field = Input | InputBetween | Select | SelectMultiple | Checkbox | Radio | Switch | Date | Cascader;

  /** 搜索/筛选节点类型 */
  export interface Search {
    /** 统一的`label`宽度 */
    labelWidth?: string;
    /** 操作列表 */
    list: Array<Field>;
  }

  /** 整体配置数据项 */
  export interface Config {
    search: Search;
    // table: Table.Data;
    // form: {};
  }

  export interface Editor {
    /** 是否显示编辑器 */
    show: boolean;
    /** 编辑器类型 */
    type: "search" | "form" | "table" | "";
    /** 编辑操作类型 */
    action: "add" | "edit";
    /** 编辑的索引 */
    index: number;
  }

  export interface State {
    loading: boolean;
    /** 编辑器信息 */
    editor: Editor;
    /** 是否显示右下角操作容器 */
    showOperate: boolean;
  }

}

/** 递增`ID` */
let incrementId = 0;

/** 获取递增`id`每调用一次都会自动递增 */
export function getIncrementId() {
  incrementId++;
  return incrementId;
}

interface FieldMap {
  input: CurdType.Input;
  textarea: CurdType.Input;
  "input-between": CurdType.InputBetween;
  select: CurdType.Select;
  "select-multiple": CurdType.SelectMultiple;
  checkbox: CurdType.Checkbox;
  radio: CurdType.Radio;
  switch: CurdType.Switch;
  date: CurdType.Date;
  cascader: CurdType.Cascader;
}

/**
 * 表单组件数据
 * @param type 表单类型
 * @param key 键值
 */
export function useFieldData<T extends keyof FieldMap>(type: T, key = ""): FieldMap[T] {
  const fieldId = getIncrementId();
  const time = Date.now();
  const tipsInput = "请输入";
  const tipsChange = "请选择";
  const map: FieldMap = {
    input: {
      key,
      id: `field-input-${fieldId}-${time}`,
      type: "input",
      value: "",
      defaultValue: "",
      placeholder: tipsInput,
      valueType: ""
    },
    textarea: {
      id: `field-textarea-${fieldId}-${time}`,
      value: "",
      defaultValue: "",
      type: "textarea",
      placeholder: tipsInput,
      key,
      valueType: ""
    },
    "input-between": {
      key,
      id: `field-input-between-${fieldId}-${time}`,
      value: ["", ""],
      defaultValue: ["", ""],
      type: "input-between",
      placeholder: ["请输入范围一", "请输入范围二"],
      separator: "-",
      valueType: ""
    },
    select: {
      key,
      id: `field-select-${fieldId}-${time}`,
      value: "",
      defaultValue: "",
      type: "select",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: ""
    },
    "select-multiple": {
      key,
      id: `field-select-multiple-${fieldId}-${time}`,
      value: [],
      defaultValue: [],
      type: "select-multiple",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: ""
    },
    checkbox: {
      key,
      id: `field-checkbox-${fieldId}-${time}`,
      value: [],
      defaultValue: [],
      type: "checkbox",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: ""
    },
    radio: {
      key,
      id: `field-radio-${fieldId}-${time}`,
      value: "",
      defaultValue: "",
      type: "radio",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: ""
    },
    switch: {
      key,
      id: `field-switch-${fieldId}-${time}`,
      value: false,
      defaultValue: false,
      type: "switch",
      placeholder: "",
      valueType: ""
    },
    date: {
      key,
      id: `field-date-${fieldId}-${time}`,
      value: "",
      type: "date",
      placeholder: tipsChange,
      dateType: "date",
      formatShow: "YYYY-MM-DD",
      format: "Y-M-D",
      valueType: "",
      shortcutIndex: ""
    },
    cascader: {
      key,
      id: `field-cascader-${fieldId}-${time}`,
      value: [],
      defaultValue: [],
      type: "cascader",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: "",
        children: ""
      },
      multiple: false,
      checkStrictly: false,
      valueType: ""
    }
  };
  const data = map[type];
  data.label = "";
  return data;
}

/** 表单组件标题对象 */
export const fieldTitleMap = {
  input: "输入框",
  textarea: "文本域",
  "input-between": "输入框-串联",
  select: "下拉框-单选",
  "select-multiple": "下拉框-多选",
  checkbox: "多选复选框",
  radio: "单选选择框",
  switch: "开关切换",
  date: "日期选择器",
  cascader: "级联选择器"
};

export const provideKey = "the-curd-state";

/** 父组件注入的对象 */
export const useProvideState = () => inject(provideKey) as CurdType.State;

/**
 * 设置表单项的默认值
 * @param field 
 */
export function setFieldDefaultValue(field: CurdType.Field) {
  if (field.type == "date") {
    if (isType(field.shortcutIndex, "number")) {
      const date = shortcutMap[field.dateType][field.shortcutIndex].value();
      field.value = date as any;
    }
  } else {
    field.value = field.defaultValue;
  }
}
