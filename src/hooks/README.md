# 公共 hooks 模块目录

## 列表拖拽

基础示例：

> 拖动过程中更改列表顺序

```vue
<script lang="ts" setup>
import { ref } from "vue";
import { useListDrag } from "@/hooks/common";

const ls = Array.from({ length: 12 }).fill(0).map((_, index) => ({ id: index }));

const dragList = ref(ls);

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => dragList.value,
  key: "id",
  defer: true,
});

function getDragProps(key: number, index: number) {
  return {
    key,
    "data-key": key,
    draggable: true,
    onDragstart: () => onDragStart(index),
    onDragover: (e: DragEvent) => onDragMove(e, index),
    onDrop: onDropEnd,
  };
}
</script>

<template>
  <transition-group name="the-group" tag="div" class="demo-drag-list">
    <!-- eslint-disable-next-line vue/require-v-for-key -->
    <div
      v-for="(item, itemIndex) in dragList"
      class="demo-drag-item fvc"
      v-bind="getDragProps(item.id, itemIndex)"
    >
      div: {{ item.id }}
    </div>
  </transition-group>
</template>

<style lang="scss">
.demo-drag-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(64px, 1fr));
  gap: 10px;

  .demo-drag-item {
    border-radius: var(--border-radius);
    border: 1px dashed var(--purple);
    padding: 10px;
    height: 100px;
    cursor: move;
  }
}
</style>
```

组合用法示例：

> 拖拽结束后更改列表顺序，配合响应变量设置节点样式

```vue
<script lang="ts" setup>
import { ref } from "vue";
import { useComposeDrag } from "@/hooks/common";

const ls = Array.from({ length: 12 }).fill(0).map((_, index) => ({ id: index }));

const dragList = ref(ls);

const [getDragProps, drag] = useComposeDrag({
  list: () => dragList.value,
  key: "id",
  defer: true,
});
</script>

<template>
  <transition-group name="the-group" tag="div" class="demo-drag-list">
    <!-- eslint-disable-next-line vue/require-v-for-key -->
    <div
      v-for="(item, itemIndex) in dragList"
      class="demo-drag-item fvc"
      :class="{ 'drag-selected': drag.targetKey === item.id && drag.draggingKey !== undefined }"
      v-bind="getDragProps(item.id, itemIndex)"
    >
      div: {{ item.id }}
    </div>
  </transition-group>
</template>

<style lang="scss">
.demo-drag-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(64px, 1fr));
  gap: 10px;

  .demo-drag-item {
    border-radius: var(--border-radius);
    border: 1px dashed var(--purple);
    padding: 10px;
    height: 100px;
    cursor: move;
  }

  .drag-selected {
    background-color: rgba(128, 0, 128, 0.5);
  }
}
</style>
``
