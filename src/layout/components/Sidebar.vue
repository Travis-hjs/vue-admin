<template>
  <div class="the-layout-sidebar">
    <Scrollbar :clickUpdateDelay="300" :thumbSize="10">
      <transition name="fade">
        <div class="the-logo-box" v-if="layoutInfo.showSidebarLogo">
          <router-link class="the-logo-link f-vertical" to="/">
            <img class="the-logo" :src="info.logo" />
            <h1 class="the-logo-title ellipsis" :title="info.title">{{ info.title }}</h1>
          </router-link>
        </div>
      </transition>
      <Menu :mergeOnlyOneChild="true" :onlyMergeFirst="true" />
    </Scrollbar>
  </div>
</template>
<script lang="ts">
/** 侧边栏组件 */
export default {
  name: "Sidebar"
}
</script>
<script lang="ts" setup>
import Menu from "./Menu.vue";
import { Scrollbar } from "@/components/Scrollbar";
import store from "@/store";

const layoutInfo = store.layout.info;

const info = store.projectInfo;

</script>