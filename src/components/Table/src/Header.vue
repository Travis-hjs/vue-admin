<script lang="ts">
/** 表格自定义表头组件 */
export default {
  name: "TableHeader"
};
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { TableType } from "./types";
import { TableTitle } from "./part";

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
  (event: "sort", prop: string, action: TableType.Column["sort"]): void;
}>();

const isText = computed(() => !props.column.sort && !props.column.titleTips);

function onSwitch(action: TableType.Column["sort"]) {
  if (props.disabled) return;
  const col = props.column;
  if (props.column.sort === action) {
    action = true;
  }
  // col.sort = action;
  emit("sort", col.prop as string, action);
}
</script>
<template>
  <template v-if="isText">
    <TableTitle :text="props.column.title" />
  </template>
  <div v-else class="f-vertical w-full">
    <el-tooltip
      v-if="props.column.titleTips"
      effect="dark"
      :content="props.column.titleTips"
      placement="top"
    >
      <div class="f1 cursor-help leading-none text-[#448000]">
        <TableTitle :text="props.column.title" />
      </div>
    </el-tooltip>
    <div v-else class="f1 leading-none">
      <TableTitle :text="props.column.title" />
    </div>
    <div v-if="props.column.sort" class="pl-[6px]">
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