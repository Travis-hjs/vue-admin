<script lang="ts">
/** 表格操作栏组件 */
export default {
  name: "OperationBar"
}
</script>
<script lang="ts" setup>
import { watch, type PropType } from "vue";
import type { TableType } from "./types";
import { useListDrag } from "@/hooks/common";
import { deepClone } from "@/utils";
import { columnActionProp } from "./hooks";

const props = defineProps({
  /** 操作列列表数据 */
  operations: {
    type: Array as PropType<Array<TableType.Operation>>,
    default: () => [],
  },
  /**
   * 表格列数据
   * - 不传或传空数组则没有【表格列设置】操作
   * - 注意，传入的列数据需要为响应数据，不然排列表格、配置表格相关操作不生效
   */
  columns: {
    type: Array as PropType<Array<TableType.Column<any>>>,
    default: () => [],
  },
  /** 
   * 是否不监听表格列数据
   * - 不更新：点击【重置】列表时还原数据
   */
  notWatch: {
    type: Boolean,
    default: false,
  },
  /** 是否隐藏表格列设置 */
  hideSetting: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: "update:columns", columns: typeof props.columns): void;
}>();

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => props.columns,
  key: "prop",
});

function getDragProps(col: TableType.Column, index: number) {
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

function getString(btn: TableType.Operation, type: "text" | "icon") {
  const val = btn[type];
  if (typeof val === "string") {
    return val;
  }
  if (typeof val === "function") {
    return val();
  }
  return false;
}

function getBoolean(btn: TableType.Operation, type: "loading" | "disabled" | "show", defaultValue = false) {
  const val = btn[type];
  if (typeof val === "boolean") {
    return val;
  }
  if (typeof val === "function") {
    return val();
  }
  return defaultValue;
}

let initColumns: typeof props.columns = [];

function onReset() {
  emit("update:columns", initColumns);
}

if (!props.notWatch) {
  watch(
    () => props.columns,
    (list) => {
      if (props.notWatch) return;
      // console.log("更新表格列 >>", list);
      // 初始化表格列可见属性
      list.forEach(column => {
        if (typeof column.visible !== "boolean") {
          column.visible = true;
        }
      });
      initColumns = deepClone(list);
    },
    { immediate: true }
  );
}
</script>
<template>
  <div class="the-table-operation-bar f-vertical">
    <slot name="left"></slot>
    <div class="f1"></div>
    <slot name="right"></slot>
    <template v-for="(btn, index) in props.operations" :key="btn.key || `btn-${index}`">
      <el-button
        v-if="getBoolean(btn, 'show', true)"
        :type="btn.type || 'primary'"
        :loading="getBoolean(btn, 'loading')"
        :disabled="props.disabled || getBoolean(btn, 'disabled')"
        size="small"
        @click="btn.click"
      >
        <i
          v-if="btn.icon && !getBoolean(btn, 'loading')"
          :class="[btn.icon ? `el-icon--left ${btn.icon}` : null]"
        ></i>
        {{ getString(btn, 'text') }}
      </el-button>
    </template>
    <el-popover
      v-if="!hideSetting"
      placement="bottom-start"
      :width="300"
      transition="el-zoom-in-top"
      trigger="click"
      popper-class="the-table-operation-bar-popper"
    >
      <template #reference>
        <el-button type="primary" link :disabled="props.disabled">
          <i class="el-icon--left el-icon-setting"></i>
          表格列设置
        </el-button>
      </template>
      <div class="f-vertical mb-[10px]">
        <div class="f1"></div>
        <el-button type="primary" link @click="onReset()">
          <i class="el-icon--left el-icon-refresh-left"></i>
          重置
        </el-button>
      </div>
      <transition-group name="the-group" tag="div" class="the-setting-list">
        <div
          v-for="(item, itemIndex) in props.columns"
          class="the-setting-item f-vertical"
          v-bind="getDragProps(item, itemIndex)"
        >
          <i v-if="item.prop !== columnActionProp" class="el-icon--left el-icon-rank"></i>
          <span class="f1">{{ item.title }}</span>
          <el-switch
            v-model="item.visible"
            inline-prompt
            active-text="显示"
            inactive-text="隐藏"
          />
        </div>
        <el-empty v-if="!props.columns.length" key="empty" :image-size="120" description="暂无可以设置的表格列" />
      </transition-group>
    </el-popover>
  </div>
</template>
<style lang="scss">
.the-table-operation-bar {
  width: 100%;
  margin-bottom: 10px;
}

.the-table-operation-bar-popper {
  .the-setting-list {
    --gap: 14px;
    width: 100%;
    max-height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
  
    .the-setting-item {
      position: relative;
      height: 38px;
      padding: 0 var(--gap);
      margin-bottom: var(--gap);
      font-size: var(--el-font-size-base);
      line-height: 34px;
      color: var(--el-text-color-regular);
      border: dashed #dcdfe6 1px;
      border-radius: var(--border-radius);
  
      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-light);
      }
  
      &[draggable="true"] {
        cursor: move;
        user-select: none;
      }
    }
  }
}
</style>