<template>
  <div :class="['base-pagination', position]">
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
    ></el-pagination>
  </div>
</template>
<script lang="ts">
/** 通用分页组件 */
export default {
  name: "base-pagination"
}
</script>
<script lang="ts" setup>
import { getPageInfo } from "@/hooks/common";
import { type PropType } from "vue";

const props = defineProps({
  pageInfo: {
    type: Object,
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
  (event: "change", res: PaginationChange): void
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
<style lang="scss">
.base-pagination {
  width: 100%;
  display: flex;

  &.right {
    justify-content: flex-end;
  }

  &.center {
    justify-content: center;
  }
}
</style>
