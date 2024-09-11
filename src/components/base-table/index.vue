<template>
  <div class="base-table" v-loading="loading">
    <el-table
      ref="the-table"
      stripe
      border
      :max-height="props.maxHeight"
      :data="props.data"
      @row-click="rowClick"
      @selection-change="onSelect"
    >
      <el-table-column v-if="props.selectKey" width="55" align="center" fixed="left">
        <template #header>
          <el-checkbox
            :indeterminate="isIndeterminate"
            :model-value="selectedAll"
            @change="onSelectAll"
          />
        </template>
        <template #default="{ row, $index }: SlotType">
          <el-checkbox
            :model-value="selected(row)"
            :disabled="!canSelect(row, $index)"
            @change="onSelect(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in props.columns"
        :key="item.key || item.prop"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth"
        :width="item.width"
        :show-overflow-tooltip="item.tooltip === undefined ? true : item.tooltip"
        :fixed="item.prop === 'action-right' ? 'right' : item.fixed"
        :align="item.prop === 'action-right' ? 'center' : item.align"
        :class-name="(isRowClick && item.prop !== 'action-right') ? 'base-column-click' : ''"
        label-class-name="base-table-label"
      >
        <template #header>
          <slot v-if="item.slotName" :name="`header-${item.slotName}`"></slot>
        </template>
        <template #default="{row, $index}: SlotType">
          <slot :name="item.slotName" v-bind="{row, $index}" v-if="item.slotName"></slot>
          <base-table-actions
            v-else-if="item.prop === 'action-right'"
            :row="row"
            :index="$index"
            :actions="props.actions as any"
            :clickStop="props.isRowClick"
          />
          <template v-else>{{ setTableDefaultContent(row, item.prop, item) }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
/** 全局表格组件 */
export default {
  name: "base-table"
}
</script>

<script lang="ts" generic="T extends BaseObj" setup>
import { type PropType, ref, onBeforeUpdate, computed } from "vue";
import { ElTable } from "element-plus";
import { filterRepeat, isType } from "@/utils";

interface SlotType {
  row: T
  $index: number
}

const props = defineProps({
  data: {
    type: Array as PropType<Array<T>>,
    default: () => []
  },
  columns: {
    type: Array as PropType<Array<BaseTableColumn>>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  /** 表格行是否需要点击，其实就是加一个鼠标手点击的样式，和内部`<base-table-actions />`组件的阻止事件冒泡作用 */
  isRowClick: {
    type: Boolean,
    default: false
  },
  /** `<base-table-actions :list="list">`组件的 list 数据 */
  actions: {
    type: Array as PropType<Array<BaseTableOptionItem<T>>>,
    default: () => []
  },
  maxHeight: {
    type: Number,
    default: 500
  },
  /**
   * 选择操作的判断字段
   * - 设置该值才会开启选择功能
   */
   selectKey: {
    type: String as PropType<keyof T>,
    default: undefined,
  },
  /**
   * 绑定的选择列表
   * - 即`checkbox`操作列表，和`selectKey`需要配合一起使用
   */
  selectList: {
    type: Array as PropType<Array<T>>,
    default: undefined,
  },
  /** 选择框禁用的条件函数 */
  selectDisabled: {
    type: Function as PropType<(row: T, rowIndex: number) => boolean>,
    default: undefined,
  },
});

const emit = defineEmits<{
  (event: 'update:selectList', list: Array<T>): void
  (event: "row", row: T, col: any, e: Event): void
}>();

const theTable = ref<InstanceType<typeof ElTable>>();

onBeforeUpdate(function() {
  theTable.value?.doLayout();
});

function rowClick(row: any, col: any, e: Event) {
  emit("row", row, col, e);
}

function isEmpty(val: any) {
  return ["", null, undefined, "null", "undefined"].includes(val);
}

/** 
 * 设置默认的表格内容 
 * @param row 行信息
 * @param prop 当前行的 key
 * @param item 列信息
 * */
function setTableDefaultContent(row: any, prop: string, item: BaseTableColumn) {
  if (isType(item.formatter, "function")) {
    return item.formatter(row, row[prop], item);
  }
  return isEmpty(row[item.prop]) ? "-" : row[item.prop];
}

/**
 * 是否能选中
 * @param row
 */
function canSelect(row: T, index: number) {
  if (isType(props.selectDisabled, "function")) {
    return !props.selectDisabled(row, index);
  } else {
    return true;
  }
}

/** 总选中值的列表 */
const selectKeys = computed(() => {
  const list = props.selectList;
  const key = props.selectKey;
  if (list && key) {
    return list.map(item => (item as any)[key]);
  }
  return [];
})

/**
 * 是否选中
 * @param row
 */
function selected(row: T) {
  const key = props.selectKey!;
  return selectKeys.value.includes((row as any)[key]);
}

/**
 * 能够符合条件的选择列表
 * - 当前页的表单数据
 */
const canSelectList = computed(() => props.data.filter((item, index) => canSelect(item, index)));
/** 是否选中全部（当前表格页） */
const selectedAll = computed(() => canSelectList.value.every(item => selected(item)));
/** 是否有选中（当前表格页） */
const isIndeterminate = computed(() => selectedAll.value ? false : canSelectList.value.some(item => selected(item)));

function onSelectAll() {
  const key = props.selectKey!;
  const keys = canSelectList.value.map((item: any) => item[key]);
  let list: Array<any> = JSON.parse(JSON.stringify(props.selectList));
  if (selectedAll.value) {
    list = list.filter(item => !keys.includes(item[key]));
  } else {
    list = filterRepeat(list.concat(canSelectList.value), (a, b) => a[key] === b[key]);
  }
  emit("update:selectList", list);
}

function onSelect(item: any) {
  const key = props.selectKey!;
  const keys = selectKeys.value;
  let list: Array<any> = JSON.parse(JSON.stringify(props.selectList));
  if (keys.includes(item[key])) {
    list = list.filter(selected => selected[key] !== item[key]);
  } else {
    list.push(item);
  }
  emit("update:selectList", list);
}

</script>
<style lang="scss">
.base-table {
  width: 100%;
  min-height: 500px;
  margin-bottom: 28px;
  .el-table {
    width: 100%;
  }
  .el-table__header {
    .el-table__cell {
      height: 50px;
      background-color: #f6f7fb !important;
      .cell {
        color: #18181A;
      }
    }
  }
  // .el-table__fixed-right {
  //   height: 100% !important;
  // }
  .base-column-click {
    cursor: pointer;
  }
  .base-table-label {
    cursor: default;
  }
}
</style>