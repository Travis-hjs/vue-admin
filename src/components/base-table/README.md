# 全局表格组件

- 已注册为全局组件`<base-table>`

## `props`说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| data | `Array` | 是 | 表格数据 |
| columns | `Array` | 是 | 表格列数据，结构看下面`KchTableColumn` |
| loading | `Boolean` | 否 | 表格加载状态，默认`false` |
| selectKey | `string` | 否 | 选择操作的判断字段，设置该值才会开启选择功能，复选框列固定在左边 |
| selectList | `Array` | 否 | 绑定的选择列表，即`checkbox`操作列表，和`selectKey`需要配合一起使用 |
| selectDisabled | `Function` | 否 | 选择框禁用的条件函数 |
| isRowClick | `Boolean` | 否 | 表格行是否需要点击，其实就是加一个鼠标手点击的样式，和内部`<base-table-actions />`组件的阻止事件冒泡作用 |
| actions | `Array` | 否 | `<base-table-actions :list="list">`组件的 list 数据 |

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
<template>
  <div class="demo">
    <base-table
      :data="tableData"
      :columns="tableColumns"
      :actions="btnList"
      :loading="loading"
    >
      <template #state="{ row }">
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

interface TableRow {
  id: number
  name: string
  date: string
  state: 0 | 1 | 2 | 3
}

const tableData = ref<Array<TableRow>>([]);

const tableColumns: Array<BaseTableColumn> = [
  { label: "项目名称", prop: "projectName", minWidth: 200 },
  { label: "项目类型", prop: "projectTypeStr", width: 140 },
  { label: "项目创建人", prop: "projectLeader", width: 140 },
  { label: "项目状态", prop: "state", width: 140, slotName: "state" },
  { label: "创建时间", prop: "createTime", width: 180 },
  { label: "更新时间", prop: "updateTime", width: 180 },
  { label: "操作", prop: "action-right", width: 160 },
];

const btnList: Array<BaseTableOptionItem<TableRow>> = [
  { text: "编辑", },
  { text: "查看", },
  {
    text: "删除",
    type: "danger",
    click(row) {
      console.log(row);
    }
  }
];

</script>
```
