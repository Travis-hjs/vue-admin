import { inject, onUnmounted } from "vue";
import type { CurdType } from "./types";
import { formatDate, isType } from "@/utils";
// ----------------------- 数据相关 -----------------------

export const provideKey = "the-curd-state";

/** 父组件注入的对象 */
export const useProvideState = () => inject(provideKey) as CurdType.State;

/** 操作栏的标记 */
export const actionProp = "action-right";
/** 表格操作列中，编辑按钮的`key` */
export const actionEditKey = "action-edit";

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

/** 递增`ID` */
let incrementId = 0;

/** 获取递增`id`每调用一次都会自动递增 */
function getIncrementId() {
  incrementId++;
  return incrementId;
}

/**
 * 设置表单项的默认值
 * - 将对应的默认值设置到绑定的`value`中去
 * @param field
 */
export function setFieldValue(field: CurdType.Field) {
  if (field.type == "date") {
    if (isType(field.shortcutIndex, "number")) {
      const date = shortcutMap[field.dateType][field.shortcutIndex].value();
      field.value = date as any;
    } else {
      field.value = field.valueType === "array" ? [] : "";
    }
  } else {
    field.value = field.defaultValue;
  }
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
 * @param search 是否为搜索数据使用
 */
export function getFieldData<T extends keyof FieldMap>(type: T, key = "", search?: boolean): FieldMap[T] {
  const fieldId = getIncrementId();
  const time = Date.now();
  const tipsInput = "请输入";
  const tipsChange = "请选择";
  const id = `field-${type}-${fieldId}-${time}`;
  const map: FieldMap = {
    input: {
      key,
      id,
      type: "input",
      value: "",
      defaultValue: "",
      placeholder: tipsInput,
      valueType: "string"
    },
    textarea: {
      id,
      value: "",
      defaultValue: "",
      type: "textarea",
      placeholder: tipsInput,
      key,
      valueType: "string"
    },
    "input-between": {
      key,
      id,
      value: ["", ""],
      defaultValue: ["", ""],
      type: "input-between",
      placeholder: ["请输入范围一", "请输入范围二"],
      separator: "-",
      valueType: "array"
    },
    select: {
      key,
      id,
      value: "",
      defaultValue: "",
      type: "select",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: "string"
    },
    "select-multiple": {
      key,
      id,
      value: [],
      defaultValue: [],
      type: "select-multiple",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: "array"
    },
    checkbox: {
      key,
      id,
      value: [],
      defaultValue: [],
      type: "checkbox",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: "array"
    },
    radio: {
      key,
      id,
      value: "",
      defaultValue: "",
      type: "radio",
      placeholder: tipsChange,
      options: [],
      optionSetting: {
        label: "",
        value: ""
      },
      valueType: "string"
    },
    switch: {
      key,
      id,
      value: false,
      defaultValue: false,
      type: "switch",
      placeholder: "",
      valueType: "boolean"
    },
    date: {
      key,
      id,
      value: "",
      type: "date",
      placeholder: tipsChange,
      dateType: "date",
      formatShow: "YYYY-MM-DD",
      format: "Y-M-D",
      valueType: "string",
      shortcutIndex: ""
    },
    cascader: {
      key,
      id,
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
      valueType: "array"
    }
  };
  const data = map[type];
  data.label = "";
  if (search) {
    // 可以为搜索相关设置对应的属性
  } else {
    data.required = false;
  }
  return data;
}

/**
 * 表格列默认数据
 * @param prop 
 * @param label 
 */
export function getColumnData(prop: string, label: string): CurdType.Table.Column {
  return {
    label,
    prop,
    width: undefined,
    minWidth: undefined,
    tooltip: false,
    cellType: "text",
    sort: false,
    fixed: false,
    iconTips: "",
    imageWidth: 0,
    imageHeight: 0,
    jsCode: "",
    visible: true
  };
}

/** 默认表单配置数据 */
export function getFormConfig(): CurdType.Table.From {
  return {
    width: 500,
    labelWidth: 120,
    labelPosition: "left",
    fields: []
  };
}

/** 默认表单操作按钮数据 */
export function getActionData(): CurdType.Table.Action {
  return {
    key: `action-${getIncrementId()}-${Date.now()}`,
    text: "",
    icon: "",
    jsCode: "",
    type: "primary"
  };
}

/**
 * 获取最终处理过的表单项值
 * @param field 表单项
 */
export function getFieldValue<T extends CurdType.Field>(field: T): T["value"] {
  if (field.type === "date") {
    if (["datetimerange", "daterange"].includes(field.dateType)) {
      const list = field.value as Array<Date>;
      if (list.length > 1) {
        return list.map(date => formatDate(date, field.format));
      }
    }
    if (field.value) {
      return formatDate(field.value as string, field.format);
    }
  }
  if (field.type === "input-between") {
    // do some...
    // field.value
  }
  return field.value;
}

/**
 * 转换`px`单位，只允许有正整数
 * @param value 
 */
export function convertPx(value?: number) {
  if (!value) return undefined;
  value = parseInt(value.toString());
  value = Math.abs(value);
  return `${value}px`;
}

type DateType = CurdType.Date["dateType"];

interface Shortcut {
  text: string;
  value(): Date | Array<Date>;
}

interface DateTypeOption extends Pick<CurdType.Date, "format" | "formatShow"> {
  label: string;
  /** 日期组件类型 */
  value: DateType;
}

export const dateTypeOptions: Array<DateTypeOption> = [
  {
    label: "选择年份",
    value: "year",
    formatShow: "YYYY",
    format: "Y"
  },
  {
    label: "选择年份-月份",
    value: "month",
    formatShow: "YYYY-MM",
    format: "Y-M"
  },
  {
    label: "选择年份-周",
    value: "week",
    formatShow: "YYYY年 第ww周",
    format: "Y-M-D"
  },
  {
    label: "选择年份-月份-日",
    value: "date",
    formatShow: "YYYY-MM-DD",
    format: "Y-M-D"
  },
  {
    label: "选择年份-月份-日 时:分:秒",
    value: "datetime",
    formatShow: "YYYY-MM-DD HH:mm:ss",
    format: "Y-M-D h:m:s"
  },
  {
    label: "选择日期范围",
    value: "daterange",
    formatShow: "YYYY-MM-DD",
    format: "Y-M-D"
  },
  {
    label: "选择日期-时间范围",
    value: "datetimerange",
    formatShow: "YYYY-MM-DD HH:mm:ss",
    format: "Y-M-D h:m:s"
  }
];

const oneDay = 3600 * 1000 * 24;

function getLastMonth(last = 0) {
  const date = new Date();
  date.setMonth(new Date().getMonth() - last);
  return date;
}

function getLastWeek(last = 0) {
  const date = new Date();
  const value = oneDay * 7 * last;
  date.setTime(date.getTime() - value);
  return date;
}

const commonShortcuts: Array<Shortcut> = [
  {
    text: "今天",
    value: () => new Date()
  },
  {
    text: "昨天",
    value() {
      const date = new Date();
      date.setTime(date.getTime() - oneDay);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => getLastWeek(1)
  },
  {
    text: "一个月前",
    value: () => getLastMonth(1)
  },
  {
    text: "三个月前",
    value: () => getLastMonth(3)
  },
  {
    text: "半年前",
    value: () => getLastMonth(6)
  },
  {
    text: "一年前",
    value: () => getLastMonth(12)
  }
];

const commonRangeShortcuts = commonShortcuts.map((item, index) => {
  const isFirst = index === 0;
  const current = new Date().toLocaleDateString();
  const today = [
    new Date(`${current} 00:00:00`),
    new Date(`${current} 23:59:59`)
  ];
  return {
    text: isFirst ? "今天内" : `${item.text}至今`,
    value: () => (isFirst ? today : [item.value(), new Date()])
  } as Shortcut;
});

export const shortcutMap: Record<DateType, Array<Shortcut>> = {
  year: [
    {
      text: "今年",
      value: () => new Date()
    },
    {
      text: "去年",
      value: () =>
        new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    },
    {
      text: "前年",
      value: () =>
        new Date(new Date().setFullYear(new Date().getFullYear() - 2))
    }
  ],
  month: [
    {
      text: "当月",
      value: () => new Date()
    },
    {
      text: "上月",
      value: () => getLastMonth(1)
    },
    {
      text: "前3个月",
      value: () => getLastMonth(3)
    },
    {
      text: "前6个月",
      value: () => getLastMonth(6)
    },
    {
      text: "前12个月",
      value: () => getLastMonth(12)
    }
  ],
  week: [
    {
      text: "本周",
      value: () => new Date()
    },
    {
      text: "上周",
      value: () => getLastWeek(1)
    },
    {
      text: "上2周",
      value: () => getLastWeek(2)
    },
    {
      text: "上3周",
      value: () => getLastWeek(3)
    },
    {
      text: "上4周",
      value: () => getLastWeek(4)
    }
  ],
  date: commonShortcuts,
  datetime: commonShortcuts,
  daterange: commonRangeShortcuts,
  datetimerange: commonRangeShortcuts
}

/**
 * 将属性挂载到全局，以下划线为标识符开头
 * - 配合`jsCode`中动态代码调用
 * @param target 
 */
export function exportPropToWindow<T extends object>(target: T) {
  const global: any = window;
  for (const key in target) {
    const props = `_${key}`;
    global[props] = target[key];
  }

  // 组件卸载的时候将全局属性清空，避免占用内存或者爆栈
  onUnmounted(function() {
    for (const key in target) {
      const props = `_${key}`;
      global[props] = null;
    }
  });
}
