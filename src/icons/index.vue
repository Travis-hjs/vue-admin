<script lang="ts">
/**
 * `svg`图标组件
 * - 引用`src/icons/svg/*svg`目录下所有图标
 */
export default {
  name: "SvgIcon",
  props: {
    name: {
      type: String,
      required: true,
      default: "",
    }
  }
}
</script>
<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>
<style lang="scss">
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  overflow: hidden;
  vertical-align: middle;
  fill: currentColor;
}
</style>
