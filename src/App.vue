<script lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ImageViewer } from "./components/ImageViewer";
import { CurdPopupConfig } from "./components/Curd";

export default {
  name: "App",
  components: {
    ImageViewer,
    CurdPopupConfig,
  },
  setup() {
    return {
      zhCn
    }
  }
}
</script>
<template>
  <el-config-provider :locale="zhCn">
    <router-view />
    <ImageViewer />
    <CurdPopupConfig />
  </el-config-provider>
</template>
<style lang="scss">
@import url("./styles/index.scss");
@import url("./styles/layout.scss");
</style>
