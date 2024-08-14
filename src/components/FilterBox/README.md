# 表格筛选组件

使用示例

```html
<template>
  <div class="demo">
    <FilterWrap>
      <FilterItem label="筛选一">
        <el-select v-model="searchInfo.value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </FilterItem>
      <FilterItem label="筛选二">
        <el-select v-model="searchInfo.value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </FilterItem>
      <FilterItem label="日期">
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </FilterItem>
      <template #right>
        <el-button type="primary"><i class="el-icon-plus el-icon--left"></i>新增</el-button>
      </template>
    </FilterWrap>

  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { FilterWrap, FilterItem  } from "@/components/FilterBox";

const dateValue = ref([]);

const searchInfo = ref({
  value: ""
})

const options = [{ label: "xxx", value: 1 }]

</script>

```