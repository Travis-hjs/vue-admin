import { nextTick, onUnmounted } from "vue";
import type { CurdConfig, CurdType } from "./types";
import { checkType, deepClone, formatDate, isType } from "@/utils";
import { getCountId } from "@/hooks/common";
import { columnActionProp } from "@/components/Table";
// ----------------------- 数据相关 -----------------------

/** 表格操作列中，编辑按钮的`key` */
export const actionEditKey = "action-edit";

/** 表单组件标题对象 */
export const fieldTitleMap = {
  input: "输入框",
  textarea: "文本域",
  "input-between": "输入框-串联",
  select: "下拉选择框",
  checkbox: "多选复选框",
  radio: "单选选择框",
  switch: "开关切换",
  date: "日期选择器",
  cascader: "级联选择器"
};

/**
 * 初始化设置表单绑定值
 * - 将对应的默认值设置到绑定的`value`中去
 * @param field
 */
export function initFieldValue(field: CurdType.Field) {
  if (field.type == "date") {
    const shortcut = field.shortcutIndex;
    // 先移除当前有选中的快捷选中日期样式
    const className = "the-date-shortcut-selected";
    const selected = document.querySelector(`.${className}`);
    selected && selected.classList.remove(className);
    // 处理日期快捷默认日期
    if (isType(shortcut, "number")) {
      if (shortcut === -1) {
        field.value = field.shortcutDate!;
      } else {
        const date = shortcutMap[field.dateType][shortcut].value();
        field.value = date;
        // 如果有选中快捷日期的情况下重设选中
        const selectedName = `.${field.id} .el-picker-panel__sidebar`;
        const panel = document.querySelector(selectedName);
        // 因为重设数据时，会重新渲染，这个时候设置 dom 是会被覆盖的，所以这里放在 nextTick 之后再操作 dom。
        // 如果 dom 依然是没有更新，尝试使用 setTimeout
        panel && nextTick(() => panel.children[shortcut].classList.add(className));
      }
    } else {
      // 没有快捷日期则重置
      field.value = dataArrayTypes.includes(field.dateType) ? [] : "";
    }
  } else {
    if (["object", "array"].includes(checkType(field.defaultValue))) {
      field.value = deepClone(field.defaultValue);
    } else {
      field.value = field.defaultValue;
    }
  }
}

interface FieldMap {
  input: CurdType.Input;
  textarea: CurdType.Input;
  "input-between": CurdType.InputBetween;
  select: CurdType.Select;
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
 * @param isSearch 是否为搜索数据使用，可以为表单和搜索数据做字段区分（预留参数，目前暂无区分）
 */
export function getFieldData<T extends keyof FieldMap>(type: T, key = "", isSearch?: boolean): FieldMap[T] {
  const tipsInput = "请输入";
  const tipsChange = "请选择";
  const id = getCountId(`field-${type}`);
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
      valueType: "string",
      joinShow: false
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
  // if (isSearch) {}
  data.required = false;
  return data;
}

/**
 * 表格列默认数据
 * @param prop 
 * @param title 
 */
export function getColumnData(prop: string, title: string): CurdType.Table.Column {
  return {
    title,
    prop,
    width: undefined,
    minWidth: undefined,
    tooltip: prop === columnActionProp ? false : true,
    cellType: "text",
    sort: false,
    fixed: false,
    iconTips: "",
    imageWidth: undefined,
    imageHeight: undefined,
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
    key: getCountId("action"),
    text: "",
    icon: "",
    click: "",
    type: "primary"
  };
}

interface FieldValueRes<T = any> {
  /** 组件处理之后最终获取的值 */
  value: T;
  /** 校验结果，`true`为通过，字符串则是对应的提示文字 */
  result: boolean | string;
}
/**
 * 获取最终处理过的表单项值
 * @param field 表单项
 */
export function getFieldValue<T extends CurdType.Field>(field: T): FieldValueRes<T["value"]> {
  const res: FieldValueRes = {
    value: field.value,
    result: true
  }
  if (field.type === "date") {
    if (!res.value) {
      res.result = field.placeholder;
      return res;
    }
    if (["datetimerange", "daterange"].includes(field.dateType)) {
      const dates = field.value as Array<Date>;
      if (dates.length < 2) {
        res.result = field.placeholder;
        return res;
      }
      res.value = dates.map(date => formatDate(date, field.format));
      return res;
    }
    res.value = formatDate(field.value as string, field.format);
    return res;
  }
  const empty: Array<any> = [null, undefined, ""];
  if (field.type === "input-between") {
    const inputList = field.value;
    if (empty.includes(inputList[0])) {
      res.result = field.placeholder[0];
      return res;
    }
    if (empty.includes(inputList[1])) {
      res.result = field.placeholder[1];
      return res;
    }
    res.value = JSON.parse(JSON.stringify(inputList));
  }
  const single: Array<CurdType.Field["type"]> = ["input", "textarea", "radio", "select"];
  if (single.includes(field.type) && empty.includes(field.value)) {
    res.result = field.placeholder as string;
    return res;
  }
  if (field.type === "checkbox" || (field.type === "select" && field.multiple)) {
    const list = field.value as Array<any>;
    if (!list.length) {
      res.result = field.placeholder as string;
      return res;
    }
    res.value = JSON.parse(JSON.stringify(list));
  }
  // if (field.type === "cascader") {
  //   // TODO: 级联的值处理待开发者自己根据具体情况处理
  // }
  return res;
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

/** 数组日期组件 */
export const dataArrayTypes = ["daterange", "datetimerange", "monthrange"];

/** 日期配置选项 */
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
    label: "选择月份范围",
    value: "monthrange",
    formatShow: "YYYY-MM",
    format: "Y-M"
  },
  {
    label: "选择日期+时间范围",
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
  datetimerange: commonRangeShortcuts,
  monthrange: [
    {
      text: "本月",
      value: () => [new Date(), new Date()]
    },
    {
      text: "本年",
      value() {
        const end = new Date();
        const start = new Date(new Date().getFullYear(), 0);
        return [start, end];
      }
    },
    {
      text: "过去3个月",
      value: () => [new Date(), getLastMonth(3)]
    },
    {
      text: "过去6个月",
      value: () => [new Date(), getLastMonth(6)]
    }
  ]
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

/**
 * 获取加重标签`<b>${content}</b>`
 * @param content 标签内容
 */
export function getBoldLabel(content: string) {
  return `<b style="color: var(--yellow)"> ${content} </b>`;
}

/** `curd`默认配置 */
export function getCurdConfigDefault(): CurdType.Config {
  return {
    search: {
      labelRight: false,
      labelWidth: undefined,
      list: [],
    },
    table: {
      columns: [],
      actions: [],
      selectKey: undefined,
      formAdd: undefined,
      formEdit: undefined
    }
  }
}

/** 配置编辑器默认状态 */
export function getCurdConfigEditor(): CurdConfig.Editor {
  return {
    show: false,
    showForm: false,
    form: undefined,
    action: "add",
    index: -1
  }
}
