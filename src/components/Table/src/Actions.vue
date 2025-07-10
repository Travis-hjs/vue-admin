<script lang="ts">
/** 表格操作列组件 */
export default {
  name: "Actions"
}
</script>
<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { checkType, isType } from "@/utils";
import type { TableType } from "./types";

const props = defineProps({
  /** 最大限制几个按钮出现，超过则用【更多】代替 */
  max: {
    type: [Number, String],
    default: 3,
  },
  /** 传入的数据，事件绑定或者返回用 */
  row: {
    type: Object,
    default: () => ({}),
  },
  /** 传入的索引，事件绑定或者返回用 */
  index: {
    type: Number,
    default: -1,
  },
  /** 按钮列表 */
  actions: {
    type: Array as PropType<Array<TableType.Action>>,
    default: [],
  },
  /** 是否阻止事件冒泡 */
  clickStop: {
    type: Boolean,
    default: false,
  },
});

const useList = computed(() => {
  const types = ["boolean", "function", "string"];
  const btnList = props.actions.filter(item => {
    if (types.includes(checkType(item.show))) {
      return getBoolean(item, "show");
    } else {
      return true;
    }
  });
  const max = Number(props.max);

  return {
    btn: btnList.length > max ? btnList.filter((_, index) => index < max - 1) : btnList,
    dropdown: btnList.length > max ? btnList.filter((_, index) => index >= (max - 1)) : [],
  }
});

// function getString(item: TableType.Action, key: "text" | "icon") {
//   const value = item[key];
//   if (!value) return "-";
//   return isType(value, "function") ? value(props.row) : value;
// }
function getString(item: TableType.Action, key: "text" | "icon") {
  const value = item[key];
  if (isType(value, "function")) {
    return value(props.row);
  }
  if (isType(value, "string")) {
    let text = value;
    if (value.includes("return")) {
      try {
        const fn = new Function("row", value);
        text = fn(props.row);
      } catch (error) {
        console.warn("解析按钮文字代码错误 >>", error);
      }
    }
    return text;
  }
  return undefined;
}

// function getBoolean(item: TableType.Action, key: "loading" | "disabled" | "show") {
//   const value = item[key];
//   if (!value) return false;
//   return isType(value, "function") ? value(props.row) : value;
// }
function getBoolean(item: TableType.Action, key: "loading" | "disabled" | "show") {
  const value = item[key];
  if (isType(value, "function")) {
    return value(props.row);
  }
  if (isType(value, "string")) {
    let val = key === "show";
    if (value.includes("return")) {
      try {
        const fn = new Function("row", value);
        val = fn(props.row);
      }  catch (error) {
        console.warn(`解析 ${key} 字段代码错误 >>`, error);
      }
    }
    return val;
  }
  return false;
}

// function onBtnClick(item: TableType.Action) {
//   item.click && item.click(props.row, props.index);
// }
function onBtnClick(item: TableType.Action) {
  const fn = item.click;
  if (!fn) return;
  const { row, index } = props;
  if (isType(fn, "function")) {
    fn(row, index);
  } else if (isType(fn, "string")) {
    try {
      const _click = new Function("row", "index", fn);
      _click(row, index);
    } catch (error) {
      console.warn("解析按钮点击代码错误 >>", error);
    }
  }
}

function onBoxClick(e: MouseEvent) {
  if (props.clickStop) {
    e.stopPropagation();
    e.preventDefault();
  }
}
</script>
<template>
  <div class="the-table-actions fvc" @click="onBoxClick">
    <span v-if="!useList.btn.length">-</span>
    <el-button
      text
      :type="btn.type || 'primary'"
      v-for="(btn, index) in useList.btn"
      :key="'btn-' + index"
      :loading="getBoolean(btn, 'loading')"
      :disabled="getBoolean(btn, 'disabled')"
      @click="onBtnClick(btn)"
    >
      <i :class="['the-table-actions-icon', getString(btn, 'icon')]" v-if="btn.icon && !getBoolean(btn, 'loading')"></i>
      {{ getString(btn, 'text') }}
    </el-button>
    <el-dropdown v-if="useList.dropdown.length" trigger="click">
      <el-button text type="primary">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(drop, index) in useList.dropdown"
            :key="'drop-' + index"
            :disabled="getBoolean(drop, 'disabled') || getBoolean(drop, 'loading')"
            @click="onBtnClick(drop)"
          >
            <i class="el-icon-loading" v-if="getBoolean(drop, 'loading')"></i>
            <i :class="['the-table-actions-icon', getString(drop, 'icon')]" v-else-if="drop.icon && !getBoolean(drop, 'loading')"></i>
            {{ getString(drop, 'text') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<style lang="scss">
.the-table-actions {
  line-height: 1;
  .el-button {
    height: 28px;
    padding: 0 6px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  .the-table-actions-icon {
    padding-right: 4px;
  }
}
</style>
