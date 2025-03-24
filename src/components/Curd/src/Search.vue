<template>
  <FilterWrap
    class="the-curd-search"
    :label-right="props.search.labelRight"
    :label-width="convertPx(props.search.labelWidth) || 'auto'"
  >
    <template #content>
      <transition-group name="the-group" tag="div" class="the-filter-content f1">
        <FilterItem
          v-for="(item, itemIndex) in props.search.list"
          :key="item.id"
          :data-key="item.id"
          :class="[{ 'the-curd-selected': isEdit(itemIndex) }, item.id]"
          :label="item.label"
          :label-width="convertPx(item.labelWidth)"
          :required="item.required"
          :draggable="props.editMode"
          @dragstart="onDragStart(itemIndex)"
          @dragover="onDragMove($event, itemIndex)"
          @drop="onDropEnd()"
        >
          <template v-if="props.editMode" #label>
            <i class="el-icon-rank el-icon--left" />
            <span style="line-height: 1;">{{ item.label }}</span>
          </template>
          <Field :field-data="item" :disabled="props.loading"/>
          <div v-if="props.editMode" class="the-curd-edit-mask f-vertical f-right">
            <el-button link type="danger" @click="onDeleteItem(itemIndex)">
              <i class="el-icon-delete el-icon--left"></i>
              删除
            </el-button>
            <el-button link type="success" @click="onEditItem(itemIndex)">
              <i class="el-icon-edit el-icon--left"></i>
              编辑
            </el-button>
          </div>
        </FilterItem>
        <FilterItem v-if="props.editMode">
          <el-text v-if="!props.search.list.length" type="info" style="margin-right: 12px;">
            请添加筛选条件~
          </el-text>
          <el-button type="primary" circle @click="onAddItem()">
            <i class="el-icon-plus"></i>
          </el-button>
        </FilterItem>
      </transition-group>
    </template>
    <template v-if="!props.editMode" #right>
      <SearchBtn :loading="props.loading" @search="reset => emit('search', reset)" />
    </template>
  </FilterWrap>
</template>
<script lang="ts">
/** 筛选组件 */
export default {
  name: "Search"
}
</script>
<script lang="ts" setup>
import { type PropType } from "vue";
import { FilterWrap, FilterItem, SearchBtn } from "@/components/FilterBox";
import Field from "./Field.vue";
import { convertPx } from "./data";
import { messageBox } from "@/utils/message";
import { useListDrag } from "@/hooks/common";
import type { CurdType } from "./types";
import { curdConfigState } from "./hooks";

const props = defineProps({
  search: {
    type: Object as PropType<CurdType.Search>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  /** 是否编辑模式 */
  editMode: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits<{
  (event: "search", reset: boolean): void;
}>();

function onDeleteItem(index: number) {
  const name = props.search.list[index].label || props.search.list[index].key;
  messageBox({
    title: "操作提示",
    content: `是否删除【${name}】？`,
    cancelText: "取消",
    confirm() {
      props.search.list.splice(index, 1);
    }
  });
}

function onEditItem(index: number) {
  curdConfigState.editor.index = index;
  curdConfigState.editor.action = "edit";
  curdConfigState.editor.show = true;
}

function isEdit(index: number) {
  return curdConfigState.editor.index === index && curdConfigState.editor.show;
}

function onAddItem() {
  curdConfigState.editor.index = -1;
  curdConfigState.editor.action = "add";
  curdConfigState.editor.show = true;
}

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => props.search.list,
  key: "id",
  findLevel: 5
});
</script>
