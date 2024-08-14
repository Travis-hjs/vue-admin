# 输入框类型组件

## 输入搜索框

```html
<template>
  <InputSearch
    placeholder="请输入内容搜索"
    v-model="keyword"
    :loading="loading"
    @search="onSearch()"
  />
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { InputSearch } from "@/components/Input";

const keyword = ref("");

const loading = ref(false);

function onSearch() {
  console.log("keyword >>", keyword.value);
}

</script>
```

## 加载更多下拉选择框

```html
<template>
  <InputSelect
    placeholder="请选择xxx"
    v-model="selectValue"
    :request="getList"
    :option-setting="optSetting"
    :request-params="apiParams"
    @change="onSelect"
  />
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import { getList } from "@/api/xxx";
import { InputSelect } from "@/components/Input";

const selectValue = ref<number|"">("");

/** 接口传参数据 */
const apiParams = reactive({
  type: 12,
  state: 1,
});

const optSetting: ArrayItemSetting = {
  label: "name",
  value: "id",
  key: "id",
}

function onSelect() {
  console.log("selectValue >>", selectValue.value);
}

</script>
```

