<template>
  <div class="the-layout-menu" ref="menuBox">
    <button :class="titleClass" :style="titleStyle" @click="switchOpen()" v-if="hasChidren(info)">
      <svg-icon v-if="info.icon" :name="info.icon" />
      <span class="f1">{{ info.title }}</span>
      <i class="the-layout-menu-arrow"></i>
    </button>
    <template v-else>
      <!-- 外链 -->
      <a :class="titleClass" :style="titleStyle" :href="info.link" target="_blank" v-if="info.link">
        <svg-icon v-if="info.icon" :name="info.icon" />
        <span class="f1">{{ info.title }}</span>
      </a>
      <!-- 单个菜单 -->
      <router-link :class="titleClass" :style="titleStyle" :to="info.path" v-else>
        <svg-icon v-if="info.icon" :name="info.icon" />
        <span class="f1">{{ info.title }}</span>
      </router-link>
    </template>
    <!-- :class="['the-layout-menu-list', { 'the-layout-menu-list-close': !info.isOpen }]" -->
    <div class="the-layout-menu-list" :style="listStyle" v-if="info.children && info.children.length > 0">
      <div v-for="(item) in info.children" :key="item.key">
        <MenuItem v-if="hasChidren(item)" :info="item" :level="level + 1" />
        <template v-else>
          <!-- 外链 -->
          <a :class="getItemClass(item)" :style="itemStyle" :href="item.link" target="_blank" v-if="item.link">
            <svg-icon v-if="item.icon" :name="item.icon" />
            <span>{{ item.title }}</span>
          </a>
          <!-- 单个菜单 -->
          <router-link :class="getItemClass(item)" :style="itemStyle" :to="item.path" v-else>
            <svg-icon v-if="item.icon" :name="item.icon" />
            <span>{{ item.title }}</span>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, PropType, reactive, ref } from "vue";
import { LayoutMenuItem } from "@/types";
import store from "@/store";

// ============= 菜单`item`组件 =============
const props = defineProps({
  level: {
    type: Number,
    default: 1
  },
  info: {
    type: Object as PropType<LayoutMenuItem>,
    default: () => ({
      title: "-"
    })
  }
});

/**
 * 是否有下级菜单
 * @param item
 */
function hasChidren(item: LayoutMenuItem) {
  return item.children && item.children.length > 0 ? true : false;
}

/**
 * 获取列表高度
 * @param item 列表单个对象
 */
function getListHeight(item: LayoutMenuItem) {
  let result = 0;
  const child = item.children;
  const size = store.layout.menuSizeInfo;
  if (item.isOpen && child && child.length > 0) {
    child.forEach(menuItem => {
      const height = hasChidren(menuItem) ? size.titleHeight : size.itemHeight;
      result += height;
      result += getListHeight(menuItem);
    })
  }
  return result;
}

const titleClass = computed(function () {
  const item = props.info;
  return {
    "the-layout-menu-title fvertical": true,
    "the-layout-menu-on": item.isActive,
    "the-layout-menu-hasopen": item.isOpen,
    "the-layout-menu-hasactive": item.hasActive,
    "the-layout-menu-active-title": item.hasActive && props.level === 1
  }
})

function getItemClass(item: LayoutMenuItem) {
  return {
    "the-layout-menu-item fvertical": true,
    "the-layout-menu-on": item.isActive
  }
}

const titleStyle = reactive({
  paddingLeft: ""
})

const itemStyle = reactive({
  paddingLeft: ""
})

/**
 * 菜单列表样式
 */
const listStyle = computed(function () {
  let height = getListHeight(props.info);
  // console.log("height >>", height);
  return {
    height: height + "px"
  }
})

/** 当前整体节点 */
const menuBox = ref<HTMLElement>();

function switchOpen() {
  props.info.isOpen = !props.info.isOpen;
}

onMounted(function () {
  const el = menuBox.value!;

  // 设置左边距
  if (props.level >= 1) {
    const style = getComputedStyle(el.children[0] as HTMLElement);
    const value = parseFloat(style.paddingLeft);
    if (isNaN(value)) return;
    titleStyle.paddingLeft = value * props.level + "px";
    itemStyle.paddingLeft = value * (props.level + 1) + "px";
  }
})
</script>
