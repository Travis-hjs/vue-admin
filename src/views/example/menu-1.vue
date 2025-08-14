<script lang="ts" setup>
import { openDialog } from "@/components/base-dialog";
import TsxExample from "../tsx/example";

function onTest() {
  openDialog({
    component: TsxExample,
    dialogProps: {
      title: "函数调用式打开弹框",
      width: "500px",
    },
    confirm() {
      console.log("确 认");
    }
  });
}
</script>
<template>
  <div class="menu-1">
    <span class="the-tag blue">menu-1</span>
    <button class="the-btn blue ml-[10px]" v-ripple @click="onTest()">函数调用式打开弹框</button>
  </div>
</template>
<style lang="scss">
.menu-1 {
  width: 100%;
}
</style>
