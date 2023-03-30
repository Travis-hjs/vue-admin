import { defineComponent } from "vue";
import "./index.scss";

const width = "--label-width";

export const FilterWrap = defineComponent({
  name: "FilterWrap",
  props: {
    labelWidth: {
      type: String,
      default: "96px"
    }
  },
  setup(props, { slots }) {
    return () => (
      <section class="filter-wrap flex" style={{ [width]: props.labelWidth }}>
        { slots.left ? <div>{ slots.left() }</div> : undefined }
        <div class="fwrap f1">
          { slots.default && slots.default() }
        </div>
        { slots.right ? <div>{ slots.right() }</div> : undefined }
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
      <div class="filter-item flex">
        {
          slots.label || props.label ? (
            <span class="filter-label fvertical" style={{ [width]: props.labelWidth }}>{ slots.label ? slots.label() : props.label }</span>
          ) : undefined
        }
        { slots.default && slots.default() }
      </div>
    )
  },
});
