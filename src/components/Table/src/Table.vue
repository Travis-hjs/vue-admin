<script lang="ts">
/** 通用表格组件 */
export default {
  name: "Table"
}
</script>
<script lang="ts" generic="T extends BaseObj<any>" setup>
import { type PropType, ref, computed, onUpdated } from "vue";
import { ElTable, type Column } from "element-plus";
import { filterRepeat, isType } from "@/utils";
import { columnActionProp, useAdaptiveTable } from "./hooks";
import ActionCell from "./ActionCell.vue";
import type { TableType } from "./types";
import Pagination from "./Pagination.vue";
import SortBar from "./SortBar.vue";

interface SlotType {
  /** 表格行数据 */
  row: T;
  /** 表格行索引 */
  $index: number;
  /** `<el-table>`内部结构数据 */
  column: Column;
}

const props = defineProps({
  data: {
    type: Array as PropType<Array<T>>,
    default: () => []
  },
  columns: {
    type: Array as PropType<Array<TableType.Column<T>>>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  /** 表格行是否需要点击，其实就是加一个鼠标手点击的样式，和内部`<ActionCell />`组件的阻止事件冒泡作用 */
  isRowClick: {
    type: Boolean,
    default: false
  },
  /** `<ActionCell :list="list">`组件的 list 数据 */
  actions: {
    type: Array as PropType<Array<TableType.Action<T>>>,
    default: () => []
  },
  /** `<ActionCell :max="actionMax">` 组件的 max 属性 */
  actionMax: {
    type: Number,
    default: undefined
  },
  maxHeight: {
    type: Number,
    default: undefined
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
  /**
   * 分页配置
   * - 不传则没有分页器
   */
  pageInfo: {
    type: Object as PropType<PageInfo>,
    default: undefined,
  },
  /** 页码配置 */
  pageSizes: {
    type: Array as PropType<Array<number>>,
    default: undefined,
  },
  /** 是否多选排序 */
  sortMultiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: "update:selectList", list: Array<T>): void;
  (event: "update:pageInfo", info: PageInfo): void;
  (event: "row", row: T, col: any, e: Event): void;
  (event: "page", info: TableType.Page): void;
  (event: "sort", sortInfo: PageInfo, prop: string): void;
}>();

const theTable = ref<InstanceType<typeof ElTable>>();

const { adaptive, update } = useAdaptiveTable();

onUpdated(function() {
  theTable.value?.doLayout();
  update();
});

function rowClick(row: any, col: any, e: Event) {
  emit("row", row, col, e);
}

function isEmpty(val: any) {
  return ["", null, undefined, "null", "undefined"].includes(val);
}

function hasTooltip(col: TableType.Column<T>) {
  const defaultVal = col.prop === columnActionProp ? false : true;
  return isType(col.tooltip, "boolean") ? col.tooltip : defaultVal;
}

/** 
 * 设置默认的表格内容 
 * @param row 行信息
 * @param key 当前行的键值
 * @param column 列信息
 * */
function setTableDefaultContent(row: any, key: string, column: TableType.Column<T>) {
  if (isType(column.formatter, "function")) {
    return column.formatter(row, row[key], column);
  }
  return isEmpty(row[column.prop]) ? "-" : row[column.prop];
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
/** 是否禁用选择全部 */
const disabledAll = computed(() => canSelectList.value.length === 0);
/** 是否选中全部（当前表格页） */
const selectedAll = computed(() => {
  if (disabledAll.value) {
    return false;
  }
  return canSelectList.value.every(item => selected(item));
});
/** 是否有选中（当前表格页） */
const isIndeterminate = computed(() => selectedAll.value ? false : canSelectList.value.some(item => selected(item)));

const getCloneList = () => JSON.parse(JSON.stringify(props.selectList)) as Array<any>;

function onSelectAll() {
  if (!props.selectList) return console.warn("选择功能需要绑定 selectList 属性！");
  const key = props.selectKey!;
  const keys = canSelectList.value.map((item: any) => item[key]);
  let list = getCloneList();
  if (selectedAll.value) {
    list = list.filter(item => !keys.includes(item[key]));
  } else {
    list = filterRepeat(list.concat(canSelectList.value), (a, b) => a[key] === b[key]);
  }
  emit("update:selectList", list);
}

function onSelect(item: any) {
  if (!props.selectList) return console.warn("选择功能需要绑定 selectList 属性！");
  const key = props.selectKey!;
  const keys = selectKeys.value;
  let list = getCloneList();
  if (keys.includes(item[key])) {
    list = list.filter(selected => selected[key] !== item[key]);
  } else {
    list.push(item);
  }
  emit("update:selectList", list);
}

const sortData = {
  fields: [] as Array<string>,
  rules: [] as Array<number>,
};

/**
 * 排序操作
 * @param prop
 * @param type
 * @param init 是否初始化
 */
function onSort(prop: string, type: TableType.Column["sort"], init?: boolean) {
  const columns = props.columns;
  const ascList: Array<string> = [];
  for (const column of columns) {
    const key = column.prop as string;
    if (key === prop) {
      column.sort = type;
    } else if (!props.sortMultiple && column.sort) {
      column.sort = true;
      sortData.fields = sortData.fields.filter(el => el !== column.prop);
    }
    if (column.sort === "asc") {
      ascList.push(key);
    }
  }
  if (typeof type === "string") {
    sortData.fields.push(prop);
  } else if (type) {
    sortData.fields = sortData.fields.filter(el => el !== prop);
  }
  sortData.fields = [...new Set(sortData.fields)];
  const info = {
    ...(props.pageInfo || {}),
  } as PageInfo;
  if (sortData.fields.length > 0) {
    sortData.rules = sortData.fields.map(el => ascList.includes(el) ? 1 : 0);
    info.sortFields = sortData.fields.toString();
    info.sortRules = sortData.rules.toString();
  } else {
    sortData.rules = [];
    delete info.sortFields;
    delete info.sortRules;
  }
  emit("update:pageInfo", info);
  !init && emit("sort", info, prop);
}

// 初始化的时候更新一遍排序数据
for (const column of props.columns) {
  if (typeof column.sort === "string") {
    onSort(column.prop as string, column.sort, true);
    if (!props.sortMultiple) {
      break;
    }
  }
}
</script>
<template>
  <div class="the-table" :class="$attrs.class" :id="adaptive.id" v-loading="props.loading">
    <el-table
      ref="the-table"
      stripe
      border
      :max-height="props.maxHeight || adaptive.height"
      :data="props.data"
      @row-click="rowClick"
      @selection-change="onSelect"
    >
      <el-table-column v-if="props.selectKey" :resizable="false" width="55" align="center" fixed="left">
        <template #header>
          <el-checkbox
            :indeterminate="isIndeterminate"
            :model-value="selectedAll"
            :disabled="disabledAll"
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
      <template v-for="column in props.columns" :key="column.prop">
        <el-table-column
          v-if="typeof column.visible === 'boolean' ? column.visible : true"
          :key="column.prop"
          :prop="(column.prop as string)"
          :label="column.title"
          :min-width="column.minWidth"
          :width="column.width"
          :show-overflow-tooltip="hasTooltip(column)"
          :fixed="column.prop === columnActionProp ? 'right' : column.fixed"
          :align="column.prop === columnActionProp ? 'center' : column.align"
          :class-name="(isRowClick && column.prop !== columnActionProp) ? 'the-table-column-click' : ''"
        >
          <template #header="scope">
            <slot v-if="column.slotHead" :name="column.slotHead" v-bind="scope" />
            <SortBar v-else-if="column.sort" :column="column" @sort="onSort" />
          </template>
          <template #default="scope: SlotType">
            <slot :name="column.slot" v-bind="scope" v-if="column.slot"></slot>
            <ActionCell
              v-else-if="column.prop === columnActionProp"
              :row="scope.row"
              :index="scope.$index"
              :actions="(props.actions as any)"
              :clickStop="props.isRowClick"
            />
            <div
              v-else-if="column.rawContent"
              v-html="column.rawContent(scope.row[column.prop], scope.row)"
            ></div>
            <template v-else>
              {{ setTableDefaultContent(scope.row, column.prop as string, column) }}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
  <Pagination
    v-if="props.pageInfo"
    class="mt-[20px]"
    :disabled="props.loading"
    :page-info="props.pageInfo"
    :page-sizes="props.pageSizes"
    @change="e => emit('page', e)"
  >
    <template v-if="props.selectList && props.selectList.length > 0" #left>
      <span class="the-tag blue">已选择：{{ props.selectList.length }} 条数据</span>
    </template>
  </Pagination>
</template>
<style lang="scss">
.the-table {
  width: 100%;
  min-height: 500px;

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

  .the-table-column-click {
    cursor: pointer;
  }
}
</style>
