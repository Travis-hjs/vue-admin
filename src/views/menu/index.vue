<template>
  <div class="page-menu">
    <div>
      <el-button @click="openMenu('add')">新增菜单</el-button>
    </div>
    <section class="table-content">
      <el-table-v2
        :columns="columns"
        :data="menuList"
        :width="tableBoxSize.width"
        :height="tableBoxSize.height"
        expand-column-key="meta.title"
        fixed
        border
      >
        <template #cell="{ rowData, column }: SlotCell">
          <template v-if="column.key === 'meta.title'">
            <svg-icon v-if="rowData.meta.icon" class="el-icon--left" :name="rowData.meta.icon" />
            <span>{{ rowData.meta.title }}</span>
          </template>
          <template v-if="column.key === 'meta.type'">
            <span :class="['the-tag', rowData.meta.type === 'menu' ? 'blue' : 'green']">
              {{ rowData.meta.type === 'menu' ? '菜单' : '权限' }}
            </span>
          </template>
          <template v-if="column.key === 'sort'">
            <el-input-number
              v-model="rowData.sort"
              :min="1"
              @blur="onBlur(rowData)"
            />
          </template>
          <template v-if="column.key === 'meta.status'">
            <el-switch
              v-model="rowData.meta.status"
              :active-value="1"
              :inactive-value="2"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
            />
          </template>
          <template v-if="column.key === 'meta.hidden'">
            <span :class="['the-tag', rowData.meta.hidden ? 'red' : 'purple']">{{ rowData.meta.hidden ? '是' : '否' }}</span>
          </template>
          <div style="width: 100%; text-align: right;" v-if="column.key === 'option'">
            <el-button link type="primary" v-if="rowData.meta.type === 'menu'" @click="onAdd(rowData)">新增</el-button>
            <el-button link type="success" @click="onEdit(rowData)">编辑</el-button>
            <el-button link type="danger">删除</el-button>
          </div>
        </template>
      </el-table-v2>
    </section>
    <Form v-model:show="state.show" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import Form from "./components/Form.vue";
import {
  type Column,
  TableV2FixedDir,
} from "element-plus";
import { useLayoutContentSize } from "@/hooks/common";
import type { MenuForm } from "@/router/types";

interface Row extends Omit<MenuForm, "id" | "parentId" | "children"> {
  /** 原来数据数据`id` */
  _id?: number;
  /** 原来数据`parentId` */
  _parentId?: number;
  /**
   * 数据`id`
   * - 虚拟表格不能设置`id`为 number, 且值的结构必需为`row-id`
   */
  id?: string;
  /**
   * 与`id`一致
   */
  parentId?: string;
  /** 子节点 */
  children?: Array<Row>
}

interface SlotCell {
  rowData: Row;
  column: {
    key: string
  }
}

const state = reactive({
  show: false,
  showType: "add" as "add" | "edit",
});

function openMenu(type: typeof state.showType) {
  state.show = true;
  state.showType = type;
}

let id = 0;

/**
 * 创建数据
 * @param length 
 * @param level 
 * @param maxLevel
 */
function createData(length: number, level = 1, maxLevel?: number, pId?: string) {
  return Array.from({ length }).map((_, index) => {
    id++;
    const isMenu = Math.random() > 0.5;
    const rowId = `row-${id}`;
    const item: Row = {
      id: rowId,
      name: "",
      parentId: pId,
      code: "权限标识",
      path: `/xxx/${level}/${index}`,
      component: pId ? `/xxx/${level}/${index}` : "Layout",
      sort: 1,
      redirect: "",
      meta: {
        title: `${isMenu ? "菜单" : "权限"}-${level}-${index}`,
        icon: (isMenu ? "menu" : "guide"),
        hidden: false,
        keepAlive: false,
        type: (isMenu ? "menu" : "auth"),
        status: 1
      }
    }
    if (maxLevel && level < maxLevel) {
      item.children = createData(length, level + 1, maxLevel, rowId);
    }
    return item;
  })
}

const menuList = ref(createData(100, 1, 3));

function onBlur(item: Row) {
  console.log(item);

}

const columns: Array<Column<Row>> = [
  { title: "名称", width: 320, key: "meta.title" },
  { title: "类型", width: 100, key: "meta.type" },
  { title: "标识", width: 140, key: "code" },
  { title: "菜单路径", width: 140, key: "path" },
  { title: "排序", width: 180, key: "sort" },
  { title: "启用", width: 100, key: "meta.status" },
  { title: "隐藏", width: 100, key: "meta.hidden" },
  {
    title: "操作",
    width: 160,
    key: "option",
    fixed: TableV2FixedDir.RIGHT,
    headerClass: "justify-center"
  },
];

columns.forEach(item => {
  item.dataKey = item.key;
});

function onAdd(row: Row) {
  openMenu("add")
}

function onEdit(row: Row) {
  openMenu("edit")
}

const tableBoxSize = reactive({
  width: 0,
  height: 0
})

useLayoutContentSize({
  el: ".table-content",
  callback(size) {
    tableBoxSize.width = size.width;
    tableBoxSize.height = size.height;
    // console.log("size >>", size);
  }
}) 

</script>
<style lang="scss">
.page-menu {
  display: flex;
  flex-direction: column;
  height: var(--layout-content-height);
  .table-content {
    flex: 1;
    overflow: hidden;
  }
  .tree-header {
    width: 100%;
    height: 44px;
    background: var(--el-fill-color-light);
    color: #888;
    font-size: 15px;
    font-weight: bold;
    .tree-item {
      padding-left: 24px;
    }
  }
}
</style>