import type { CurdType } from "@/components/Curd";

/**
 * `<TheFields :list="fields">`组件类型
 */
export namespace TheField {
  interface Common<T extends object> {
    /** 展示文案 */
    label: string;
    /** 表单数据对象键值 */
    prop: keyof T;
    /** 组件的`placeholder` */
    placeholder?: string;
    /** 额外的提示文案 */
    tips?: string;
    /** 类名 */
    class?: string;
    /** 是否禁用状态 */
    disabled?: boolean | (() => boolean);
    /**
     * 是否渲染，和`v-if`一样的作用
     * - 默认不设置则渲染
     */
    show?: boolean | (() => boolean);
    /**
     * 是否必需项，样式展示
     * - 当组件传入`:type="search"`时生效，对应`<FilterItem />`的属性
     */
    required?: boolean;
    /**
     * 表单项的`label`提示内容
     * - 当组件传入`:type="form"`时生效
     */
    tooltip?: string;
    /**
     * 字面意思，不解释
     * @param val
     */
    onChange?(val: any): void;
  }

  export interface HasOption {
    /** 下拉选项数据 */
    options: Array<any>;
    /** 选项数据配置对象 */
    optionSetting?: Partial<Option>;
  }

  export interface Option {
    /** 不传则默认`"label"` */
    label: string;
    /** 不传则默认`"value"` */
    value: string;
    /** 不传则默认`"children"` */
    children: string;
  }

  export interface Input<T extends object> extends Common<T> {
    /** 普通文本输入框 */
    type: "input" | "textarea";
  }

  export interface NumberInput<T extends object> extends Common<T> {
    /** 数字输入框 */
    type: "number";
    min?: number;
    max?: number;
  }

  export interface Select<T extends object> extends Common<T>, HasOption {
    /** 单选下拉选择组件 */
    type: "select";
  }

  export interface SelectMultiple<T extends object> extends Common<T>, HasOption {
    /** 多选下拉选择组件 */
    type: "select-multiple";
    /** 是否展示全部选中项 */
    showAll?: boolean;
  }

  export interface Date<T extends object> extends Common<T>, Pick<CurdType.Date, "dateType" | "formatShow" | "format"> {
    /**
     * 日期组件
     * - 当前组件没有对绑定值做任何操作，所以传入的值和返回的值都是组件原始类型
     * - 传入或格式化操作留给开发者自行处理
     */
    type: "date";
    /**
     * 当日期组件发生变化时`onChange`设置的绑定值
     * - 当前为单向绑定，即组件值发生变动时会修改`bind: ["updateTime"]`，`obj.updateTime = "xxx"`不会修改组件数据
     * - 当为日期范围时，按照数组顺序进行值的绑定，例如：`bind: ["startDate", "endDate"]`
     */
    bind: Array<keyof T>;
  }

  export interface Switch<T extends object> extends Omit<Common<T>, "placeholder"> {
    /** 开关组件 */
    type: "switch";
    /** switch 打开时的文字描述 */
    activeText?: string;
    /** switch 的状态为 off 时的文字描述 */
    inactiveText?: string;
    /** switch 状态为 on 时的值 */
    activeValue?: string | boolean | number;
    /** switch的状态为 off 时的值 */
    inactiveValue?: string | boolean | number;
  }

  // export interface UploadImage<T extends object> extends Omit<Common<T>, "placeholder"> {
  //   /** 上传图片 */
  //   type: "upload-image";
  //   /** 上传图片组件宽度 */
  //   width?: string;
  //   /** 上传图片组件高度 */
  //   height?: string;
  //   /** 是否自动高度-图片 */
  //   autoHeight?: boolean;
  //   /** 上传图片最大体积（M） */
  //   maxSize?: number;
  // }

  export interface Text<T extends object> extends Common<T> {
    /**
     * 普通文本
     * - 普通文本设置`placeholder`则会在空值时使用该属性进行显示
     */
    type: "text";
  }

  /**
   * `<TheFields :list="fields">`组件列表单个类型集合
   */
  export type Type<T extends object = Record<string, any>> =
    | Input<T>
    | NumberInput<T>
    | Select<T>
    | SelectMultiple<T>
    | Date<T>
    | Switch<T>
    | Text<T>;
    // | UploadImage<T>;
}
