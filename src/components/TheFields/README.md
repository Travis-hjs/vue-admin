# 基础通用表单项组件

拓展功能需要参照`types.ts`进行类型定义

## 使用示例

```html
<template>
  <el-form
    ref="formRef"
    label-width="120px"
    label-position="left"
    :model="state.formData"
  >
    <TheFields :data="state.formData" :list="state.fields" @change="onFields" />
  </el-form>
  <!-- 筛选组件中也可以使用 -->
  <FilterWrap>
    <TheFields type="search" :data="state.formData" :list="state.fields" @change="onFields" />
  </FilterWrap>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { type TheField, TheFields } from "@/components/TheFields";
import { FilterWrap  } from "@/components/FilterBox";

interface FormData {
  name: string;
  type?: number;
  price?: number;
}

const fields: Array<TheField.Type<FormData>> = [
  { label: "名称", prop: "name", type: "input", placeholder: "请输入名称" },
  {
    label: "类型",
    prop: "type",
    type: "select",
    options: [
      { id: 1, name: "网游" },
      { id: 2, name: "单机" }
    ],
    optionSetting: { label: "name", value: "id" },
    placeholder: "请选择类型"
  },
  { label: "价格", prop: "price", type: "number", placeholder: "请输入价格" },
];

const state = reactive({
  formData: {
    name: ""
  } as FormData,
  fields,
});

function onFields(prop: string, value: any) {
  console.log(prop, value);
}
</script>
```
