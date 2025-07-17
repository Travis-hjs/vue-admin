<script lang="ts">
/** 全屏弹出层 */
export default {
  name: "FullPopup"
}
</script>
<script lang="ts" setup>
import { useZIndex } from "@/hooks/common";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: undefined,
  },
  zIndex: {
    type: Number,
    default: () => useZIndex(),
  },
});

const emit = defineEmits<{
  (event: "update:show", val: boolean): void;
  (event: "close", val: boolean): void;
}>();

function onClose() {
  emit("close", false);
  emit("update:show", false);
}
</script>
<template>
  <section>
    <transition name="page-y" mode="out-in">
      <div
        v-if="props.show"
        class="the-curd-popup-config"
        :style="{ 'z-index': props.zIndex }"
      >
        <nav class="the-curd-popup-top f-vertical">
          <h2 v-if="props.title" class="the-title">{{ props.title }}</h2>
          <div class="f1 f-vertical pl-[20px]">
            <slot name="top"></slot>
          </div>
          <i class="the-curd-popup-close el-icon-close fvc" @click="onClose"></i>
        </nav>
        <section class="the-curd-popup-content">
          <slot></slot>
        </section>
        <footer v-if="$slots.footer" class="the-curd-popup-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </transition>
  </section>
</template>
