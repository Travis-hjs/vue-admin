<template>
  <div class="base-desc-item" :style="{ 'grid-column': this.column ? `span ${this.column}` : '' }">
    <div class="base-desc-label" :style="{ 'width': useLabelWidth }">
      <slot name="label" v-if="$slots.label"></slot>
      <template v-else>{{ label }}</template>
    </div>
    <div class="base-desc-value">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import BaseDesc from "./index.vue";

@Component({
  name: "base-desc-item",
})
export default class BaseDescItem extends Vue {

  /** 一行几个item */
  @Prop({
    type: [Number, String],
    default: ""
  })
  column!: number | string

  /** label 宽度 */
  @Prop({
    type: String,
    default: ""
  })
  labelWidth!: string

  @Prop({
    type: String,
    default: ""
  })
  label!: string

  /** 父组件实例 */
  @Inject("DescComponent")
  private parentComponent!: BaseDesc;

  get useLabelWidth() {
    return this.labelWidth || this.parentComponent.labelWidth;
  }

}
</script>
