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
    labelWidth?: number;
    /** 内容部分宽度 */
    valueWidth?: number;
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
     * - 注意！！！该值只会在初始化的时候设置，具体看`Field`组件
     * - 当`type: "cascader"`多选的时候为二唯数据，在提交时可以拍平+去重处理，最后再发送请求
     */
    defaultValue: T;
    /**
     * 是否为必填项
     * - 当配置表单的时候的时候需要
     */
    required?: boolean;
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
    dateType: "year" | "month" | "week" | "date" | "datetime" | "datetimerange" | "daterange";
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
    labelWidth: number;
    /** label整体靠右排列 */
    labelRight: boolean;
    /** 操作列表 */
    list: Array<Field>;
  }

  export namespace Table {
    /** 表格列配置 */
    export interface Column<T = any> extends BaseTableColumn<T> {
      /**
       * 表格列渲染内容
       * | 字段 | 说明 |
       * | --- | --- |
       * | text | 默认文本 |
       * | image | 图片组件`<el-image>` |
       * | js | `js`代码 |
       */
      cellType: "text" | "image" | "js";
      /**
       * 图片宽度
       * - 当`cellType: "image"`时生效，css中设置默认`80px`
       * - 输入框输入
       */
      imageWidth: number;
      /**
       * 图片高度
       * - 当`cellType: "image"`时生效，css中设置默认`80px`
       */
      imageHeight: number;
      /**
       * 排序
       * - 当为字符串的时候是默认排序操作
       * - 升序`"asc"`，降序`"desc"`
       */
      sort: boolean | "asc" | "desc";
      /** 表头图标提示文字 */
      iconTips: string;
      /**
       * `js`代码
       * - 当`cellType: "js"`时生效
       * - 代码中需要返回值标识`return xxx;`
       * - 代码中有两个参数：第一个参数`cellValue`是表格值，第二个参数`row`是完整对象
       */
      jsCode: string;
      /**
       * 表格列是否可见
       * - 用户动态编辑表格列时需要该字段为标识符
       * - 默认`true`
       */
      visible: boolean;
    }

    export interface ColumnOption<K extends "cellType" | "sort"> {
      label: string;
      value: Column[K];
    }

    /** 表单配置 */
    export interface From {
      /** 表单整体宽度 */
      width: number;
      /** 标题宽度 */
      labelWidth: number;
      /** 标题排版 */
      labelPosition: "left" | "right";
      /** 表单项列表 */
      fields: Array<Field>;
    }

    /** 表格操作按钮类型 */
    export interface Action<T = any> extends BaseTableAction<T> {
      /** 标记用 */
      key: string;
      /**
       * 按钮点击时运行的`js`代码
       * - 函数有两个传参`function (row, index)`
       */
      jsCode?: string;
    }

    /** 表格相关配置 */
    export interface Config<T = any> {
      /** 表格操作包含项 */
      actions: Array<Action<T>>;
      /** 表格列 */
      columns: Array<Column<T>>;
      /**
       * 表单新增对象
       * - 考虑到新增和编辑有可能字段不一样，所以这里分开两个对象存储
       */
      formAdd: From | null;
      /**
       * 表单编辑对象
       * - 考虑到新增和编辑有可能字段不一样，所以这里分开两个对象存储
       */
      formEdit: From | null;
      /** 复选框选中目标键值值 */
      selectKey: string | null;
    }
  }

  /** 整体配置数据项 */
  export interface Config<T = any> {
    search: Search;
    table: Table.Config<T>;
  }

  export interface Editor {
    /** 是否显示编辑器 */
    show: boolean;
    /** 编辑器类型 */
    type: keyof Config | null;
    /** 编辑操作类型 */
    action: "add" | "edit";
    /** 编辑的索引 */
    index: number;
    /**
     * 正在编辑的表单
     * - 注意该值在赋值时不能克隆，不然`<Editor />`里面无法进行数据修改处理
     */
    form: Table.From | null;
  }

  /**
   * 内部状态数据，会注入到各个组件中
   * - 为什么不用`props`的方式传递进组件内使用？
   * 理由是当组件内要做一些递归组件和修改数据时可以非常方便地进行，如果是`props`方式则非常麻烦，要写很多代码
   */
  export interface State {
    loading: boolean;
    /** 编辑器信息 */
    editor: Editor;
    /** 是否显示编辑入口弹框 */
    showEntrance: boolean;
  }

  /** `curd`操作配置，不需要为响应式 */
  export interface Action {
    /**
     * 获取表格数据
     * - 获取数据的操作始终留给开发者自己手动决定运行时机，这样更加灵活
     * @param searchInfo 通过处理筛选组件配置返回的对象
     * @param pageInfo 分页数据
     */
    getTableData(searchInfo: BaseObj<any>, pageInfo: PageInfo): Promise<Api.Result<Api.List<any>>>;
    /**
     * 组件创建完成回调
     * - 可以在该函数声内部调用`getTableData()`从而一开始就获取数据
     * @param getData 内部获取数据的函数，会触发`getTableData`
     */
    created?(getData: () => Promise<void>): void;
    /**
     * 点击【完成编辑】按钮触发，保存当前`curd`配置
     * @param type 当前完成编辑的类型
     */
    saved?(type: keyof Config): void;
    /**
     * 删除功能
     * @param selectList 
     */
    onDelete?(selectList: Array<BaseObj>): Promise<Api.Result>;
    /**
     * 新增表单
     * @param form 
     */
    onAdd?<T = BaseObj>(form: T): Promise<Api.Result>;
    /**
     * 编辑表单
     * @param form 
     */
    onEdit?<T = BaseObj>(form: T): Promise<Api.Result>;
    /**
     * 导出功能
     * @param searchInfo 通过处理筛选组件配置返回的对象
     */
    onExport?(searchInfo: BaseObj<any>): void;
  }
  
}

