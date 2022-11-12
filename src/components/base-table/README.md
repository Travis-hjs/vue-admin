# 全局表格组件

- 已注册为全局组件`<base-table>`

## `props`说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| data | `Array` | 是 | 表格数据 |
| columns | `Array` | 是 | 表格列数据，结构看下面`KchTableColumn` |
| loading | `Boolean` | 否 | 表格加载状态，默认`false` |
| checkbox | `Boolean` | 否 | 表格带选择操作，默认`false`，columns 中不需要定义 |
| isRowClick | `Boolean` | 否 | 表格行是否需要点击，其实就是加一个鼠标手点击的样式，和内部`<base-table-option />`组件的阻止事件冒泡作用 |
| actions | `Array` | 否 | `<base-table-option :list="list">`组件的 list 数据 |
| rowIndex | `Boolean` | 否 | 是否显示表格编号 |

## 组件事件

| 事件名 | 说明 | 参数 |
| --- | --- |
| select | checkbox 为 true 时，复选框操作回调 | 一个参数：选中列表 |
| row | | 点击表格行时操作回调，携带三个参数，第一个为行数据，第二个为表格内部数据，第三个为事件对象 |


## 使用示例-基础模式

```html
<template>
  <div class="demo">
    <base-table
      :data="tableData"
      :columns="tableColumns"
      :actions="btnList"
      :loading="loading"
    >
      <template #state="row">
        <span class="the-tag blue" v-if="row.state == 0">未开始</span>
        <span class="the-tag green" v-if="row.state == 1">进行中</span>
        <span class="the-tag gray" v-if="row.state == 2">已结束</span>
        <span class="the-tag red" v-if="row.state == 3">已终止</span>
      </template>
    </base-table>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const tableData = ref([]);

const tableColumns: Array<BaseTableColumn> = [
  { label: "项目名称", prop: "projectName", minWidth: 200 },
  { label: "项目类型", prop: "projectTypeStr", width: 140 },
  { label: "项目创建人", prop: "projectLeader", width: 140 },
  { label: "项目状态", prop: "state", width: 140, slotName: "state" },
  { label: "创建时间", prop: "createTime", width: 180 },
  { label: "更新时间", prop: "updateTime", width: 180 },
  { label: "操作", prop: "action-right", width: 160 },
];

const btnList: Array<BaseTableOptionItem> = [
  { text: "编辑", },
  { text: "查看", },
  { text: "删除", type: "danger" }
];

</script>
```
