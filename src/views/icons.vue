<template>
  <div class="page-icons">
    <div class="mgb_30">
      <h2 class="the-title mgr_20">Svg Icons</h2>
      <span class="the-tag blue">点击复制代码</span>
    </div>
    <div class="icon-item" v-ripple color="rgba(0,0,0,0.14)" v-for="(item) in list" :key="item" v-copy="getSvgIconCode(item)" :title="getSvgIconCode(item)">
      <svg-icon :name="item" />
      <p>{{ item }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "svg-icons", // 设置路由缓存 keepAlive 时，这里必须要设置对应的 name 值
  setup() {
    const svgFileReg = /(?<=(svg\/)).*?(?=(.svg))/;

    function getSvgNames() {
      const svgInfo = import.meta.globEager("/src/icons/svg/*.svg");
      const svgs = Object.keys(svgInfo);
      const names = svgs.map((value) => {
        const res = value.match(svgFileReg)![0];
        return res;
      });
      return names;
    }

    function getSvgIconCode(symbol: string) {
      return `<svg-icon name="${symbol}" />`;
    }

    const list = getSvgNames();

    console.log("svg-list >>", list);

    return {
      list,
      getSvgIconCode,
    };
  },
});
</script>
<style lang="scss">
.page-icons {
  width: 100%;
  .icon-item {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    width: 120px;
    padding: 10px 16px;
    margin-bottom: 16px;
    margin-right: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: #555;
    font-size: 15px;
    .svg-icon {
      width: 28px;
      height: 28px;
      margin-bottom: 10px;
      transition: 0.3s all;
    }
    &:hover {
      .svg-icon {
        transform: scale(1.2);
      }
    }
  }
}
</style>