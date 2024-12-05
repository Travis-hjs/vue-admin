# 表格按钮操作组件

- 已注册为全局组件`<base-table-actions>`

## 参数说明

| 字段 | 类型 | 是否必需 | 说明 |
| --- | --- | --- | --- |
| list | `Array` | 是 | 按钮列表，列表对象数据看`BaseTableAction`全局类型 |
| max | `number,string` | 否 | 最大限制几个按钮出现，超过则用【更多】下拉菜单代替，默认`3` |
| row | `object` | 否 | 传入的数据，事件绑定或者返回用，当`list`数据中需要引用当前表格数据时，需要绑定该值 |
| clickStop | `boolean` | 否 | 阻止事件冒泡用 |

## 使用方式

当按钮状态需要根据变量动态改变值时，需要写在`computed`里引用

```html
<template>
  <div>
    <el-table stripe border :data="state.data">
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" width="180" align="center"></el-table-column>
      <el-table-column prop="address" label="地址" min-width="180" align="center"></el-table-column>
      <el-table-column prop="option" label="操作" width="200" align="center" fixed="right">
        <template slot-scope="{ row }">
          <base-table-actions :row="row" :list="btnList"></base-table-actions>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue"
import { randomText } from "@/utils";

interface TableRow {
  id: number;
  name: string;
  address: string;
}

const state = reactive({
  data: new Array(5).fill(0).map((_, index) => {
    return {
      id: index + 1,
      name: randomText(2, 4),
      address: randomText(6, 20)
    }
  }),
  loading: false,
});

function onAdd(row: TableRow) {
  console.log("新增 >>", row);
}

function onEdit(row: TableRow) {
  console.log("编辑 >>", row);
}

function onDelete(row: TableRow) {
  console.log("删除 >>", row);
}

function onOther(row: TableRow) {
  console.log("其他操作 >>", row);
}

const btnList: Array<BaseTableAction<TableRow>> = [
  { text: "新增", click: onAdd },
  { text: "编辑", click: onEdit },
  { text: "删除", click: onDelete, disabled: (row) => row.id === 2 },
  {
    text: row => row.id === 2 ? "无效数据" : "其他操作",
    icon: row => row.id === 2 ? "el-icon-folder-opened" : "iconfont icon-a-lujing1117",
    click: onOther,
    disabled: (row) => row.id === 2
  },
]
</script>
```
