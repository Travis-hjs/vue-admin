<template>
  <div
    :class="[
      'the-layout',
      layoutInfo.layoutMode,
      { 'has-tags-view': layoutInfo.showTagsView },
      { 'collapsed-sidebar': !layoutInfo.showSidebar }
    ]"
  >
    <HeaderBar />
    <Sidebar />
    <div class="the-layout-content" ref="contentBox">
      <router-view class="the-layout-page" v-slot="{ Component, route }">
        <transition name="page-y" mode="out-in">
          <keep-alive :include="cacheList">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <button :class="['the-layout-to-top', {'hidden' : !showToTop}]" title="返回顶部" @click="toTop()"></button>
  </div>
</template>
<script lang="ts">
/** 整体布局架子 */
export default {
  name: "Layout"
}
</script>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import HeaderBar from "./components/HeaderBar.vue";
import Sidebar from "./components/Sidebar.vue";
import store from "@/store";
import type { RouteItem } from "@/types";

const layoutInfo = store.layout.info;

function getCacheList(list: Array<RouteItem>) {
  let result: Array<string> = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const child = item.children;
    if (child && child.length > 0) {
      result = result.concat(getCacheList(child));
    }
    if (item.meta.keepAlive && item.name) {
      result.push(item.name);
    }
  }
  return result.filter(item => item);
}

// 这里不是动态的，所以可以不用响应式
const cacheList = getCacheList(store.layout.completeRouters);
// console.log("路由缓存列表 >>", cacheList);

const contentBox = ref<HTMLElement>();

const showToTop = ref(false);

let contentEl: HTMLElement;

function toTop() {
  contentEl.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
}

function onScroll() {
  // 判断超过一屏高度则显示返回顶部按钮
  showToTop.value = contentEl.scrollTop > document.documentElement.clientHeight;
}

onMounted(function () {
  contentEl = contentBox.value!;
  contentEl.addEventListener("scroll", onScroll);
  onScroll(); // 一开始要先执行，因为有可能一开始就处于页面非顶部
});
</script>
