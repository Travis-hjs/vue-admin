<template>
  <div class="goods-form">
    <h2 class="the-title is-line mgb-20">商品表单组件-测试文件</h2>
    <div>
      <textarea cols="30" rows="10" readonly :value="JSON.stringify(props.form, null, 4)"></textarea>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Goods } from "@/store/Goods";
import { ref, reactive, type PropType } from "vue";

const props = defineProps({
  form: {
    type: Object as PropType<Goods.Form>,
    required: true
  }
})

</script>
<style lang="scss">
.goods-form {
  width: 100%;
}
</style>