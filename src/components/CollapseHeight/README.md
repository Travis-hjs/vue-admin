# 高度折叠过渡组件

使用时，请不要在组件标签中直接写上`style`定义的属性，像：`<CollapseHeight style="height | min-height | max-height | padding | margin">`等，可以在外部包一个`div`或者插槽内容设置样式。

## 单个过渡

```html
<script lang="ts" setup>
import { ref } from "vue";
import { CollapseHeight } from "@/components/CollapseHeight";

const switchBox = ref(false);
</script>
<template>
  <div class="demo">
    <button @click="switchBox = !switchBox">switch the `div` show or hide</button>
    <CollapseHeight :show="switchBox">
      <div class="box">
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
      </div>
    </CollapseHeight>
  </div>
</template>
<style>
.demo .box {
  width: 100px;
  background-color: orange;
}
</style>
```