export const provideKey = "the-curd-state";

/** 父组件注入的对象 */
export const useProvideState = () => inject(provideKey) as CurdType.State;

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

/** 递增`ID` */
let incrementId = 0;

/** 获取递增`id`每调用一次都会自动递增 */
function getIncrementId() {
  incrementId++;
  return incrementId;
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
      valueType: ""
    },
    textarea: {
      id,
      value: "",
      defaultValue: "",
      type: "textarea",
      placeholder: tipsInput,
      key,
      valueType: ""
    },
    "input-between": {
      key,
      id,
      value: ["", ""],
      defaultValue: ["", ""],
      type: "input-between",
      placeholder: ["请输入范围一", "请输入范围二"],
      separator: "-",
      valueType: ""
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
      valueType: ""
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
      valueType: ""
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
      valueType: ""
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
      valueType: ""
    },
    switch: {
      key,
      id,
      value: false,
      defaultValue: false,
      type: "switch",
      placeholder: "",
      valueType: ""
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
      valueType: "",
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
      valueType: ""
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

/** 表格列默认数据 */
export function getColumnData(): CurdType.Table.Column {
  return {
    label: "",
    prop: "",
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
 * 转换`px`单位，只允许有正整数
 * @param value 
 */
export function convertPx(value?: number) {
  if (!value) return undefined;
  value = parseInt(value.toString());
  value = Math.abs(value);
  return `${value}px`;
}

/**
 * 将属性挂载到全局，以下划线为标识符开头
 * - 配合`jsCode`中动态代码调用
 * @param target 
 */
export function exportPropToWindow<T extends object>(target: T) {
  for (const key in target) {
    const props = `_${key}`;
    (window as any)[props] = target[key];
  }
}

export function getTestData(): CurdType.Config {
  return {
    search: {
      labelRight: false,
      labelWidth: 90,
      list: [
        {
          ...getFieldData("input", "keyword"),
          label: "查询关键字"
        },
        {
          ...getFieldData("select", "gameId"),
          label: "游戏种类",
          defaultValue: 1,
          options: [
            { label: "英雄联盟", value: 1 },
            { label: "魔兽争霸", value: 2 },
            { label: "只狼", value: 3 },
            { label: "死亡细胞", value: 4 },
          ]
        },
        {
          ...getFieldData("select", "gameType"),
          label: "游戏类型",
          valueType: "number",
          options: [
            { label: "单机", value: 1 },
            { label: "网游", value: 2 },
          ]
        },
        {
          ...getFieldData("date", "date"),
          dateType: "daterange",
          valueWidth: 380,
          formatShow: "YYYY-MM-DD HH:mm:ss",
          label: "上架日期",
        },
      ]
    },
    table: {
      actions: [],
      columns: [
        {
          ...getColumnData(),
          label: "游戏名称",
          prop: "gameName"
        },
        {
          ...getColumnData(),
          label: "游戏类型",
          prop: "gameType",
          width: 140,
          cellType: "js",
          jsCode: 'const map = {1: "英雄联盟", 2: "魔兽争霸", 3: "只狼", 4: "死亡细胞"}; return `<span class="the-tag blue">${map[cellValue]}</span>`'
        },
        {
          ...getColumnData(),
          label: "游戏售价",
          prop: "price",
          slotHead: "header-price",
          cellType: "js",
          jsCode: "return `￥${cellValue}`",
          width: 140,
          sort: true
        },
        {
          ...getColumnData(),
          label: "上架时间",
          prop: "date",
          cellType: "js",
          jsCode: "return _formatDate(cellValue, 'Y年M月D日 h:m:s')",
          width: 200
        },
      ],
      formAdd: {
        labelPosition: "left",
        labelWidth: 120,
        width: 500,
        fields: [
          {
            ...getFieldData("input", "gameName"),
            label: "游戏名称"
          },
          {
            ...getFieldData("radio", "gameType"),
            label: "游戏类型",
            options: [
              { label: "单机", value: 1 },
            { label: "网游", value: 2 },
            ]
          },
          {
            ...getFieldData("date", "date"),
            dateType: "datetimerange",
            label: "上架日期",
          },
        ]
      },
      formEdit: null,
      selectKey: null
    }
  }
}
