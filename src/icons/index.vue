<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script lang="ts">
/**
 * `svg`图标组件
 * - 引用`src/icons/svg/*svg`目录下所有图标
 */
export default {
  name: "SvgIcon"
}
</script>
<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
    default: "",
  },
  className: {
    type: String,
    default: "",
  },
})

const iconName = computed(() => `#icon-${props.name}`);

const svgClass = computed(function () {
  if (props.className) {
    return "svg-icon " + props.className;
  } else {
    return "svg-icon";
  }
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