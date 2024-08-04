<template>
  <div :style="{ 'padding-left': level > 0 ? '15px' : '0px' }">
    <div
      class="base-tree-level"
      v-for="item in options"
      :style="{ 'height': item.height + 'px' }"
      :key="item.key"
      :data-key="item.key"
      :data-level="level"
    >
      <div class="base-tree-item f-vertical" @click="onOpen(item)">
        <i :class="['base-tree-icon el-icon-caret-right', { 'hidden-icon': !item.children.length }, { 'expanded': item.open }]"></i>
        <span
          v-if="checkbox"
          @click.stop="onChecked(item)"
          :class="['el-checkbox el-checkbox__input', { 'is-checked': item.checked, 'is-disabled': item.disabled }]"
        >
          <span class="el-checkbox__inner"></span>
        </span>
        <slot name="treeitem" v-bind="item">{{ item.label }}</slot>
      </div>
      <Level
        v-if="item.children.length"
        :options="item.children"
        :level="level + 1"
        :checkChild="checkChild"
        :checkbox="checkbox"
      >
        <template #treeitem="slotProps: TreeItem">
          <slot name="treeitem" v-bind="slotProps"></slot>
        </template>
      </Level>
    </div>
  </div>
</template>
<script lang="ts">
/** 递归树层级组件 */
export default {
  name: "Level"
};
</script>
<script lang="ts" setup>
import { type PropType, inject } from "vue";
import globalEvent from "@/utils/event";
import Tree, { useLevelProps } from "./index";

/** 父组件注入的对象 */
const parentProvide = inject("treeParent") as InstanceType<typeof Tree>;

const props = defineProps({
  options: {
    type: Array as PropType<Array<TreeItem>>,
    default: () => []
  },
  level: {
    type: Number,
    default: 0
  },
  ...useLevelProps()
});

function onChecked(item: TreeItem) {
  item.checked = !item.checked;
  /**
   * 递归处理
   * @param list
   * @param value
   */
  function each(list: Array<TreeItem>, value: boolean) {
    list.forEach(function (e) {
      if (!e.disabled) {
        e.checked = value;
      }
      e.children.length && each(e.children, value);
    })
  }
  if (props.checkChild) {
    each(item.children, item.checked);
  } 
  // else {
  //   !item.checked && each(item.children, false);
  // }
  globalEvent.dispatch(parentProvide.eventMap.itemChange, item);
}

function onOpen(item: TreeItem) {
  item.open = !item.open;
  globalEvent.dispatch(parentProvide.eventMap.itemClick, item);
}

</script>