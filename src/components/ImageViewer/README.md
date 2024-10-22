# 图片预览组件

- 全局只可以挂载一次，在`App.vue`中挂载一次使用即可；

- 为什么不直接使用`<el-image />`？因为在表格组件或其他的库中，会受到层级的影响从而导致功能异常，同时设置层级的方式不够灵活，所以单独抽离出来做一个函数式调用更加合理灵活。

## 使用方式

```html
<template>
  <el-button @click="onPreview()">预览图片</el-button>
</template>
<script lang="ts" setup>
import { openPreview } from "@/components/ImageViewer";

function onPreview() {
  openPreview({
    urls: [
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    ]
  });
}
</script>
```
