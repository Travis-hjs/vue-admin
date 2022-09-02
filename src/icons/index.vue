<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
// <svg>加载处理
// const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
// const req = require.context("./svg", false, /\.svg$/);
// requireAll(req);

export default defineComponent({
  name: "SvgIcon",
  props: {
    name: {
      type: String,
      required: true,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const iconName = computed(() => `#icon-${props.name}`);
    const svgClass = computed(function () {
      if (props.className) {
        return "svg-icon " + props.className;
      } else {
        return "svg-icon";
      }
    });
    return {
      iconName,
      svgClass,
    };
  },
});
</script>

<style lang="scss">
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  overflow: hidden;
  vertical-align: middle;
  fill: currentColor;
  stroke: currentColor;
}

.svg-fill {
  fill: currentColor;
  stroke: none;
}
</style>