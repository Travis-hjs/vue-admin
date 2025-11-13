import { defineComponent } from "vue";
import "./index.scss";

const width = "--label-width";

export const FilterWrap = defineComponent({
  name: "FilterWrap",
  props: {
    labelWidth: {
      type: String,
      default: "96px"
    },
    /** `label`靠右对齐 */
    labelRight: Boolean
  },
  setup(props, { slots }) {
    return () => (
      <section class={`the-filter-wrap flex${props.labelRight ? " label-right" : ""}`} style={{ [width]: props.labelWidth }}>
        { slots.left ? <div class="the-filter-side">{ slots.left() }</div> : null }
        {
          slots.content ? slots.content() : (
            <div class="the-filter-content f1">
              { slots.default && slots.default() }
            </div>
          )
        }
        { slots.right ? <div class="the-filter-side">{ slots.right() }</div> : null }
      </section>
    )
  },
});

export const FilterItem = defineComponent({
  name: "FilterItem",
  props: {
    /**
     * `label`字段，不传则不显示元素
     * - `<template #label>`会覆盖当前设置值
     */
    label: String,
    /** 优先级比`FilterWrap`高 */
    labelWidth: String,
    /** 是否必填（样式区分） */
    required: Boolean,
    /** 提示文案 */
    tooltip: String
  },
  setup(props, { slots }) {
    return () => (
      <div class={`the-filter-item flex${props.required ? " is-required" : ""}`}>
        {slots.prefix ? slots.prefix() : null}
        {slots.label || props.label ? (
          <span
            class={`the-filter-label f-vertical ${props.tooltip ? "the-tooltip" : ""}`}
            style={{ [width]: props.labelWidth }}
            data-tooltip={props.tooltip}
          >
            {slots.label ? slots.label() : props.label}
          </span>
        ) : undefined}
        {slots.default && slots.default()}
      </div>
    )
  },
});

interface FilterBtnProps {
  loading?: boolean;
  disabled?: boolean;
  /**
   * 搜索操作
   * @param reset 是否重置
   */
  onSearch?: (reset: boolean) => void;
}

/**
 * 搜索 + 重置按钮
 * @param props 
 */
export function SearchBtn(props: FilterBtnProps) {
  const emit = props.onSearch || (() => {});
  return (
    <>
      <el-button disabled={props.disabled || props.loading} onClick={() => emit(true)}>
        <i class={`el-icon-${props.loading ? "loading" : "refresh"} el-icon--left`} />
        重置
      </el-button>
      <el-button type="primary" disabled={props.disabled || props.loading} onClick={() => emit(false)}>
        <i class={`el-icon-${props.loading ? "loading" : "search"} el-icon--left`} />
        搜索
      </el-button>
    </>
  );
}
