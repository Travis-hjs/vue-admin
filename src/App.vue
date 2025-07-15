<script lang="ts">
import { onMounted } from "vue";
import { messageBox } from "./utils/message";
import config from "./utils/config";
import { formatDate } from "./utils";

export default {
  name: "App",
  setup() {
    const interval = 1000 * 60;
    let timer: number;

    function checkVersion() {
      const t = Date.now();
      const { protocol, host, href } = location;
      const url = `${protocol}//${host}/version.json?t=${t}`;
      fetch(url).then(r => r.json()).then(res => {
        if (res.version && res.version !== window._version) {
          // 弹一次后直接关闭查询
          timer && clearTimeout(timer);
          messageBox({
            title: `版本更新提示`,
            content: `
            <div class="text-[14px]">
              <p>当前页面有新版本发布, 是否更新？</p>
              <p>新版发布时间：<span class="text-amber-600">${formatDate(res.version)}</span></p>
              <p>不更新则需要手动刷新页面，否则影响部分功能使用。</p>
            </div>
            `,
            confirmText: "更新",
            cancelText: "取消(关闭提醒)",
            confirm() {
              const url = new URL(href);
              url.searchParams.set("t", t.toString());
              location.href = url.toString();
            },
          });
        } else {
          timer = setTimeout(checkVersion, interval);
        }
      }).catch(error => {
        console.error("检查版本出错 >>", error);
        clearTimeout(timer);
      });
    }

    onMounted(function () {
      if (window._version && !config.isDev) {
        timer = setTimeout(checkVersion, interval);
      }
    });
  }
}
</script>
<template>
  <router-view />
</template>
