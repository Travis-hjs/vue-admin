# 分页组件

使用示例

```html
<template>
  <div>
    <!-- 默认使用方式 -->
    <base-pagination :disabled="loading" :pageInfo="pageInfo" @change="paginationChange" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { usePageInfo } from "@/hooks";

const pageInfo = reactive(usePageInfo())

const loading = ref(false);

function paginationChange() {
  console.log("分页器变动");
}
</script>
```
