<template>
  <MenuItem v-for="item in menuList" :key="item.key" :info="item" />
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MenuItem from "./MenuItem.vue";
import store from "@/store";
import { filterHidden } from "@/router";
import { LayoutMenuItem, RouteItem } from "@/types";

// ============= 侧边菜单组件 =============

const props = defineProps({
  /** 是否合并只有一个子项 */
  mergeOnlyOneChild: {
    type: Boolean,
    default: false
  },
  /** 是否只合并第一层路由列表 */
  onlyMergeFirst: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();

/**
 * 格式化菜单列表
 * @param list 
 * @param parentKey 上层`key`
 */
function formatMenuList(list: Array<RouteItem>, parentKey?: string) {
  list = JSON.parse(JSON.stringify(list));
  const result: Array<LayoutMenuItem> = [];
  for (let i = 0; i < list.length; i++) {
    const routeItem = list[i];
    const item: LayoutMenuItem = {
      key: parentKey ? `${parentKey}-${i}` : i.toString(),
      isOpen: false,
      isActive: false,
      hasActive: false,
      children: [],
      path: routeItem.path,
      ...routeItem.meta
    }
    if (!item.hidden) {
      result.push(item);
      const child = routeItem.children;
      if (child && child.length > 0) {
        item.children = formatMenuList(child, item.key);
      }
    }
  }
  return result;
}

/**
 * 处理合并只有一条子菜单的列表数据
 * @param list
 */
function handleMerge(list: Array<LayoutMenuItem>) {
  list = JSON.parse(JSON.stringify(list));
  const result: Array<LayoutMenuItem> = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const child = item.children;
    if (child && child.length > 0) {
      if (child.length === 1) {
        child[0].key = item.key;
        result.push(child[0]);
        if (child[0].children && child[0].children.length > 0 && !props.onlyMergeFirst) {
          child[0].children = handleMerge(child[0].children);
        }
      } else {
        result.push(item);
        if (!props.onlyMergeFirst) {
          item.children = handleMerge(child);
        }
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

let list = formatMenuList(filterHidden(store.layout.completeRouters));

if (props.mergeOnlyOneChild) {
  list = handleMerge(list);
  // console.log("处理合并只有一条子菜单的列表数据 >>", list);
}

/**
 * 菜单数据列表
 */
const menuList = ref(list);

/**
 * 激活的索引列表
 */
let activeList: Array<number> = [];

/**
 * 更新菜单列表激活状态
 * @param list
 */
function updateActive(list: Array<LayoutMenuItem>) {
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    // 这里要先重置一下
    item.hasActive = false;
    // 设置 mergeOnlyOneChild 时的判断，并初始化值
    if (item.isOpen && (!item.children || (item.children && item.children.length === 0))) {
      item.isOpen = false;
    }
    item.isActive = item.path === route.path;
    if (item.isActive) {
      activeList = item.key.split("-").map(val => Number(val));
    }
    if (item.children && item.children.length > 0) {
      updateActive(item.children);
    }
  }
}

/**
 * 设置激活`item`状态
 * @param list
 * @param setp 层级
 */
function setItem(list: Array<LayoutMenuItem>, setp = 0) {
  const index = activeList[setp];
  const item = list[index];
  item.hasActive = item.isOpen = true;
  if (setp < activeList.length - 1) {
    setItem(item.children!, setp + 1);
  }
}

function update() {
  activeList = [];
  updateActive(menuList.value);
  if (activeList.length > 0) {
    setItem(menuList.value);
  }
  // console.log("menuList >>", menuList.value);
}

watch(() => route.path, function () {
  update();
})

onMounted(function () {
  update();
  function getElementHeight(name: string, defaultHeight = 0) {
    const el = document.querySelector(name) as HTMLElement;
    if (el) {
      return el.clientHeight;
    } else {
      console.log("%c 找不到节点 >>", "color: #ff4949", name, "已使用默认值 >>", defaultHeight);
      return defaultHeight;
    }
  }
  store.layout.menuSizeInfo.titleHeight = getElementHeight(".the-layout-menu .the-layout-menu-title", 50);
  store.layout.menuSizeInfo.itemHeight = getElementHeight(".the-layout-menu .the-layout-menu-item", 44);
})
</script>
