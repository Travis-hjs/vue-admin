import type { CurdType } from "@/components/Curd";

type NativeDate = Date;

/**
 * `<Fields :list="fields">`组件类型
 */
export namespace FieldType {
  interface Common<T extends object> {
    /** 表单项唯一值，一些特殊场景需要设置 */
    key?: string;
    /** 展示文案 */
    label: string | (() => string);
    /** `label`宽度 */
    labelWidth?: string | (() => string);
    /** 表单数据对象键值 */
    prop: keyof T | NestedKeyOf<T>;
    /** 组件的`placeholder` */
    placeholder?: string | (() => string);
    /** 额外的提示文案 */
    tips?: string | (() => string);
    /** 类名 */
    class?: string | (() => string);
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
    tooltip?: string | (() => string);
    /** 是否不设置清除功能 */
    noClear?: boolean;
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
    /**
     * 默认行数
     * - 仅`"textarea"`生效
     */
    rows?: number;
  }

  export interface NumberInput<T extends object> extends Common<T> {
    /** 数字输入框 */
    type: "number";
    min?: number;
    max?: number;
  }

  export interface Select<T extends object> extends Common<T>, HasOption {
    /** 下拉选择组件 */
    type: "select";
    /** 是否多选 */
    multiple?: boolean;
    /**
     * 多选最大显示数量，默认为`1`
     * - `max-collapse-tags`属性的缩写
     * - [文档](https://element-plus.org/zh-CN/component/select.html#select-attributes)
     */
    max?: number;
  }

  export interface Date<T extends object>
    extends Common<T>,
      Pick<CurdType.Date, "dateType">,
      Partial<Pick<CurdType.Date, "formatShow" | "format">> {
    /**
     * 日期组件
     * - 当前组件没有对绑定值做任何操作，所以传入的值和返回的值都是组件原始类型
     * - 传入或格式化操作留给开发者自行处理
     */
    type: "date";
    /**
     * 由于日期组件值特殊的原因，这里用`bind`代替`prop`，所以`prop`填什么都不重要，重要的是该值绑定的字段
     * - 当为日期范围时，按照数组顺序进行值的绑定，例如：`bind: ["startDate", "endDate"]`
     */
    bind: Array<keyof T | NestedKeyOf<T>>;
    /**
     * 日期禁用函数
     * @param value
     */
    disabledDate?: (value: NativeDate) => boolean;
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

  export interface Radio<T extends object> extends Common<T>, HasOption {
    /** 单选组件 */
    type: "radio";
  }

  export interface Slot<T extends object> extends Common<T> {
    /** 插槽类型 */
    type: "slot";
    /** 插槽名 */
    slotName: string;
  }

  export interface InputTag<T extends object> extends Common<T> {
    /** 标签输入框 */
    type: "input-tag";
    /** 触发类型 */
    trigger?: "Enter" | "Space";
    /** 输入指定分隔符自动分隔 */
    delimiter?: string;
    /** 最大标签数量 */
    max?: number;
  }

  /**
   * `<Fields :list="fields">`组件列表单个类型集合
   */
  export type Member<T extends object = Record<string, any>> =
    | Input<T>
    | NumberInput<T>
    | Select<T>
    | Date<T>
    | Switch<T>
    | Text<T>
    | Radio<T>
    | Slot<T>
    | InputTag<T>;
}
