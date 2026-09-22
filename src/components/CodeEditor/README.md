# 代码编辑器

```html
<template>
  <CodeEditor
    v-model:value="state.json"
    language="json"
    placeholder="请输入JSON"
  />
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { CodeEditor } from "@/components/CodeEditor";

const state = reactive({
  json: "",
});
</script>
```
