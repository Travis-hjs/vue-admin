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
        <div class="the-filter-content f1">
          { slots.default && slots.default() }
        </div>
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
    labelWidth: String
  },
  setup(props, { slots }) {
    return () => (
      <div class="the-filter-item flex">
        {
          slots.label || props.label ? (
            <span class="the-filter-label f-vertical" style={{ [width]: props.labelWidth }}>{ slots.label ? slots.label() : props.label }</span>
          ) : null
        }
        { slots.default && slots.default() }
      </div>
    )
  },
});
