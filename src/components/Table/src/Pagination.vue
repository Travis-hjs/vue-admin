<script lang="ts">
/** 通用分页组件 */
export default {
  name: "Pagination"
}
</script>
<script lang="ts" setup>
import { getPageInfo } from "@/hooks/common";
import { type PropType } from "vue";
import type { TableType } from "./types";

const props = defineProps({
  pageInfo: {
    type: Object as PropType<PageInfo>,
    default: () => getPageInfo(),
  },
  pageSizes: {
    type: Array as PropType<Array<number>>,
    default: () => [10, 30, 100, 200, 300],
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  position: {
    type: String as PropType<"left" | "right" | "center">,
    default: "right",
  },
  disabled: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits<{
  (event: "change", res: TableType.Page): void
}>();

function onSizeChange(n: number) {
  const before = JSON.parse(JSON.stringify(props.pageInfo));
  props.pageInfo.currentPage = 1;
  props.pageInfo.pageSize = n;
  emit("change", { type: "pageSize", value: n, before });
}

function onCurrentChange(n: number) {
  const before = JSON.parse(JSON.stringify(props.pageInfo));
  props.pageInfo.currentPage = n;
  emit("change", { type: "currentPage", value: n, before });
}
</script>
<template>
  <div class="the-pagination f-vertical">
    <div :class="[{ 'f1': ['center', 'right'].includes(props.position) }]">
      <slot name="left"></slot>
    </div>
    <el-pagination
      v-if="props.pageInfo.total"
      background
      :disabled="props.disabled"
      :layout="props.layout"
      :total="props.pageInfo.total"
      :current-page="props.pageInfo.currentPage"
      :page-sizes="props.pageSizes"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
    <div :class="[{ 'f1': ['center', 'left'].includes(props.position) }]">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<style lang="scss">
.the-pagination {
  width: 100%;
}
</style>
