# 抽屉组件

`<el-drawer>`组件内部做了阻止事件冒泡处理，导致其他点击操作事件的异常情况，这里重写一个功能类似的组件

使用示例

```html
<script lang="ts" setup>
import { ref } from "vue";
import { Drawer } from "@/components/Drawer";

const showDrawer = ref(false);

</script>
<template>
  <div class="demo">
    <Drawer v-model:show="showDrawer" title="测试抽屉盒子">
      <div>内容内容内容内容内容</div>
      <template #footer>
        底部插槽
      </template>
    </Drawer>
  </div>
</template>
```
