# 分页组件

使用示例

```html
<template>
  <div>
    <!-- 默认使用方式 -->
    <base-pagination :pageInfo="pageInfo" @change="paginationChange" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { usePageInfo } from "@/hooks";

const pageInfo = reactive(usePageInfo())

function paginationChange() {
  console.log("分页器变动");
}
</script>
```
