<script lang="ts">
/** 表格操作栏相关 */
export default {
  name: "TableOperation"
}
</script>
<script lang="ts" setup>
import { type PropType, computed } from "vue";
import type { CurdType, TableOperationType } from "./types";
import { TableOperationBar, type TableType } from "@/components/Table";

const props = defineProps({
  /** 配置数据 */
  config: {
    type: Object as PropType<CurdType.Table.Config>,
    required: true,
  },
  /** 是否编辑模式 */
  editMode: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  }
});

const emit = defineEmits<{
  (event: "action", action: TableOperationType): void;
}>();

function onAction(val: TableOperationType) {
  emit("action", val);
}

const icon = {
  on: "el-icon-success",
  off: "el-icon-remove-outline"
}

const has = computed(() => {
  const state = props.config;
  return {
    add: !!state.formAdd && state.formAdd.fields.length > 0,
    edit: !!state.formEdit && state.formEdit.fields.length > 0,
    delete: !!state.selectKey
  }
});

const formActions = computed(() => {
  const hasDelete = has.value.delete;
  const hasAdd = has.value.add;
  const hasEdit = has.value.edit;
  return [
    {
      type: "delete",
      text: hasDelete ? "修改删除" : "配置删除",
      icon: hasDelete ? icon.on : icon.off,
      style: hasDelete ? "primary" : "info"
    },
    {
      type: "add",
      text: hasAdd ? "修改新增表单" : "配置新增表单",
      icon: hasAdd ? icon.on : icon.off,
      style: hasAdd ? "primary" : "info"
    },
    {
      type: "edit",
      text: hasEdit ? "修改编辑表单" : "配置编辑表单",
      icon: hasEdit ? icon.on : icon.off,
      style: hasEdit ? "primary" : "info"
    }
  ] as const;
});

const operations: Array<TableType.Operation> = [
  {
    text: "删除",
    type: "danger",
    icon: "el-icon-delete",
    show: () => !props.editMode && has.value.delete,
    disabled: () => props.disabled,
    click: () => onAction('delete'),
  },
  {
    text: "导出",
    icon: "el-icon-download",
    type: "success",
    show: () => !props.editMode,
    disabled: () => props.disabled,
    click: () => onAction('export'),
  },
  {
    text: "新增",
    icon: "el-icon-plus",
    show: () => !props.editMode && has.value.add,
    disabled: () => props.disabled,
    click: () => onAction('add'),
  },
];
</script>
<template>
  <TableOperationBar
    v-model:columns="props.config.columns"
    :operations="operations"
    :not-watch="props.editMode"
    :disabled="props.disabled"
    :hide-setting="props.editMode"
  >
    <template v-if="props.editMode" #left>
      <el-button
        v-for="btn in formActions"
        :key="btn.type"
        :type="btn.style"
        link
        @click="onAction(btn.type)"
      >
        <i :class="['el-icon--left', btn.icon]"></i>
        {{ btn.text }}
      </el-button>
    </template>
  </TableOperationBar>
</template>
