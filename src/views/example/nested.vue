<template>
  <div class="nested">
    <p class="the-title mgb-20">多级嵌套菜单</p>
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="page-x" mode="out-in"> -->
      <!-- 需要保持缓存时开启 -->
      <!-- <keep-alive> -->
      <component :is="Component" :key="route.path" />
      <!-- </keep-alive> -->
      <!-- </transition> -->
    </router-view>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss">
.nested {
  width: 100%;
  .nested {
    padding: 10px 20px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}
</style>