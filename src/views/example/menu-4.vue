<script lang="ts" setup>
import store from '@/store';
import GoodsForm from './components/GoodsForm.vue'
import type { Goods } from '@/store/Goods';

const goods = store.goods;

/**
 * 范围随机整数
 * @param min 最小数
 * @param max 最大数
 */
function ranInt(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

/**
 * 随机生成中文
 * @param min
 * @param max
 */
function randomText(min: number, max: number) {
  const len = parseInt((Math.random() * max).toString()) + min
  const base = 20000
  const range = 1000
  let str = ''
  let i = 0
  while (i < len) {
    i++
    const lower = parseInt((Math.random() * range).toString())
    str += String.fromCharCode(base + lower)
  }
  return str
}

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
    <button class="the-btn blue" @click="onChange()">修改商品信息</button>
    <button class="the-btn red" @click="onClear()">重置商品信息</button>
  </div>
</template>
<style lang="scss">
.menu-4 {
  width: 100%;
}
</style>
