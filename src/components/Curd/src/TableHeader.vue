<template>
  <template v-if="isText">{{ props.column.label }}</template>
  <div v-else class="f-vertical w-full">
    <span>{{ props.column.label }}</span>
    <el-tooltip v-if="props.column.iconTips" effect="dark" :content="props.column.iconTips" placement="top">
      <i class="el-icon--right el-icon-question" style="font-size: 16px; color: #666; cursor: pointer;" />
    </el-tooltip>
    <div v-if="props.column.sort" class="f1 f-right">
      <el-button link @click="onSwitch">
        <i :class="['el-icon--right', map[props.column.sort.toString() as keyof typeof map].icon]" />
      </el-button>
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
import { computed, type PropType } from 'vue';
import type { CurdType } from './types';

const props = defineProps({
  column: {
    type: Object as PropType<CurdType.Table.Column>,
    required: true
  }
});

const emit = defineEmits<{
  (event: "sort", key: string, action: CurdType.Table.Column["sort"]): void;
}>();

const isText = computed(() => !props.column.sort && !props.column.iconTips);

const map = {
  true: {
    index: 0,
    icon: "el-icon-sort"
  },
  asc: {
    index: 1,
    icon: "el-icon-sort-up"
  },
  desc: {
    index: 2,
    icon: "el-icon-sort-down"
  }
};

const actions = [true, "asc", "desc"] as const;

function onSwitch() {
  const key = props.column.sort.toString() as keyof typeof map;
  let index = map[key].index;
  index++;
  if (index >= actions.length) {
    index = 0;
  }
  const action = actions[index];
  emit("sort", props.column.prop, action);
}
</script>
