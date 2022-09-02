<template>
  <div class="base-desc" :style="{ 'grid-template-columns': `repeat(${column}, 1fr)` }">
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/** 描述表格全局组件 */
@Component({
  name: "base-desc",
  provide() {
    return {
      DescComponent: this
    }
  }
})
export default class BaseDesc extends Vue {

  /** 一行几个item */
  @Prop({
    type: [Number, String],
    default: 2
  })
  column!: number | string

  /** label 宽度 */
  @Prop({
    type: String,
    default: "110px"
  })
  labelWidth!: string

}
</script>
<style lang="scss">
$color: #eaeefb;
$border: solid 1px #eaeefb;

.base-desc {
  width: 100%;
  display: grid;
  position: relative;
  border: $border;
  border-bottom: none;
  border-left: none;
  &::after {
    position: absolute;
    content: "";
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $color;
  }
  .base-desc-item {
    border-bottom: $border;
    font-size: 14px;
    display: flex;
    .base-desc-label {
      background-color: #f3f6ff;
      border-left: $border;
      border-right: $border;
    }
    .base-desc-value {
      flex: 1;
    }
    .base-desc-label, .base-desc-value {
      display: flex;
      align-items: center;
      min-height: 50px;
      padding: 10px;
      font-size: 14px;
      color: #333;
    }
  }
  .red-text {
    color: #E51414;
  }
}
// 全局样式
.base-desc-text,
.base-desc .base-desc-item .base-desc-value {
  font-size: 14px;
  color: #333;
}

.base-desc-tip,
.base-desc .base-desc-item .base-desc-label {
  font-size: 14px;
  color: #888;
}
</style>