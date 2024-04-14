# 模板备份文件

模板写法`Volar`和`vue-tsc`会报错：`<template #treeitem="slotProps">`定义不了类型。

```html
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
      <div class="base-tree-item fvertical" @click="onOpen(item)">
        <i :class="['base-tree-icon el-icon-caret-right', { 'hidden-icon': !item.children.length }, { 'expanded': item.open }]"></i>
        <span @click.stop v-if="checkbox">
          <el-checkbox :value="item.checked" @change="onChecked(item)" :disabled="item.disabled"></el-checkbox>
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
        <template #treeitem="slotProps">
          <slot name="treeitem" v-bind="slotProps"></slot>
        </template>
      </Level>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import globalEvent from "@/utils/event";

/** 递归树层级组件 */
export default defineComponent({
  name: "Level"
});
</script>
<script lang="ts" setup>
import { type PropType, inject } from "vue";
import Tree from "./index.vue";

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
  /** 选择父节点时，是否也选中所有其子节点 */
  checkChild: {
    type: Boolean,
    default: false
  },
  /** 是否需要选择功能 */
  checkbox: {
    type: Boolean,
    default: false
  },
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
      e.checked = value;
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
```