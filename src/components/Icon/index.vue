<script lang="ts">
/**
 * `svg`图标组件
 * - [图标库1](https://icon-sets.iconify.design/tdesign)
 * - [图标库2](https://icones.netlify.app/collection/tdesign)
 */
export default {
  name: "Icon",
}
</script>
<script lang="ts" setup>
import { computed, type CSSProperties, type PropType } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  /**
   * 图标名
   * - [图标库1](https://icon-sets.iconify.design/tdesign)
   * - [图标库2](https://icones.netlify.app/collection/tdesign)
   */
  name: {
    type: String,
    required: true,
  },
  /** `css`单位或像素值 */
  size: {
    type: [String, Number] as PropType<number | string>,
    default: undefined,
  },
  color: {
    type: String,
    default: undefined,
  },
});

const getWrapStyle = computed<CSSProperties>(() => {
  const s = props.size;
  return {
    fontSize: typeof s === "number" ? `${s}px` : s,
    color: props.color,
  };
});
</script>
<template>
  <Icon :icon="props.name" :style="getWrapStyle" class="the-icon" />
</template>
<style lang="scss">
.the-icon {
  display: inline-flex;
  font-size: 16px;

  .invalid-icon {
    display: block;
    min-width: 1em;
    min-height: 1em;
    background-color: #eee;
    border-radius: 50%;
  }
}
</style>
