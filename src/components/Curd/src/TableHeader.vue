<template>
  <template v-if="isText">{{ props.column.title }}</template>
  <div v-else class="f-vertical w-full">
    <span>{{ props.column.title }}</span>
    <el-tooltip v-if="props.column.iconTips" effect="dark" :content="props.column.iconTips" placement="top">
      <i class="el-icon--right el-icon-question the-tips-icon" />
    </el-tooltip>
    <div v-if="props.column.sort" class="f1 f-right">
      <div>
        <div :class="['the-sort-icon top', { 'is-select': props.column.sort === 'asc' }]" @click="onSwitch('asc')"></div>
        <div :class="['the-sort-icon bottom', { 'is-select': props.column.sort === 'desc' }]" @click="onSwitch('desc')"></div>
      </div>
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
