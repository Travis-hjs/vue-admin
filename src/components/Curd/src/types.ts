import type { CascaderOption } from "element-plus";

type NativeDate = Date;

export namespace CurdType {

  interface BaseField<T> {
    id: number | string;
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
     * - `"array<number>"`为特殊校验类型，主要是用来校验数据选项值、数组数字值用
     */
    valueType: JavaScriptTypes | "array<number>";
    /**
     * 组件默认值
     * - 注意！！！该值只会在初始化的时候设置，具体看`Field`组件
     * - 当`type: "cascader"`多选的时候为二唯数据，在提交时可以拍平+去重处理，最后再发送请求
     */
    defaultValue: T;
    /** 是否为必填项 */
    required?: boolean;
    /**
     * 动态表单项的条件显示逻辑函数，返回`true`则展示对应项
     * - 可以在`<Curd />`组件中配置运行代码，这个时候是`string`类型，并解析运行对应的代码片段
     * @param formData 表单数据
     */
    show?: ((formData: BaseObj<any>) => boolean) | string;
  }

  type HasOption = "options" | "optionSetting" | "optionApi";

  export interface Input extends Omit<BaseField<string>, HasOption> {
    type: "input" | "textarea";
  }

  export interface InputBetween extends Omit<BaseField<Array<string | number>>, HasOption | "placeholder"> {
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
     * - 当为`-1`时则不处理，在可视化配置中使用预览组件的值
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
    labelWidth?: number;
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
      imageWidth?: number;
      /**
       * 图片高度
       * - 当`cellType: "image"`时生效，css中设置默认`80px`
       */
      imageHeight?: number;
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
      /**
       * 标记用
       * - 当等于`"action-edit"`时，点击事件自动设置为内部的打开编辑表单功能，在`TableModel.vue`中，当配置完编辑表单数据后会自动添加，具体位置看`onFormEdit`方法
       */
      key: string;
    }

    /** 表格相关配置 */
    export interface Config<T = any> {
      /**
       * 最大限制几个按钮出现，超过则用【更多】下拉菜单代替展示
       * - 不传则默认`3`个
       */
      actionMax?: number;
      /** 表格操作包含项 */
      actions: Array<Action<T>>;
      /** 表格列 */
      columns: Array<Column<T>>;
      /**
       * 表单新增对象
       * - 考虑到新增和编辑有可能字段不一样，所以这里分开两个对象存储
       */
      formAdd?: From;
      /**
       * 表单编辑对象
       * - 考虑到新增和编辑有可能字段不一样，所以这里分开两个对象存储
       */
      formEdit?: From;
      /** 复选框选中目标键值值 */
      selectKey?: string;
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
    type?: keyof Config;
    /** 编辑操作类型 */
    action: "add" | "edit";
    /** 编辑的索引 */
    index: number;
    /**
     * 正在编辑的表单
     * - 注意该值在赋值时不能克隆，不然`<Editor />`里面无法进行数据修改处理
     */
    form?: Table.From;
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
     * - 可以在该函数声内部调用`getData()`从而一开始就获取数据
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
    onDelete?(selectList: Array<BaseObj<any>>): Promise<Api.Result>;
    /**
     * 新增表单
     * @param form 完整表单对象
     * @param current 当前展示中的字段对象
     */
    onAdd?(form: BaseObj<any>, current: BaseObj<any>): Promise<Api.Result>;
    /**
     * 编辑表单
     * @param form 完整表单对象
     * @param current 当前展示中的字段对象
     */
    onEdit?(form: BaseObj<any>, current: BaseObj<any>): Promise<Api.Result>;
    /**
     * 导出功能
     * - 待开发者自己根据项目情况实现
     */
    onExport?(): void;
  }
  
}

/** 页面编辑按钮类型 */
export type EditBtnType = "exit" | "copy" | "complete";
/** 表格操作类型 */
export type TableOptionType = "delete" | "add" | "export" | "setting" | "edit";
