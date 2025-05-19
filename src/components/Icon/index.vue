<script lang="ts">
/**
 * `svg`图标组件
 * - 使用异步远程加载：[图标库](https://icones.netlify.app/collection/tdesign)
 */
export default {
  name: "Icon",
}
</script>
<script lang="ts" setup>
import type { CSSProperties, PropType } from "vue";

import { computed, nextTick, onMounted, ref, watch } from "vue";

// @ts-ignore
import Iconify from "@purge-icons/generated";

const props = defineProps({
  /**
   * 图标名
   * - [图标库](https://icones.netlify.app/collection/tdesign)
   */
  name: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: undefined,
  },
  size: {
    type: [String, Number] as PropType<number | string>,
    default: 16,
  },
  spin: {
    type: Boolean,
    default: false,
  },
});

const getWrapStyle = computed<CSSProperties>(() => {
  const s = props.size;
  return {
    fontSize: typeof s === "number" ? `${s}px` : s,
    color: props.color,
  };
});

const elRef = ref<HTMLElement>();

async function update() {
  const el = elRef.value;

  if (!el) return;

  await nextTick();

  const iconName = props.name;

  if (!iconName) return;

  const svg = Iconify.renderSVG(iconName, {});

  if (svg) {
    el.textContent = "";
    el.append(svg);
  } else {
    const span = document.createElement("span");
    span.className = "iconify";
    span.dataset.icon = iconName;
    el.textContent = "";
    el.append(span);
  }
}

watch(() => props.name, update, { flush: "post" });

onMounted(update);
</script>
<template>
  <span
    ref="elRef"
    :class="['the-icon', $attrs.class]"
    :style="getWrapStyle"
  ></span>
</template>
<style lang="scss">
.the-icon {
  display: inline-flex;
}

span.iconify {
  display: block;
  min-width: 1em;
  min-height: 1em;
  background-color: #5551;
  border-radius: 100%;
}
</style>
