<script lang="ts">
/** 侧边菜单组件 */
export default {
  name: "Menu"
}
</script>
<script lang="ts" setup>
import store from "@/store";
import MenuItem from "./MenuItem.vue";
import { ref, watch } from "vue";
import type { RouteItem } from "@/router/types";
import type { LayoutType } from "@/store/types";
import { getMenuId, useLayoutRoute } from "./hooks";
import { Empty } from "@/components/Empty";

const props = defineProps({
  /**
   * 是否合并只有一个子项的菜单
   * - 传`1`则合并到第一层，传`2`则合并到第二层，以此类推
   * - 不传则不做合并操作
   */
  mergeOnlyOneChild: {
    type: Number,
    default: 0,
  }
});

const layoutInfo = store.layout.info;

/**
 * 组装菜单数据
 * @param list 
 */
function formatMenuList(list: Array<RouteItem>) {
  const menus: Array<LayoutType.Menu> = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    // 过滤掉隐藏的菜单
    if (item.meta && item.meta.hidden) {
      continue;
    }
    // 组装数据结构
    const menu: LayoutType.Menu = {
      menuId: getMenuId(),
      path: item.path,
      isOpen: false,
      title: item.meta.title,
      icon: item.meta.icon,
      link: item.meta.link,
    }
    // 递归下级列表
    if (item.children && item.children.length) {
      menu.children = formatMenuList(item.children);
    }
    menus.push(menu);
  }
  return menus;
}

/**
 * 处理合并只有一条子菜单的列表数据
 * @param list
 * @param level 合并的最大层数
 */
function handleMerge(list: Array<LayoutType.Menu>, level = 1) {
  const result: Array<LayoutType.Menu> = [];
  const keep = level < props.mergeOnlyOneChild;
  const next = level + 1;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const sub = item.children;
    if (sub && sub.length > 0) {
      if (sub.length === 1) {
        result.push(sub[0]);
        if (sub[0].children && sub[0].children.length > 0 && keep) {
          sub[0].children = handleMerge(sub[0].children, next);
        }
      } else {
        result.push(item);
        if (keep) {
          item.children = handleMerge(sub, next);
        }
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

/**
 * 处理是否有关键字搜索的列表
 * @param menus 
 */
function hasKeyword(menus: Array<LayoutType.Menu>) {
  const value = layoutInfo.keyword;
  return menus.filter((menu) => {
    if (menu.children) {
      menu.children = hasKeyword(menu.children);
      if (menu.children.length > 0) {
        menu.isOpen = true;
        return true;
      }
    }
    if (menu.title.includes(value)) {
      return true;
    }
    return false;
  });
}

let formatList = formatMenuList(store.layout.completeRouters);

if (props.mergeOnlyOneChild) {
  formatList = handleMerge(formatList);
}

const menuList = ref(formatList);

const { route, isActive } = useLayoutRoute();

/**
 * 通过传入`menuId`找到整个父级列表
 * @param ls
 * @param menuId
 */
function findParentList(ls: Array<LayoutType.Menu>) {
  const parents: Array<LayoutType.Menu> = [];

  function each(menus: Array<LayoutType.Menu>, parentList: Array<LayoutType.Menu>) {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];

      if (isActive(menu)) {
        parents.push(...parentList);
        return true;
      }

      if (menu.children && menu.children.length) {
        const found = each(menu.children, [...parentList, menu]);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  each(ls, []);

  return parents;
}

/** 更新激活的菜单操作 */
function updateActive() {
  const activeMenus = findParentList(menuList.value);
  activeMenus.forEach(item => {
    item.isOpen = true;
  });
}

watch(
  () => layoutInfo.keyword,
  function (val) {
    const list = JSON.parse(JSON.stringify(formatList));
    if (val) {
      const filterList = hasKeyword(list);
      menuList.value = filterList;
    } else {
      menuList.value = list;
      updateActive();
    }
  },
);

watch(
  () => route.path,
  function () {
    updateActive();
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <MenuItem
    v-for="(menu, menuIndex) in menuList"
    :menu="menu"
    :key="menu.menuId"
    :style="menuIndex ? undefined : { 'margin-top': '0' }"
  />
  <Empty v-if="!menuList.length" style="height: 140px;" text="没有匹配到任何菜单" />
</template>
