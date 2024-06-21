# 菜单管理

## 备份文件
```html
<template>
  <div class="page-menu">
    <div>
      <el-button @click="openMenu('add')">新增菜单</el-button>
    </div>
    <div class="tree-header f-v">
      <div class="tree-item w-[280px]">名称</div>
      <div class="tree-item w-[120px]">类型</div>
      <div class="tree-item w-[140px]">标识</div>
      <div class="tree-item w-[140px]">排序</div>
      <div class="flex-1"></div>
      <div class="w-[160px] text-center">操作</div>
    </div>
    <section class="table-content" ref="tableBox">
      <el-tree-v2
        class="w-full"
        :data="menuList"
        :props="treeProps"
        :height="tableBoxSize.height"
        :item-size="40"
      >
        <template #default="{ data, node }: TreeSlot">
          <div class="w-full h-full f-v">
            <div class="f-v" :style="{width: `${280 - ((node.level! - 1) * 16)}px`}">
              <el-icon class="icon mr-[6px]" v-if="data.meta.icon">
                <component :is="data.meta.icon" />
              </el-icon>
              <span>{{ data.meta.title }}</span>
            </div>
            <div class="w-[120px]">
              <span :class="['the-tag', data.meta.type === 'menu' ? 'blue' : 'green']">{{ data.meta.type === 'menu' ? '菜单' : '权限' }}</span>
            </div>
            <div class="w-[140px]">
              <span>{{ data.code }}</span>
            </div>
            <div class="w-[140px]">
              <el-input-number v-model="data.sort" :min="1" @blur="onBlur(data)" @click.stop />
            </div>
            <div class="flex-1"></div>
            <div class="w-[160px]">
              <el-button link type="primary">新增</el-button>
              <el-button link type="success">编辑</el-button>
              <el-button link type="danger">删除</el-button>
            </div>
          </div>
        </template>
      </el-tree-v2>
    </section>
    <Form v-model:show="state.show" />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import Form from './components/Form.vue';
import type { MenuForm } from '@/types/common';
import type { TreeNode } from 'element-plus';

interface TreeSlot {
  data: MenuForm;
  node: TreeNode;
}

const state = reactive({
  show: false,
  showType: 'add' as 'add' | 'edit',
});

function openMenu(type: typeof state.showType) {
  state.show = true;
  state.showType = type;
}

const tableBox = ref<HTMLElement>();

const tableBoxSize = reactive({
  width: 0,
  height: 0
})

let stopUpdate = false;

function updateSize() {
  const el = tableBox.value!;
  if (tableBoxSize.height != el.clientHeight) {
    tableBoxSize.height = el.clientHeight;
  }
  if (tableBoxSize.width != el.clientWidth) {
    tableBoxSize.width = el.clientWidth;
  }
  !stopUpdate && requestAnimationFrame(updateSize);
}

onMounted(function() {
  updateSize();
})

onUnmounted(function() {
  stopUpdate = true;
})

const treeProps = {
  value: 'id',
  children: 'children',
}

let id = 0;

/**
 * 创建数据
 * @param length 
 * @param level 
 * @param maxLevel
 */
function createData(length: number, level = 1, maxLevel?: number, pId?: number) {
  return Array.from({ length }).map((_, index) => {
    id++;
    const isMenu = Math.random() > 0.5;
    const item: MenuForm = {
      id,
      name: '',
      parentId: pId,
      code: '权限标识',
      path: `/xxx/${level}/${index}`,
      component: pId ? `/xxx/${level}/${index}` : 'Layout',
      sort: id,
      redirect: '',
      meta: {
        title: `菜单-${level}-${index}`,
        icon: pId ? (isMenu ? 'Eleme' : '') : 'Eleme',
        hidden: false,
        keepAlive: false,
        type: pId ? (isMenu ? 'menu' : 'auth') : 'menu',
        status: 1
      }
    }
    if (maxLevel && level < maxLevel) {
      item.children = createData(length, level + 1, maxLevel, id);
    }
    return item;
  })
}

const menuList = createData(100, 1, 3);

function onBlur(item: MenuForm) {
  console.log(item);

}

</script>
<style lang="scss" scoped>
.page-menu {
  display: flex;
  flex-direction: column;
  .table-content {
    flex: 1;
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
```

