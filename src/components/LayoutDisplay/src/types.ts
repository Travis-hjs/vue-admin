export namespace FilterType {
  export interface Wrap {
    /** `label`宽度 */
    labelWidth?: string;
    /** `label`靠右对齐 */
    labelRight?: boolean;
  }

  export interface WrapCtx {
    slots: {
      /** 筛选的内容左侧 */
      left?(): any;
      /** 筛选的内容右侧 */
      right?(): any;
      /** 中间内容部分 */
      content?(): any;
      /** 默认位置 */
      default?(): any;
    }
  }

  export interface Item {
    /**
     * `label`字段，不传则不显示元素
     * - `<template #label>`会覆盖当前设置值
     */
    label?: string;
    /** 优先级比`FilterWrap`高 */
    labelWidth?: string;
    /** 是否必填（样式区分） */
    required?: boolean;
    /** 提示文案 */
    tooltip?: string;
    /**
     * 提示文案宽度
     * - 超过则换行展示
     */
    tooltipWidth?: string | number;
  }

  export interface ItemCtx {
    slots: {
      /** `label`前缀 */
      prefix?(): any;
      /** `label`字段 */
      label?(): any;
      /** 默认内容 */
      default?(): any;
    }
  }

  export interface Btn {
    loading?: boolean;
    disabled?: boolean;
    /** 是否不需要重置按钮 */
    noReset?: boolean;
    /**
     * 搜索操作
     * @param reset 是否重置
     */
    onSearch?: (reset: boolean) => void;
  }
}

export namespace DescriptionType {
  export interface ItemProps {
    /** 标题名称 */
    label: string;
    /** 标题宽度 */
    labelWidth?: string;
    /**
     * 一行占位数量
     * - `full`: 占满整行
     */
    span?: number | "full";
  }

  export interface Item extends Pick<ItemProps, "span"> {
    /** 标题名称 */
    label: string | ((index: number) => string);
    /** 标题宽度 */
    labelWidth?: string | ((index: number) => string);
    /** 内容 */
    content?: string | ((index: number) => string);
    /** 是否将`content`渲染成`html` */
    html?: boolean;
    /** 插槽名称 */
    slot?: string;

    /**
     * 唯一标识
     * - 不传默认会以`index`代替
     */
    key?: string;
    /**
     * 是否显示
     * - 默认`true`
     */
    show?: boolean | ((index: number) => boolean);
  }
}
