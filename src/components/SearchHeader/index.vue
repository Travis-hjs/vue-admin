<script lang="ts">
/**
 * 基础通用搜索头部
 * - 将`<TheFields />`与`<FilterBox />`做整合，传参配置完全相同
 */
export default {
  name: "SearchHeader"
};
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { type TheField, TheFields } from "../TheFields";
import { FilterWrap, SearchBtn } from "../FilterBox";

const props = defineProps({
  loading: Boolean,
  /** 与`<FilterWrap />`参数一致 */
  labelWidth: String,
  /** 搜索数据对象 */
  searchInfo: {
    type: Object,
    required: true
  },
  /** 与`<TheFields />`参数一致 */
  list: {
    type: Array as PropType<Array<TheField.Type>>,
    required: true
  }
});

const emit = defineEmits<{
  (event: "search", reset: boolean): void;
}>();

const slotList = computed(() => props.list.filter(item => item.type === "slot").map((item: any) => item.slotName));

function onSearch(reset: boolean) {
  emit("search", reset);
}
</script>
<template>
  <FilterWrap :label-width="props.labelWidth">
    <TheFields type="search" :data="props.searchInfo" :list="props.list">
      <template v-for="slot in slotList" :key="slot" #[slot]="field">
        <slot :name="slot" v-bind="field"></slot>
      </template>
    </TheFields>
    <template #right>
      <SearchBtn :loading="props.loading" @search="onSearch" />
    </template>
  </FilterWrap>
</template>
