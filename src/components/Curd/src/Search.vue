<template>
  <FilterWrap
    class="the-curd-search"
    :label-right="props.data.labelRight"
    :label-width="convertPx(props.data.labelWidth) || 'auto'"
  >
    <template #content>
      <transition-group name="the-group" tag="div" class="the-filter-content f1">
        <FilterItem
          v-for="(item, itemIndex) in props.data.list"
          :key="item.id"
          :data-key="item.id"
          :class="[{ 'the-curd-selected': isEdit(itemIndex) }, item.id]"
          :label="item.label"
          :label-width="convertPx(item.labelWidth)"
          :required="item.required"
          :draggable="isEditMode"
          @dragstart="onDragStart(itemIndex)"
          @dragover="onDragMove($event, itemIndex)"
          @drop="onDropEnd()"
        >
          <template v-if="provideState.editor.type === 'search'" #label>
            <i v-if="isEditMode" class="el-icon-rank el-icon--left" />
            {{ item.label }}
          </template>
          <Field :field-data="item" :disabled="provideState.loading"/>
          <div v-if="isEditMode" class="the-curd-edit-mask f-vertical f-right">
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
        <FilterItem v-if="isEditMode">
          <el-text v-if="!props.data.list.length" type="info" style="margin-right: 12px;">
            请添加筛选条件~
          </el-text>
          <el-button type="primary" circle @click="onAddItem()">
            <i class="el-icon-plus"></i>
          </el-button>
        </FilterItem>
      </transition-group>
    </template>
    <template v-if="!provideState.editor.type" #right>
      <FilterBtn :loading="provideState.loading" @search="e => emit('search', e)" />
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
import { computed, type PropType } from "vue";
import { FilterWrap, FilterItem, FilterBtn, type FilterBtnType } from "@/components/FilterBox";
import Field from "./Field.vue";
import { convertPx, useProvideState } from "./data";
import { messageBox } from "@/utils/message";
import { useListDrag } from "@/hooks/common";
import type { CurdType } from "./types";

const props = defineProps({
  data: {
    type: Object as PropType<CurdType.Search>,
    required: true
  }
});

const emit = defineEmits<{
  (event: "search", type: FilterBtnType): void;
}>();

const provideState = useProvideState();

/** 是否编辑模式 */
const isEditMode = computed(() => provideState.editor.type === "search" && !provideState.editor.show);

function onDeleteItem(index: number) {
  const name = props.data.list[index].label || props.data.list[index].key;
  messageBox({
    title: "操作提示",
    content: `是否删除【${name}】？`,
    cancelText: "取消",
    confirm() {
      props.data.list.splice(index, 1);
    }
  });
}

function onEditItem(index: number) {
  provideState.editor.index = index;
  provideState.editor.action = "edit";
  provideState.editor.show = true;
}

function isEdit(index: number) {
  return provideState.editor.index === index && provideState.editor.type === "search" && provideState.editor.show;
}

function onAddItem() {
  provideState.editor.index = -1;
  provideState.editor.action = "add";
  provideState.editor.show = true;
}

const { onDragStart, onDragMove, onDropEnd } = useListDrag({
  list: () => props.data.list,
  update(newList) {
    props.data.list = newList;
  },
  findLevel: 5
});

</script>
