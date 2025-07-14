<script lang="ts">
/** 表格排序组件 */
export default {
  name: "SortBar"
}
</script>
<script lang="ts" setup>
import type { PropType } from "vue";
import type { TableType } from "./types";

const props = defineProps({
  /** 表格列配置数据 */
  column: {
    type: Object as PropType<TableType.Column<any>>,
    required: true,
  },
  /** 是否禁用状态 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
});

const emit = defineEmits<{
  (event: "sort", prop: string, type: TableType.Column["sort"]): void;
}>();

function onSwitch(type: TableType.Column["sort"]) {
  if (props.disabled) return;
  const col = props.column;
  if (col.sort === type) {
    type = true;
  }
  col.sort = type;
  emit("sort", col.prop as string, type);
}
</script>
<template>
  <div class="f-vertical f-between">
    <span>{{ props.column.title }}</span>
    <div class="pl-[6px]">
      <div
        class="the-sort-icon top"
        :class="[
          { 'is-select': props.column.sort === 'asc' },
          { 'is-disabled': props.disabled },
        ]"
        @click="onSwitch('asc')"
      ></div>
      <div
        class="the-sort-icon bottom"
        :class="[
          { 'is-select': props.column.sort === 'desc' },
          { 'is-disabled': props.disabled },
        ]"
        @click="onSwitch('desc')"
      ></div>
    </div>
  </div>
</template>
<style lang="scss">
.the-sort-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  cursor: pointer;

  &::after {
    display: block;
    width: 0;
    height: 0;
    content: '';
    border: solid 5px transparent;
  }

  &.top::after {
    border-bottom-color: #c0c4cc;
  }

  &.bottom::after {
    border-top-color: #c0c4cc;
  }

  &.is-select.top::after {
    border-bottom-color: var(--blue);
  }

  &.is-select.bottom::after {
    border-top-color: var(--blue);
  }

  &.is-disabled {
    cursor: not-allowed;
  }
}
</style>
