# 表格操作按钮栏组件

- 已注册为全局组件`<base-table-btns>`

## `props`说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| list | `Array` | 是 | 按钮列表，列表对象数据看下面`BaseTableBtnsItem` |
| max | `number,string` | 否 | 最大限制几个按钮出现，超过则用【更多】下拉菜单代替，默认`3` |
| row | `object` | 否 | 传入的数据，事件绑定或者返回用，当`list`数据中需要引用当前表格数据时，需要绑定该值 |
| clickStop | `boolean` | 否 | 阻止事件冒泡用 |

```ts
/** `<base-table-btns>`组件列表对象 */
interface BaseTableBtnsItem<T = BaseObj> {
  /** 按钮文字 */
  text: string | ((row: T) => string)
  /** 按钮图标`class` */
  icon?: string | ((row: T) => string)
  /** 是否禁用 */
  disabled?: boolean | ((row: T) => boolean)
  /** 是否加载状态 */
  loading?: boolean | ((row: T) => boolean)
  /** 是否显示该按钮，不设置则显示，功能等价于`v-if` */
  show?: boolean | ((row: T) => boolean)
  /** 点击事件 */
  click?: (row: T) => void
}
```

## 使用方式

当按钮状态需要根据变量动态改变值时，需要写在`computed`里引用


```html
<template>
  <div>
    <el-table stripe border :data="tableData">
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
      <el-table-column prop="address" label="地址" min-width="180" align="center"></el-table-column>
      <el-table-column prop="option" label="操作" width="240" align="center" fixed="right">
        <template slot-scope="{ row }">
          <base-table-btns :row="row" :list="btnList"></base-table-btns>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { randomText } from "@/utils";

interface TableItem {
  id: number
  name: string
  address: string
}

@Component({})
export default class Demo extends Vue {

  tableData = new Array(5).fill(0).map((_, index) => {
    return {
      id: index + 1,
      name: randomText(2, 4),
      address: randomText(6, 20)
    }
  })

  btnList: Array<BaseTableBtnsItem<TableItem>> = [
    { text: "新增", icon: "el-icon-plus", click: this.onAdd },
    { text: "编辑", icon: "el-icon-edit", type: "success", click: this.onEdit },
    { text: "删除", icon: "el-icon-delete", type: "danger", click: this.onDelete, disabled: (row) => row.id === 2 },
    {
      text: row => row.id === 2 ? "无效数据" : "其他操作",
      icon: row => row.id === 2 ? "el-icon-folder-opened" : "el-icon-s-operation",
      click: this.onOther,
      disabled: (row) => row.id === 2
    },
  ]

  onAdd(row: TableItem) {
    console.log("新增 >>", row);
    this.$message.success("新增");
  }

  onEdit(row: TableItem) {
    console.log("编辑 >>", row);
    this.$message.success("编辑");
  }

  onDelete(row: TableItem) {
    console.log("删除 >>", row);
    this.$message.success("删除");
  }

  onOther(row: TableItem) {
    console.log("其他操作 >>", row);
    this.$message.success("其他操作");
  }
}
</script>
```


