<template>
  <div class="svg-icon-list">
    <div
      v-for="(item) in list"
      class="icon-item"
      v-ripple
      color="rgba(0,0,0,0.14)"
      :key="item"
      @click="onClickIcon(item)"
      :title="getSvgIconCode(item)"
    >
      <svg-icon :name="item" />
      <p>{{ item }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { copyText } from "@/utils";
import { message } from "@/utils/message";

/** 图标列表 */
export default defineComponent({
  name: "IconList"
})
</script>
<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String as PropType<"page"|"popup">,
    default: "page"
  }
});

const emit = defineEmits<{
  (event: "iconClick", name: string): void
}>();

const svgFileReg = /(?<=(svg\/)).*?(?=(.svg))/;

function getSvgNames() {
  const svgInfo = import.meta.glob("/src/icons/svg/*.svg");
  const svgs = Object.keys(svgInfo);
  const names = svgs.map(value => value.match(svgFileReg)![0]);
  return names;
}

function getSvgIconCode(symbol: string) {
  return `<svg-icon name="${symbol}" />`;
}

const list = getSvgNames();

function onClickIcon(name: string) {
  if (props.type === "popup") {
    emit("iconClick", name);
  } else {
    copyText(getSvgIconCode(name), () => {
      message.success("复制图标代码成功！");
    })
  }
}

// console.log("svg-list >>", list);
</script>
<style lang="scss">
.svg-icon-list {
  width: 100%;
  .icon-item {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    width: 120px;
    padding: 10px 16px;
    margin-bottom: 16px;
    margin-right: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: #555;
    font-size: 15px;
    .svg-icon {
      width: 28px;
      height: 28px;
      margin-bottom: 10px;
      transition: 0.3s all;
    }
    &:hover {
      .svg-icon {
        transform: scale(1.2);
      }
    }
  }
}
</style>