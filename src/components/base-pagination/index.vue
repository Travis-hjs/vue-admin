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
import { defineComponent } from "vue";
/** 分页组件 */
export default defineComponent({
  name: "base-pagination"
})
</script>
<script lang="ts" setup>
import { usePageInfo } from "@/hooks";
import { PropType } from "vue";

const props = defineProps({
  pageInfo: {
    type: Object,
    default: () => usePageInfo(),
  },
  pageSizes: {
    type: Array,
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
  props.pageInfo.currentPage = 1;
  props.pageInfo.pageSize = n;
  emit("change", { type: "pageSize", value: n });
}

function onCurrentChange(n: number) {
  props.pageInfo.currentPage = n;
  emit("change", { type: "currentPage", value: n });
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
