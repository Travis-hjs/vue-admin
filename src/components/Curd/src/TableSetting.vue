<template>
  <base-dialog
    v-model="state.show"
    title="表格设置"
    width="840px"
    @close="onClose"
  >
    <transition-group name="the-group" tag="div">
      <div
        v-for="(item, itemIndex) in state.list"
        class="the-curd-option-item f-vertical"
        :key="item.prop"
        :data-key="item.prop"
        :draggable="true"
        @dragstart="onDragStart(itemIndex)"
        @dragover="e => onDragMove(e, itemIndex)"
        @drop="onDropEnd"
      >
        <i class="el-icon--left el-icon-rank"></i>
        <span class="f1">{{ item.label }}</span>
        <el-radio-group v-model="item.fixed" size="small" class="mgr-10">
          <el-radio-button
            v-for="item in fixedOptions"
            :key="item.value.toString()"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <el-switch
          v-model="item.visible"
          inline-prompt
          active-text="显示"
          inactive-text="隐藏"
        />
      </div>
      <el-empty v-if="!state.list.length" key="empty" :image-size="120" description="暂无可以设置的表格列" />
    </transition-group>
    <template #footer>
      <FooterBtn @close="onClose" @submit="onSubmit" />
    </template>
  </base-dialog>
</template>
<script lang="ts">
/** 表格展示相关设置弹框 */
export default {
  name: "TableSetting"
}
</script>
<script lang="ts" setup>
import { reactive, type PropType, watch } from "vue";
import { type CurdType } from "./types";
import { useListDrag } from "@/hooks/common";
import { FooterBtn } from "./part";
import { actionProp } from "./data";
import { deepClone } from "@/utils";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array as PropType<Array<CurdType.Table.Column>>,
    required: true
  }
});

const emit = defineEmits<{
  (event: "update:show", show: boolean): void;
  (event: "submit", list: Array<CurdType.Table.Column>): void;
}>();

const fixedOptions = [
  {
    label: "固定左边",
    value: "left"
  },
  {
    label: "默认",
    value: false
  },
  {
    label: "固定右边",
    value: "right"
  }
];

const state = reactive({
  show: false,
  list: [] as typeof props.columns
});

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => state.list,
  key: "prop",
});

/** 操作列 */
let actionColumn: CurdType.Table.Column | undefined;

function onClose() {
  emit("update:show", false);
}

function onSubmit() {
  onClose();
  const list: typeof state.list = deepClone(state.list);
  if (actionColumn) list.push(actionColumn);
  emit("submit", list);
}

watch(
  () => props.show,
  function (show) {
    state.show = show;
    if (!show) return;
    const list: typeof props.columns = deepClone(props.columns);
    const showList: typeof list = [];
    // 这里要将操作栏过滤掉
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.prop === actionProp) {
        actionColumn = item;
      } else {
        showList.push(item);
      }
    }
    state.list = showList;
  },
  { immediate: true }
);
</script>
