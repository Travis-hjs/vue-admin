<script lang="ts">
/** 表格操作栏相关 */
export default {
  name: "TableOperation"
}
</script>
<script lang="ts" setup>
import { type PropType, computed } from "vue";
import { type CurdType, CurdEnum } from "./types";
import { TableOperationBar } from "@/components/Table";
import { isType } from "@/utils";

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

type ActionValue = CurdType.Table.Batch["click"] | CurdType.Table.From;

const emit = defineEmits<{
  (event: "action", action: CurdEnum, value?: ActionValue): void;
}>();

function onAction(val: CurdEnum, code?: ActionValue) {
  emit("action", val, code);
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
    batch: !!state.selectKey,
    operation: props.config.operations ? props.config.operations.length > 0 : false,
  }
});

const btnActions = computed(() => {
  const hasBatch = has.value.batch;
  const hasAdd = has.value.add;
  const hasEdit = has.value.edit;
  const hasOperation = has.value.operation;
  return [
    {
      type: CurdEnum.Add,
      text: hasAdd ? "修改新增表单" : "配置新增表单",
      icon: hasAdd ? icon.on : icon.off,
      style: hasAdd ? "primary" : "info"
    },
    {
      type: CurdEnum.Edit,
      text: hasEdit ? "修改编辑表单" : "配置编辑表单",
      icon: hasEdit ? icon.on : icon.off,
      style: hasEdit ? "primary" : "info"
    },
    {
      type: CurdEnum.Batch,
      text: `${hasBatch ? "修改" : "配置"}批量按钮操作`,
      icon: hasBatch ? icon.on : icon.off,
      style: hasBatch ? "primary" : "info"
    },
    {
      type: CurdEnum.Operation,
      text: `${hasOperation ? "修改" : "配置"}自定义按钮操作`,
      icon: hasOperation ? icon.on : icon.off,
      style: hasOperation ? "primary" : "info"
    }
  ] as const;
});

const operations = computed(() => {
  const list = props.config.operations || [];
  return list.filter(item => {
    if (!item.show) return true;
    if (isType(item.show, "function")) {
      return item.show();
    }
    try {
      const fn = new Function(item.show);
      return fn();
    } catch (error) {
      console.warn("解析 operation.show 代码错误 >>", error);
      return false;
    }
  });
});

/** 表单按钮条件显示 */
const formBtnShow = computed(() => {
  const state = props.config;
  function getShow(code?: string) {
    if (code) {
      try {
        const fn = new Function("row", code);
        return fn({});
      } catch (error) {
        console.warn("解析【表单按钮展示】代码错误 >>", error);
        return true;
      }
    }
    return true;
  }
  return {
    add: getShow(state.formAdd?.showCode),
    // edit: getShow(state.formEdit?.showCode),
  };
});

function onBatch(btn: CurdType.Table.Batch) {
  if (btn.formConfig) {
    onAction(CurdEnum.Batch, btn.formConfig);
  } else {
    onAction(CurdEnum.Batch, btn.click);
  }
}

function onOperation(btn: CurdType.Table.Operation) {
  if (isType(btn.formConfig, "object")) {
    onAction(CurdEnum.OpenForm, btn.formConfig);
  }
  if (!btn.click) return;
  if (isType(btn.click, "string")) {
    try {
      const fn = new Function(btn.click);
      fn();
    } catch (error) {
      console.warn("解析 operation.click 代码错误 >>", error);
    }
  } else {
    btn.click();
  }
}
</script>
<template>
  <TableOperationBar
    v-model:columns="props.config.columns"
    :not-watch="props.editMode"
    :disabled="props.disabled"
    :hide-setting="props.editMode"
  >
    <template v-if="props.editMode" #left>
      <el-button
        v-for="btn in btnActions"
        :key="btn.type"
        :type="btn.style"
        link
        @click="onAction(btn.type)"
      >
        <i :class="['el-icon--left', btn.icon]"></i>
        {{ btn.text }}
      </el-button>
    </template>
    <template v-else #right>
      <template v-if="has.batch && props.config.batchs">
        <el-button
          v-for="batch in props.config.batchs"
          :key="batch.key"
          :type="batch.type"
          :disabled="props.disabled"
          :link="!batch.solid"
          :size="batch.solid ? 'small' : undefined"
          @click="onBatch(batch)"
        >
          <i v-if="batch.icon" :class="['el-icon--left', batch.icon]" />
          {{ batch.text }}
        </el-button>
      </template>
      <el-button
        v-for="item in operations"
        :key="item.key"
        :type="item.type"
        :link="!item.solid"
        :size="item.solid ? 'small' : undefined"
        :disabled="props.disabled"
        @click="onOperation(item)"
      >
        <i v-if="item.icon" :class="['el-icon--left', item.icon]" />
        {{ item.text }}
      </el-button>
      <el-button
        v-if="has.add && formBtnShow.add"
        type="primary"
        link
        :disabled="props.disabled"
        @click="onAction(CurdEnum.Add)"
      >
        <i class="el-icon--left el-icon-plus" />
        新增
      </el-button>
    </template>
  </TableOperationBar>
</template>
