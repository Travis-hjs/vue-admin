<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
  <ImageViewer />
</template>
<script lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ImageViewer } from "./components/ImageViewer";

export default {
  name: "App",
  components: {
    ImageViewer,
  },
  setup() {
    return {
      zhCn
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/index.scss";
@import "@/styles/layout.scss";
</style>
