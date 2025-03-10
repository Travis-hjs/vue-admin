<template>
  <template v-if="isText">{{ props.column.title }}</template>
  <div v-else class="the-curd-table-header f-vertical w-full">
    <el-tooltip v-if="props.column.iconTips" effect="dark" :content="props.column.iconTips" placement="top">
      <span class="the-curd-table-header-title">{{ props.column.title }}</span>
    </el-tooltip>
    <span v-else class="the-curd-table-header-title">{{ props.column.title }}</span>
    <div v-if="props.column.sort" style="padding-left: 6px;">
      <div :class="['the-sort-icon top', { 'is-select': props.column.sort === 'asc' }]" @click="onSwitch('asc')"></div>
      <div :class="['the-sort-icon bottom', { 'is-select': props.column.sort === 'desc' }]" @click="onSwitch('desc')"></div>
    </div>
  </div>
</template>
<script lang="ts">
/** 表格自定义表头组件 */
export default {
  name: "TableHeader"
}
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { CurdType } from "./types";

type SortType = CurdType.Table.Column["sort"];

const props = defineProps({
  column: {
    type: Object as PropType<CurdType.Table.Column>,
    required: true
  }
});

const emit = defineEmits<{
  (event: "sort", key: string, action: SortType): void;
}>();

const isText = computed(() => !props.column.sort && !props.column.iconTips);

function onSwitch(type: SortType) {
  if (props.column.sort === type) {
    type = true;
  }
  emit("sort", props.column.prop, type);
}
</script>
<style lang="scss">
.the-curd-table-header-title {
  flex: 1;
  line-height: 1;

  &.el-tooltip__trigger {
    cursor: help;
  }
}
</style>
