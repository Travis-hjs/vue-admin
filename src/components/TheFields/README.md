# 基础通用表单项组件

拓展功能需要参照 [types.ts](./src/types.ts) 进行类型定义

> 为什么要有一个和`<Curd />`内部相似的功能组件？因为在 Curd 中，依赖到整体的数据结构配置，同时单个表单项的字段会更加细化和较多字段，而且在一些自定义界面场景中不适用；所以为了适配更加可控且自由的界面实现，这里将使用频率较多的表单组件用列表的形式封装起来，方便使用。其内部依然是 el-plus 的各个组件，不做过多的二次封装。

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
  sub: {
    content: string;
  }
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
  { label: "子内容", prop: "sub.content", type: "textarea", placeholder: "请输入内容" },
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
