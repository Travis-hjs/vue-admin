<script lang="ts" setup>
const colorList = ["green", "blue", "gray", "red", "orange", "purple", "cyan"];
</script>
<template>
  <div class="menu-2">
    <span
      v-for="color in colorList"
      :key="color"
      :class="['the-tag', color]"
    >{{ color }}</span>
  </div>
</template>
<style lang="scss">
.menu-2 {
  width: 100%;
}
</style>
