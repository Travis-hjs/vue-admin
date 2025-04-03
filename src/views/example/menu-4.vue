<script lang="ts" setup>
import store from '@/store';
import GoodsForm from './components/GoodsForm.vue'
import type { Goods } from '@/store/Goods';
import { ranInt, randomText } from '@/utils';

const goods = store.goods;

function onChange() {
  const sizes: Array<Goods.Specs["size"]> = ["xs", "s", "m", "l", "xl", "2xl"];
  goods.update({
    id: ranInt(0, 999),
    name: randomText(2, 20),
    price: ranInt(1, 999),
    specs: {
      size: sizes[ranInt(0, sizes.length - 1)]
    }
  })
}

function onClear() {
  goods.reset();
}

</script>
<template>
  <div class="menu-4">
    <div class="mb-[20px]">
      <span class="the-tag cyan">menu-4</span>
    </div>
    <GoodsForm class="mb-[20px]" :form="goods.info" />
    <el-button type="primary" @click="onChange()">修改商品信息</el-button>
    <el-button @click="onClear()">重置商品信息</el-button>
  </div>
</template>
<style lang="scss">
.menu-4 {
  width: 100%;
}
</style>
