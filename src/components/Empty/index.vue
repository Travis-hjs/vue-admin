<script lang="ts">
/** 空状态组件 */
export default {
  name: "Empty",
  props: {
    text: {
      type: String,
      default: "暂无数据"
    },
    size: {
      type: Number,
    }
  }
}
</script>
<template>
  <div class="empty">
    <img class="icon" :style="{ width: size ? `${size}px`: undefined }" src="./icon.svg" alt="">
    <span class="text">{{ text }}</span>
  </div>
</template>
<style lang="scss" scoped>
.empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .icon {
    display: block;
    margin: 0 auto 10px;
  }

  .text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
