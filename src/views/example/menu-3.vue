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
        list: [
          {
            id: "**s",
            name: "三级选项-1"
          },
          {
            id: "**",
            name: "三级选项-2"
          },
          {
            id: "999",
            name: "三级选项-3"
          },
        ]
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
    <el-input
      class="max-w-[300px] mb-[10px]"
      v-model="state.keyword"
      clearable
      placeholder="请输入关键字检索"
    />
    <div class="mb-[10px]">
      <span class="the-tag purple">树形组件-带复选框</span>
    </div>
    <Tree
      v-model:values="state.values"
      checkbox
      check-parent
      check-child
      :options="options"
      :option-setting="optionSetting"
      :disabled-method="(opt) => ['999', '2-2'].includes(opt.id)"
      :filter-method="(opt) => opt.name.includes(state.keyword)"
    />
    <div class="pt-[10px] mb-[10px]">
      <span class="the-tag purple">树形组件-插槽模式</span>
    </div>
    <Tree
      :options="options"
      :option-setting="optionSetting"
      :filter-method="(opt) => opt.name.includes(state.keyword)"
    >
      <template #default="option">
        <span>{{ option.name }}</span>
        <span class="ml-[4px] text-amber-400 text-[12px]">({{ option.id }})</span>
      </template>
    </Tree>
  </div>
</template>
<style lang="scss">
.menu-3 {
  width: 100%;
}
</style>
