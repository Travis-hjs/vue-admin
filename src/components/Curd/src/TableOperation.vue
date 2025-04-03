<script lang="ts">
/** 表格操作按钮相关 */
export default {
  name: "TableOperation"
}
</script>
<script lang="ts" setup>
import { type PropType, computed, reactive } from "vue";
import type { CurdType, TableOperationType } from "./types";
import { columnActionProp } from "./data";
import { useListDrag } from "@/hooks/common";
import { watch } from "vue";
import { deepClone } from "@/utils";

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
    add: state.formAdd && state.formAdd.fields.length > 0,
    edit: state.formEdit && state.formEdit.fields.length > 0,
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

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => props.config.columns,
  key: "prop",
});

function getDragProps(col: CurdType.Table.Column, index: number) {
  const isAction = col.prop === columnActionProp;
  const key = col.prop;
  return {
    "data-key": key,
    key: key,
    draggable: !isAction ? true : undefined,
    title: isAction ? "操作栏不可排序，只能显示隐藏操作" : undefined,
    onDragstart: !isAction ? () => onDragStart(index) : undefined,
    onDragover: !isAction ? (e: DragEvent) => onDragMove(e, index) : undefined,
    onDrop: !isAction ? onDropEnd : undefined,
  };
}

const setting = reactive({
  showFixed: false,
});

let initColumns: Array<CurdType.Table.Column> = [];

function onReset() {
  props.config.columns = initColumns;
}

watch(
  () => props.config.columns,
  function(list) {
    if (props.editMode) return;
    // console.log("执行 >>", list);
    initColumns = deepClone(list);
  },
  { immediate: true }
);
</script>
<template>
  <div class="w-full f-vertical mb-[10px]">
    <template v-if="props.editMode">
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
    <slot name="left"></slot>
    <template v-if="!props.editMode">
      <div class="f1"></div>
      <slot name="right"></slot>
      <el-button v-if="has.delete" type="danger" link :disabled="props.disabled" @click="onAction('delete')">
        <i class="el-icon--left el-icon-delete"></i>
        删除
      </el-button>
      <el-button v-if="has.add" type="primary" link :disabled="props.disabled" @click="onAction('add')">
        <i class="el-icon--left el-icon-plus"></i>
        新增
      </el-button>
      <el-button type="primary" link :disabled="props.disabled" @click="onAction('export')">
        <i class="el-icon--left el-icon-download"></i>
        导出
      </el-button>
      <el-popover placement="bottom-start" :width="setting.showFixed ? 500 : 300" transition="el-zoom-in-top" trigger="click">
        <template #reference>
          <el-button type="primary" link :disabled="props.disabled">
            <i class="el-icon--left el-icon-setting"></i>
            表格列设置
          </el-button>
        </template>
        <div class="f-vertical f-between mb-[10px]">
          <el-checkbox v-model="setting.showFixed" label="配置固定列" />
          <el-button type="primary" link @click="onReset()">
            <i class="el-icon--left el-icon-refresh-left"></i>
            重置
          </el-button>
        </div>
        <transition-group name="the-group" tag="div" class="the-curd-setting-list the-curd-scrollbar">
          <div
            v-for="(item, itemIndex) in props.config.columns"
            class="the-curd-option-item f-vertical"
            v-bind="getDragProps(item, itemIndex)"
          >
            <i v-if="item.prop !== columnActionProp" class="el-icon--left el-icon-rank"></i>
            <span class="f1">{{ item.title }}</span>
            <el-radio-group v-if="setting.showFixed" v-model="item.fixed" size="small" class="mr-[10px]">
              <el-radio-button
                v-for="opt in fixedOptions"
                :key="opt.value.toString()"
                :value="opt.value"
              >
                {{ opt.label }}
              </el-radio-button>
            </el-radio-group>
            <el-switch
              v-model="item.visible"
              inline-prompt
              active-text="显示"
              inactive-text="隐藏"
            />
          </div>
          <el-empty v-if="!props.config.columns.length" key="empty" :image-size="120" description="暂无可以设置的表格列" />
        </transition-group>
      </el-popover>
    </template>
  </div>
</template>
