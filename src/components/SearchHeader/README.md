# 基础通用搜索头部

将`<Fields />`与`<FilterBox />`做整合，传参配置完全相同；

在`*.vue`文件中输入`vue3-table-list-v2`可生成快捷代码片段

## 使用示例

```html
<script lang="ts" setup>
import { reactive } from "vue";
import { SearchHeader } from "@/components/SearchHeader";
import { type FieldType, setFieldOptions } from "@/components/Fields";

interface Search {
  keyword: string;
  type?: number;
  appId?: number;
}

function getSearchInfo(): Search {
  return {
    keyword: "",
  }
}

const searchFields: Array<FieldType.Member<Search>> = [
  {
    label: "搜索关键字",
    prop: "keyword",
    type: "input",
    placeholder: "请输入关键字",
  },
  {
    label: "应用",
    prop: "appId",
    type: "select",
    placeholder: "请选择应用",
    options: [],
    optionSetting: { label: "appName", value: "id" },
  },
  {
    label: "类型",
    prop: "type",
    type: "select",
    placeholder: "请选择类型",
    options: [
      { label: "单机", value: 1 },
      { label: "网游", value: 2 },
    ],
  }
];

const state = reactive({
  loading: false,
  searchFields,
  searchInfo: getSearchInfo(),
});

function onSearch(reset?: boolean) {
  if (reset) {
    state.searchInfo = getSearchInfo();
  }
  // do some...
}

async function getOptions() {
  state.loading = true;
  const res = await getAppIds();
  state.loading = false;
  if (res.code !== 1) return;
  const options = res.data;
  setFieldOptions(state.searchFields, "appId", options);
}
</script>
<template>
  <SearchHeader
    :search-info="state.searchInfo"
    :list="state.searchFields"
    :loading="state.loading"
    @search="onSearch"
  />
</template>
```
