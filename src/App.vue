<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

export default defineComponent({
  name: "App",
  setup() {
    return {
      zhCn
    }
  }
})
</script>
<style lang="scss">
@import "@/styles/index.scss";
@import "@/styles/layout.scss";
</style>
