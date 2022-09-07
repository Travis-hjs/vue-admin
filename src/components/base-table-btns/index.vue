<template>
  <div class="base-table-btns">
    <el-button
      v-for="(btn, index) in btnList"
      :key="'btn-' + index"
      :loading="useBoolean(btn, 'loading')"
      :disabled="useBoolean(btn, 'disabled')"
      :type="btn.type || 'primary'"
      size="mini"
      plain
      @click="onBtnClick(btn)">
      <i :class="[useString(btn, 'icon')]" v-if="btn.icon && !useBoolean(btn, 'loading')"></i>
      <span>{{ useString(btn, 'text') }}</span>
    </el-button>
    <el-dropdown class="pdl_10" v-if="dropdownList.length">
      <el-button type="text" size="small">更多 <i class="el-icon-arrow-down"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(drop, index) in dropdownList"
          :key="'drop-' + index"
          :disabled="useBoolean(drop, 'disabled') || useBoolean(drop, 'loading')"
          @click.native="onBtnClick(drop)"
        >
          <i class="el-icon-loading" v-if="useBoolean(drop, 'loading')"></i>
          <i :class="[useString(drop, 'icon')]" v-else-if="drop.icon && !useBoolean(drop, 'loading')"></i>
          <span>{{ useString(drop, 'text') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * 全局组件
 * - 表格操作按钮栏组件
 */
@Component({})
export default class BaseTableBtns extends Vue {
  /** 最大限制几个按钮出现，超过则用【更多】代替 */
  @Prop({
    type: [Number, String],
    default: 3
  })
  max!: number | string

  /** 传入的数据，事件绑定或者返回用 */
  @Prop({
    type: Object,
    default: () => ({})
  })
  row!: BaseObj

  /** 是否阻止事件冒泡 */
  @Prop({
    type: Boolean,
    default: false
  })
  clickStop!: boolean

  /** 按钮列表 */
  @Prop({
    type: Array,
    default: []
  })
  list!: Array<BaseTableBtnsItem>

  get useList() {
    return this.list.filter(item => {
      if (typeof item.show === "function") {
        return item.show(this.row);
      } else if (typeof item.show === "boolean") {
        return item.show;
      } else {
        return true;
      }
    })
  }

  get btnList() {
    const max = Number(this.max);
    const btns = this.useList;
    return btns.length > max ? btns.filter((_, index) => index < max - 1) : btns;
  }

  get dropdownList() {
    const max = Number(this.max);
    const btns = this.useList;
    return btns.length > max ? btns.filter((_, index) => index >= (max - 1)) : [];
  }

  onBoxClick(e: MouseEvent) {
    if (this.clickStop) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  
  useString(item: BaseTableBtnsItem, key: keyof BaseTableBtnsItem) {
    const value = item[key];
    if (!value) return '-';
    return typeof value === 'function' ? value(this.row) : value;
  }

  useBoolean(item: BaseTableBtnsItem, key: keyof BaseTableBtnsItem) {
    const value = item[key];
    if (!value) return false;
    return typeof value === 'function' ? value(this.row) : value;
  }

  onBtnClick(item: BaseTableBtnsItem) {
    item.click && item.click(this.row);
  }

}
</script>
<style lang="scss">
.base-table-btns {
  width: 100%;
}
</style>