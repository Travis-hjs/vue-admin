<template>
  <div class="base-table" v-loading="loading">
    <el-table
      ref="the-table"
      stripe
      border
      :data="data"
      @row-click="rowClick"
      @selection-change="onSelect"
    >
      <el-table-column type="selection" width="55" align="center" v-if="checkbox"></el-table-column>
      <el-table-column
        v-for="item in columns"
        :key="item.key || item.prop"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth"
        :width="item.width"
        :show-overflow-tooltip="item.tooltip === undefined ? true : item.tooltip"
        :fixed="item.prop === 'action-right' ? 'right' : item.fixed"
        :align="item.prop === 'action-right' ? 'center' : (item.align || 'center')"
        :class-name="(isRowClick && item.prop !== 'action-right') ? 'kch-column-click' : ''"
        label-class-name="base-table-label"
      >
        <template slot-scope="{row}">
          <slot :name="item.slotName" v-bind="row" v-if="item.slotName"></slot>
          <base-table-btns v-else-if="item.prop === 'action-right'" :row="row" :list="actions" :clickStop="isRowClick"></base-table-btns>
          <template v-else>{{ isEmpty(row[item.prop]) ? '-' : row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Table } from "element-ui";

/** 全局表格组件 */
@Component({
  name: "base-table"
})
export default class BaseTable extends Vue {
  @Prop({
    type: Array,
    default: () => []
  })
  data!: Array<any>

  @Prop({
    type: Array,
    default: () => []
  })
  columns!: Array<BaseTableColumn>

  @Prop({
    type: Array,
    default: () => []
  })
  actions!: Array<BaseTableBtnsItem>

  @Prop({
    type: Boolean,
    default: false
  })
  loading!: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  checkbox!: boolean

  @Prop({
    type: Boolean,
    default: true
  })
  isRowClick!: boolean

  $refs!: {
    "the-table": Table
  }

  beforeUpdate() {
    this.$nextTick(() => this.$refs["the-table"].doLayout());
  }

  onSelect(list: Array<any>) {
    this.$emit("select", list);
  }

  rowClick(row: any, col: any, e: any) {
    this.$emit("row", row, col, e);
  }

  isEmpty(val: string) {
    return ["", null, undefined, "null", "undefined"].includes(val);
  }
}
</script>
<style lang="scss">
.base-table {
  width: 100%;
  min-height: 500px;
  .el-table {
    width: 100%;
    .has-gutter {
      color: #18181A;
    }
  }
  .el-table th.el-table__cell,
  .el-table__header-wrapper .has-gutter .el-table__cell {
    height: 50px;
    background-color: #f6f7fb;
  }
  // .el-table__fixed-right {
  //   height: 100% !important;
  // }
  .kch-column-click {
    cursor: pointer;
  }
  .base-table-label {
    cursor: default;
  }
}
</style>