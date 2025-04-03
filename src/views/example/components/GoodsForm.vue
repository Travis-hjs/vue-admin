<script lang="ts" setup>
import type { Goods } from "@/store/Goods";
import { type PropType } from "vue";

const props = defineProps({
  form: {
    type: Object as PropType<Goods.Form>,
    required: true
  }
});

</script>
<template>
  <div class="goods-form">
    <h2 class="the-title is-line mb-[20px]">商品表单组件-测试文件</h2>
    <div>
      <textarea class="border" cols="30" rows="10" readonly :value="JSON.stringify(props.form, null, 4)"></textarea>
    </div>
  </div>
</template>
<style lang="scss">
.goods-form {
  width: 100%;
}
</style>
