# 全局表格组件

- 已注册为全局组件`<base-table>`

## `props`说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| data | `Array` | 是 | 表格数据 |
| columns | `Array` | 是 | 表格列数据，结构看下面`BaseTableColumn` |
| loading | `Boolean` | 否 | 表格加载状态，默认`false` |
| selectKey | `string` | 否 | 选择操作的判断字段，设置该值才会开启选择功能，复选框列固定在左边 |
| selectList | `Array` | 否 | 绑定的选择列表，即`checkbox`操作列表，和`selectKey`需要配合一起使用 |
| selectDisabled | `Function` | 否 | 选择框禁用的条件函数 |
| isRowClick | `Boolean` | 否 | 表格行是否需要点击，其实就是加一个鼠标手点击的样式，和内部`<base-table-actions />`组件的阻止事件冒泡作用 |
| actions | `Array` | 否 | `<base-table-actions :actions="list">`组件的列表数据 |

这里不使用`el-table`自带的选择功能理由是：

1. 没有跟数据做绑定，每次更新表格数据都会使上一次选中的状态重置；
2. 每次调用`tableRef.toggleRowSelection()`时会触发表格的选中事件，导致逻辑混乱；
3. 在有分页的操作时，要记录上一次选中的操作需要写很多不必要的代码；

所以内部重新用双向绑定的操作将选中状态做关联，由开发者去控制列表变量来达到何时清空选中状态。

## 组件事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| row | 点击表格行时操作回调，携带三个参数，第一个为行数据，第二个为表格内部数据，第三个为事件对象 | 返回三个参数，具体看类型定义 |

## 使用示例-基础模式

```html
<script lang="ts" setup>
import { reactive } from "vue";

interface TableRow {
  id: number;
  projectName: string;
  projectTypeStr: string;
  projectLeader: string;
  createTime: string;
  updateTime: string;
  status: 0 | 1 | 2 | 3;
}

const state = reactive({
  loading: false,
  data: [] as Array<TableRow>,
});

const tableColumns: Array<BaseTableColumn<TableRow>> = [
  { title: "项目名称", prop: "projectName", minWidth: 200 },
  { title: "项目类型", prop: "projectTypeStr", width: 140 },
  { title: "项目创建人", prop: "projectLeader", width: 140 },
  { title: "项目状态", prop: "status", width: 140, slot: "status" },
  { title: "创建时间", prop: "createTime", width: 180 },
  { title: "更新时间", prop: "updateTime", width: 180 },
  { title: "操作", prop: "action-right", width: 160 },
];

const tableActions: Array<BaseTableAction<TableRow>> = [
  { text: "编辑", },
  { text: "查看", },
  {
    text: "删除",
    type: "danger",
    click(row) {
      console.log(row);
    },
  }
];
</script>
<template>
  <div class="demo">
    <base-table
      :data="state.data"
      :columns="tableColumns"
      :actions="tableActions"
      :loading="state.loading"
    >
      <template #status="{ row }">
        <span class="the-tag blue" v-if="row.status === 0">未开始</span>
        <span class="the-tag green" v-if="row.status === 1">进行中</span>
        <span class="the-tag gray" v-if="row.status === 2">已结束</span>
        <span class="the-tag red" v-if="row.status === 3">已终止</span>
      </template>
    </base-table>
  </div>
</template>
```

## 使用示例-带选择操作

```html
<script lang="ts" setup>
import { reactive } from "vue";

interface TableRow {
  id: number;
  projectName: string;
  projectTypeStr: string;
  projectLeader: string;
  createTime: string;
  updateTime: string;
  status: 0 | 1 | 2 | 3;
}

const state = reactive({
  loading: false,
  data: [] as Array<TableRow>,
  selected: [] as Array<TableRow>,
});

const tableColumns: Array<BaseTableColumn<TableRow>> = [
  { title: "项目名称", prop: "projectName", minWidth: 200 },
  { title: "项目类型", prop: "projectTypeStr", width: 140 },
  { title: "项目创建人", prop: "projectLeader", width: 140 },
  {
    title: "项目状态",
    prop: "status",
    width: 140,
    rawContent(_, row) {
      const list = [
        { text: "未开始", color: "blue" },
        { text: "进行中", color: "green" },
        { text: "已结束", color: "gray" },
        { text: "已终止", color: "red" },
      ];
      const target = list[row.status];
      return `<span class="the-tag ${target.color}">${target.text}</span>`;
    },
  },
  { title: "创建时间", prop: "createTime", width: 180 },
  { title: "更新时间", prop: "updateTime", width: 180 },
  { title: "操作", prop: "action-right", width: 160 },
];

const tableActions: Array<BaseTableAction<TableRow>> = [
  { text: "编辑", },
  { text: "查看", },
  {
    text: "删除",
    type: "danger",
    click(row) {
      console.log(row);
    },
  }
];

function onSearch() {
  // TODO: 选择列表重置的操作由开发者自行决定
  state.selected = [];
  // 再去进行列表查询请求操作
}
</script>
<template>
  <div class="demo">
    <el-button @click="onSearch()">搜索</el-button>
    <base-table
      :data="state.data"
      :columns="tableColumns"
      :actions="tableActions"
      :loading="state.loading"
      select-key="id"
      v-model:select-list="state.selected"
      :select-disabled="(row) => (row.id % 4) === 0"
    ></base-table>
  </div>
</template>
```
