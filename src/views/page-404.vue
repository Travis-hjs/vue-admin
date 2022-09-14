<template>
  <div class="page-404 fvc">
    <div>
      <h4 class="title">当前页面不存在</h4>
      <router-link class="goback" to="/">返回首页</router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "page-404",
})
</script>
<style lang="scss">
.page-404 {
  width: 100%;
  height: 100%;
  background-image: url("../assets/page-404.png");
  background-size: cover;
  background-position: center center;
  text-align: center;
  color: #fff;
  .title {
    font-size: 48px;
    font-weight: normal;
    margin-bottom: 16px;
    letter-spacing: 4px;
    line-height: 1;
  }
  .goback {
    font-size: 16px;
    text-decoration: underline;
  }
}
</style>