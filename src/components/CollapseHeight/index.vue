<template>
  <section class="collapse-height" ref="collapseBox">
    <slot></slot>
  </section>
</template>
<script lang="ts">
/** 高度折叠过渡组件 */
export default {
  name: "CollapseHeight"
}
</script>
<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  show: {
    type: Boolean
  }
});

const collapseBox = ref<HTMLElement>();

function show() {
  const el = collapseBox.value;
  if (el) {
    el.style.display = "";
    el.style.height = "";
    // console.log(el.clientHeight, el.offsetHeight);
    const height = el.clientHeight;
    el.style.height = "0px";
    el.offsetHeight; // 回流
    el.style.height = `${height}px`;
  }
}

function hide() {
  const el = collapseBox.value;
  if (el) {
    const height = el.clientHeight;
    el.style.height = `${height}px`;
    el.offsetHeight; // 回流
    el.style.height = "0px";
  }
}

watch(() => props.show, function(val, before) {
  if (val === before) return;
  val ? show() : hide();
});

onMounted(function() {
  const el = collapseBox.value!;
  el.addEventListener("transitionend", function() {
    if (props.show) {
      el.style.height = "";
    } else {
      el.style.display = "none";
      // el.style.height = "";
    }
  });
  show();
});

</script>
<style lang="scss">
.collapse-height {
  transition: .3s height;
  overflow: hidden;
}
</style>