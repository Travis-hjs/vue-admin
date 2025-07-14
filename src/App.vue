<script lang="ts">
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { ImageViewer } from "./components/ImageViewer";
import { CurdPopupConfig } from "./components/Curd";
import { messageBox } from "./utils/message";
import { onMounted } from "vue";
import config from "./utils/config";

export default {
  name: "App",
  components: {
    ImageViewer,
    CurdPopupConfig,
  },
  setup() {
    const interval = 1000 * 60;
    let timer: number;

    function checkVersion() {
      const t = Date.now();
      const { protocol, host, href } = location;
      const url = `${protocol}//${host}/version.json?t=${t}`;
      fetch(url).then(r => r.json()).then(data => {
        if (data.version && data.version !== window._version) {
          // 弹一次后直接关闭查询
          timer && clearTimeout(timer);
          messageBox({
            title: `版本更新提示`,
            content: `
            <p>当前页面版本有新版本, 是否更新？</p>
            <p>不更新则需要手动刷新页面，否则影响部分功能使用。</p>
            `,
            confirmText: "更新",
            cancelText: "取消(关闭提醒)",
            confirm() {
              const url = new URL(href);
              url.searchParams.set('t', t.toString());
              location.href = url.toString();
            },
          });
        } else {
          timer = setTimeout(checkVersion, interval);
        }
      }).catch(error => {
        console.log("检查版本报错 >>", error);
        clearTimeout(timer);
      });
    }

    onMounted(function () {
      if (window._version && !config.isDev) {
        timer = setTimeout(checkVersion, interval);
      }
    });

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
