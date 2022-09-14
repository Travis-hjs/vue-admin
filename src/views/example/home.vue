<template>
  <div class="page-home">
    <h2 class="the-title mgb_30">Vue3 + Vite + TypeScript 后台管理模板</h2>
    <div class="mgb_40">
      <span class="the-tag blue">无 UI 框架依赖，可以无缝接入自己喜欢的任何第三方库</span>
      <a class="the-tag green" :href="project" target="_blank">项目地址</a>
      <a class="the-tag green" :href="juejin" target="_blank">掘金描述说明</a>
    </div>
    <h2 class="the-title mgb_30">布局操作开关</h2>
    <div class="options-box mgb_40">
      <label class="check-box fvertical mgb_20" for="layout-logo" @change="layoutInfo.showSidebarLogo =! layoutInfo.showSidebarLogo">
        <input type="checkbox" id="layout-logo" :checked="layoutInfo.showSidebarLogo" />
        显示侧边栏logo
      </label>
      <label class="check-box fvertical mgb_20" for="layout-tags" @change="layoutInfo.showTagsView =! layoutInfo.showTagsView">
        <input type="checkbox" id="layout-tags" :checked="layoutInfo.showTagsView" />
        显示历史记录标签
      </label>
      <label class="check-box fvertical" for="layout-open" @change="layoutInfo.sidebarOpen =! layoutInfo.sidebarOpen">
        <input type="checkbox" id="layout-open" :checked="layoutInfo.sidebarOpen" />
        侧边栏展开
      </label>
    </div>
    <h2 class="the-title mgb_30">打赏一下</h2>
    <div class="code-box">
      <img class="hovercode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode1.jpg">
      <img class="qrcode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode2.jpg">
    </div>
  </div>
</template>

<script lang="ts" setup>
import store from "@/store";
const layoutInfo = store.layout.info;
const project = store.projectInfo.link;
const juejin = "https://juejin.cn/post/7017278822068273166";
</script>
<style lang="scss">
.page-home {
  width: 100%;
  .code-box {
    width: 100%;
    img {
      display: inline-block;
      vertical-align: top;
      width: 280px;
      margin-right: 16px;
      border-radius: 4px;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
      transition: 0.3s all;
    }
    .hovercode {
      cursor: pointer;
      &:hover + .qrcode {
        opacity: 1;
        transform: translateX(0px);
      }
    }
    .qrcode {
      opacity: 0;
      transform: translateX(100px);
    }
  }
  .options-box {
    width: 220px;
  }
}
</style>