# 树型层级组件

参数请看[index.vue](./src/index.vue)或者看下面使用示例

## 使用示例

```html
<script lang="ts" setup>
import { Tree, type TreeType } from "@/components/Tree";
import { reactive } from "vue";

const options = [
  {
    id: "1",
    name: "选项 1",
    list: [
      {  
        id: "1-1",
        name: "选项 1-1",
      },
      {  
        id: "1-2",
        name: "选项 1-2",
        list: [
          {
            id: "1-2-1",
            name: "选项 1-2-1",
          },
          {
            id: "1-2-2",
            name: "选项 1-2-2",
          },
          {
            id: "1-2-3",
            name: "选项 1-2-3",
          },
          {
            id: "1-2-4",
            name: "选项 1-2-4",
          },
        ]
      },
      {  
        id: "1-3",
        name: "选项 1-3",
      },
      {  
        id: "1-4",
        name: "选项 1-4",
      },
      {  
        id: "1-5",
        name: "选项 1-5",
      },
    ]
  },
  {
    id: "2",
    name: "选项 2",
    list: [
      {
        id: "2-1",
        name: "选项 2-1",
      },
      {
        id: "2-2",
        name: "选项 2-2",
      },
      {
        id: "2-3",
        name: "选项 2-3",
      },
    ]
  },
];

const optionSetting: TreeType.Setting = {
  value: "id",
  label: "name",
  children: "list",
}

const state = reactive({
  values: ["1"],
  keyword: "",
});

</script>
<template>
  <div class="menu-3">
    <div class="mb-[10px]">
      <span class="the-tag purple">树形组件</span>
    </div>
    <el-input
      class="max-w-[300px] mb-[10px]"
      v-model="state.keyword"
      clearable
      placeholder="请输入关键字检索"
    />
    <Tree
      v-model:values="state.values"
      checkbox
      check-parent
      check-child
      :options="options"
      :option-setting="optionSetting"
      :disabled-method="(opt) => opt.id === '2-2'"
      :filter-method="(opt) => opt.name.includes(state.keyword)"
    />
  </div>
</template>
```
