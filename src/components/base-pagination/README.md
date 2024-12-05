# 分页组件

使用示例

```html
<template>
  <div>
    <!-- 默认使用方式 -->
    <base-pagination :disabled="state.loading" :pageInfo="state.pageInfo" @change="paginationChange" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { getPageInfo } from "@/hooks/common";

const state = reactive({
  loading: false,
  pageInfo: getPageInfo(),
});

function paginationChange() {
  console.log("分页器变动");
}
</script>
```
