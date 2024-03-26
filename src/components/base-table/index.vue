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
      <el-table-column type="selection" width="55" align="center" fixed="left" v-if="props.checkbox" :selectable="canSelect"></el-table-column>
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
        <template #default="{row, $index}">
          <slot :name="item.slotName" v-bind="{row, $index}" v-if="item.slotName"></slot>
          <base-table-option
            v-else-if="item.prop === 'action-right'"
            :row="row"
            :index="$index"
            :list="props.actions"
            :clickStop="props.isRowClick"
          ></base-table-option>
          <template v-else>{{ setTableDefaultContent(row, item.prop, item) }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeUpdate } from "vue";

/** 全局表格组件 */
export default defineComponent({
  name: "base-table"
})
</script>

<script lang="ts" setup>
import { PropType, ref } from "vue";
import { ElTable } from "element-plus";

const props = defineProps({
  data: {
    type: Array,
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
  /** 表格带选择操作，默认`false`，columns 中不需要定义 */
  checkbox: {
    type: Boolean,
    default: false
  },
  /** 表格行是否需要点击，其实就是加一个鼠标手点击的样式，和内部`<base-table-option />`组件的阻止事件冒泡作用 */
  isRowClick: {
    type: Boolean,
    default: false
  },
  /** `<base-table-option :list="list">`组件的 list 数据 */
  actions: {
    type: Array as PropType<Array<BaseTableOptionItem>>,
    default: () => []
  },
  /** 复选框的禁用回调函数 */
  checkboxDisabled: {
    type: Function as PropType<(row: any) => boolean>,
    default: undefined
  },
  maxHeight: {
    type: Number,
    default: 500
  }
});

const emit = defineEmits<{
  (event: "select", list: Array<any>): void
  (event: "row", row: any, col: any, e: Event): void
}>()

const theTable = ref<InstanceType<typeof ElTable>>();

onBeforeUpdate(function() {
  theTable.value?.doLayout();
});

function onSelect(list: Array<any>) {
  emit("select", list);
}

function rowClick(row: any, col: any, e: Event) {
  emit("row", row, col, e);
}

function isEmpty(val: any) {
  return ["", null, undefined, "null", "undefined"].includes(val);
}

/**
 * 是否能选中
 */
function canSelect(row: any) {
  if (typeof props.checkboxDisabled === "function") {
    return !props.checkboxDisabled(row);
  } else {
    return true;
  }
}

/** 
 * 设置默认的表格内容 
 * @param row 行信息
 * @param prop 当前行的 key
 * @param item 列信息
 * */
function setTableDefaultContent(row: any, prop: string, item: BaseTableColumn) {
  if (typeof item.formatter === "function") {
    return item.formatter(row, row[prop], item);
  }
  return isEmpty(row[item.prop]) ? "-" : row[item.prop];
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