<template>
  <div class="base-table-actions fvc" @click="onBoxClick">
    <el-button
      text
      :type="btn.type || 'primary'"
      v-for="(btn, index) in useList.btn"
      :key="'btn-' + index"
      :loading="useBoolean(btn, 'loading')"
      :disabled="useBoolean(btn, 'disabled')"
      @click="onBtnClick(btn)"
    >
      <i :class="['base-table-actions-icon', useString(btn, 'icon')]" v-if="btn.icon && !useBoolean(btn, 'loading')"></i>
      {{ useString(btn, 'text') }}
    </el-button>
    <el-dropdown v-if="useList.dropdown.length">
      <el-button text type="primary">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(drop, index) in useList.dropdown"
            :key="'drop-' + index"
            :disabled="useBoolean(drop, 'disabled') || useBoolean(drop, 'loading')"
            @click="onBtnClick(drop)"
          >
            <i class="el-icon-loading" v-if="useBoolean(drop, 'loading')"></i>
            <i :class="['base-table-actions-icon', useString(drop, 'icon')]" v-else-if="drop.icon && !useBoolean(drop, 'loading')"></i>
            {{ useString(drop, 'text') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts">
/** 全局表格操作组件 */
export default {
  name: "base-table-actions"
}
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { isType } from "@/utils";

const props = defineProps({
  /** 最大限制几个按钮出现，超过则用【更多】代替 */
  max: {
    type: [Number, String],
    default: 3
  },
  /** 传入的数据，事件绑定或者返回用 */
  row: {
    type: Object,
    default: () => ({})
  },
  /** 传入的索引，事件绑定或者返回用 */
  index: {
    type: Number,
    default: -1
  },
  /** 按钮列表 */
  actions: {
    type: Array as PropType<Array<BaseTableAction>>,
    default: []
  },
  /** 是否阻止事件冒泡 */
  clickStop: {
    type: Boolean,
    default: false
  }
});

const useList = computed(() => {
  const btnList = props.actions.filter(item => {
    if (isType(item!.show, "function")) {
      return item.show(props.row);
    } else if (isType(item!.show, "boolean")) {
      return item.show;
    } else {
      return true;
    }
  });
  
  const max = Number(props.max);

  return {
    btn: btnList.length > max ? btnList.filter((_, index) => index < max - 1) : btnList,
    dropdown: btnList.length > max ? btnList.filter((_, index) => index >= (max - 1)) : []
  }
})

const useString = (item: BaseTableAction, key: "text"|"icon") => {
  // console.log(item)
  const value = item[key];
  if (!value) return "-";
  return isType(value, "function") ? value(props.row) : value;
}

const useBoolean = (item: BaseTableAction, key: "loading"|"disabled") => {
  const value = item[key];
  if (!value) return false;
  return isType(value, "function") ? value(props.row) : value;
}

const onBtnClick = (item: BaseTableAction) => {
  item.click && item.click(props.row, props.index);
}

const onBoxClick = (e: MouseEvent) => {
  if (props.clickStop) {
    e.stopPropagation();
    e.preventDefault();
  }
}

</script>

<style lang="scss">
.base-table-actions {
  line-height: 1;
  .el-button {
    height: 28px;
    padding: 0 6px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .base-table-actions-icon {
    padding-right: 4px;
  }
}
</style>