# 全局表格组件

- 已注册为全局组件`<base-table>`

## `props`说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| data | `Array` | 是 | 表格数据 |
| columns | `Array` | 是 | 表格列数据，结构看下面`BaseTableColumn` |
| actions | `Array` | 否 | `<base-table-option :list="list">`组件的 list 数据 |
| loading | `Boolean` | 否 | 表格加载状态，默认`false` |
| checkbox | `Boolean` | 否 | 表格带选择操作，默认`false`，columns 中不需要定义 |
| isRowClick | `Boolean` | 否 | 表格行是否需要点击，其实就是加一个鼠标手点击的样式，和右侧按钮操作栏点击的事件阻止冒泡用 |
| emptyText | `String` | 否 | 表格空数据文字 |

```ts
/** `<base-table :columns="columns">`组局的`columns`单个对象 */
interface BaseTableColumn {
  /** 表格列标题 */
  label: string
  /**
   * 对应表格数据值的`key`
   * - `"action-right"`为固定右边
   */
  prop: string
  /** 当需要自定义插槽去写表格模板时需要，字段和`prop`一致 */
  slotName?: string
  /** 当需要动态改变列数的时候设置指定`key`来保证显示的位置对应数据列表用 */
  key?: string
  /** 
   * 列宽度
   * - 推荐直接用`number`类型
   */
  width?: string | number
  /**
   * 列最新宽度
   * - 推荐直接用`number`类型
   */
  minWidth?: string | number
  /**
   * 超出...提示
   * - 默认`true`
   */
  tooltip?: boolean
  /** 
   * 固定位置
   * - 当`prop: "action-right"`时，不需要设置该值，固定为靠右
   */
  fixed?: "right" | "left" | "true"
  /**
   * 表格列对齐设置
   * - 默认为`"center"`
   * - 当`prop: "action-right"`时，不需要设置该值，固定为居中状态
   */
  align?: "left" | "center" | "right"
}
```

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
      v-loading="loading"
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
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class extends Vue {
  tableData: Array<any> = [];

  tableColumns: Array<BaseTableColumn> = [
    { label: '项目名称', prop: 'projectName', minWidth: 200 },
    { label: '项目类型', prop: 'projectTypeStr', width: 140 },
    { label: '项目创建人', prop: 'projectLeader', width: 140 },
    { label: '项目状态', prop: 'state', width: 140, slotName: 'state',  },
    { label: '创建时间', prop: 'createTime', width: 180 },
    { label: '更新时间', prop: 'updateTime', width: 180 },
    { label: '操作', prop: 'action-right', width: 160 },
  ]

  btnList: Array<BaseTableBtnsItem> = [
    { text: "编辑", },
    { text: "查看", },
    { text: "删除", type: "danger" }
  ]
}
</script>
```


