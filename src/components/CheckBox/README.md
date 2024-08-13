# 复选框组件

## 参数

看`index.vue`，懒得写了

## 使用示例

```html
<template>
  <div>
    <CheckBox v-model="state.check1" label="带label的复选框" />
    <CheckBox v-model="state.check2" />
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { CheckBox } from "@/components/CheckBox";

const state = reactive({
  check1: false,
  check2: false
})

</script>
```