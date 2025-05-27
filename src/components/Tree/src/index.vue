<script lang="ts">
/** 树形组件 */
export default {
  name: "Tree"
};
</script>
<script lang="ts" generic="T extends BaseObj<any>" setup>
import { computed, onUnmounted, provide, reactive, watch, type PropType } from 'vue';
import Level from "./Level.vue";
import { getKey } from "./hooks";
import globalEvent from "@/utils/event";
import type { TreeType } from "./types";
import { deepClone } from '@/utils';
import { getCountId } from '@/hooks/common';

const props = defineProps({
  /** 选项数据 */
  options: {
    type: Array as PropType<Array<T>>,
    default: () => [],
  },
  /** 选项配置对象 */
  optionSetting: {
    type: Object as PropType<TreeType.Setting<any>>,
    default: () => ({}),
  },
  /** 是否需要选择功能 */
  checkbox: {
    type: Boolean,
    default: false,
  },
  /**
   * 选中绑定值列表
   * - 当`checkbox="true"`时有效
   */
  values: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  /** 选择当前节点时，把上级没有选中的关联父节点给勾选上 */
  checkParent: {
    type: Boolean,
    default: false,
  },
  /** 选择父节点时，是否也选中所有其子节点 */
  checkChild: {
    type: Boolean,
    default: false,
  },
  /** 节点过滤函数 */
  filterMethod: {
    type: Function as PropType<(option: T) => boolean>,
    default: undefined,
  },
  /** 节点禁用函数 */
  disabledMethod: {
    type: Function as PropType<(option: T) => boolean>,
    default: undefined,
  },
});

const emit = defineEmits<{
  (event: "update:values", values: typeof props.values): void;
  // (event: "allValues", values: typeof props.values): void;
}>();

const setting = computed<TreeType.Setting>(() => {
  return {
    label: "label",
    value: "value",
    children: "children",
    ...(props.optionSetting as any),
  }
});

const state = reactive({
  /** 全部选项的`key`列表 */
  allKeys: [] as Array<number | string>,
  /** 需要展开的`key`列表 */
  openKeys: [] as Array<number | string>,
});

/**
 * 获取选项数据的所有`key`值
 * @param list 
 */
function getKeys(list: Array<T>, keys: typeof state.allKeys) {
  list.forEach(item => {
    keys.push(getKey(item, setting.value));
    const subList = item[setting.value.children!] || [];
    if (subList.length > 0) {
      getKeys(subList, keys);
    }
  });
  return keys;
}

/**
 * 获取选项数据所有的`value`值
 * @param list 
 * @param values 
 */
function getValues(list: Array<T>, values: typeof props.values) {
  list.forEach(item => {
    const value = item[setting.value.value!];
    if (props.disabledMethod) {
      !props.disabledMethod(item) && values.push(value);
    } else {
      values.push(value);
    }
    const subList = item[setting.value.children!] || [];
    if (subList.length > 0) {
      getValues(subList, values);
    }
  });
  return values;
}

function findItemByKey(list: Array<T>, key: number | string): T | undefined {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (getKey(item, setting.value) === key) {
      return item;
    }
    const subList = item[setting.value.children!] || [];
    if (subList.length > 0) {
      const sub = findItemByKey(subList, key);
      if (sub) {
        return sub;
      }
    }
  }
  return undefined;
}

function onItemOpen(key: number | string) {
  if (state.openKeys.includes(key)) {
    state.openKeys = state.openKeys.filter(item => item !== key);
  } else {
    state.openKeys.push(key);
  }
}

function onItemCheck(params: TreeType.ItemCheckParams) {
  const { value, parentValues, key, hasSub } = params;
  let subList: Array<T> = [];
  if (props.checkChild && hasSub) {
    const sub = findItemByKey(props.options, key);
    if (sub) {
      subList = sub[setting.value.children!] || [];
    }
  }
  let values = deepClone(props.values);
  if (values.includes(value)) {
    // 消除选中
    values = values.filter(val => val !== value);
    if (subList.length > 0) {
      const subValues = getValues(subList, []);
      values = values.filter(val => !subValues.includes(val));
    }
    // TODO: 这里留一个作业给你：当取消全部子项时，将父节点也取消，可以利用`parentKeys`实现
  } else {
    // 添加选中
    values.push(value);
    if (props.checkParent) {
      values.push(...parentValues);
    }
    if (subList.length > 0) {
      values.push(...getValues(subList, []));
    }
    // 最后去重处理
    if (props.checkParent || subList.length > 0) {
      values = [...new Set(values)];
    }
  }
  emit("update:values", values);
}

const eventMap: TreeType.EventMap = {
  itemCheck: getCountId("tree-item-check"),
  itemOpen: getCountId("tree-item-open"),
}

globalEvent.on(eventMap.itemOpen, onItemOpen);
globalEvent.on(eventMap.itemCheck, onItemCheck);

onUnmounted(function() {
  globalEvent.off(eventMap.itemCheck, onItemCheck);
  globalEvent.off(eventMap.itemOpen, onItemOpen);
});

provide("treeRoot", {
  eventMap,
});

/**
 * 过滤搜索数据
 * @param list
 */
function filter(list: typeof props.options) {
  return list.filter((item: any) => {
    const subList = item[setting.value.children!] || [];
    if (subList.length > 0) {
      item[setting.value.children!] = filter(subList);
      if (item[setting.value.children!].length > 0) {
        return true;
      }
    }
    if (props.filterMethod!(item)) {
      return true;
    }
    return false;
  });
}

const treeData = computed(() => {
  if (props.filterMethod) {
    return filter(deepClone(props.options));
  }
  return props.options;
});

const usableValueMap = computed(() => {
  if (props.checkParent || props.checkChild) {
    const map: BaseObj<Array<number | string>> = {};

    function traverse(node: any) {
      const subList = node[setting.value.children!] || [];
      if (subList.length < 1) return;
      const nodeKey = getKey(node, setting.value);
      map[nodeKey] = [];

      for (const sub of subList) {
        const subKey = getKey(sub, setting.value);
        const subValue = sub[setting.value.value!];
        const disabled = props.disabledMethod ? props.disabledMethod(sub) : false;

        if (!disabled) {
          map[nodeKey].push(subValue);
        }

        traverse(sub);

        if (map[subKey]) {
          map[nodeKey].push(...map[subKey]);
        }
      }
    }

    for (const option of props.options) {
      traverse(option);
    }

    return map;
  }
  return {};
});

watch(
  () => props.options,
  function(list) {
    const keys = getKeys(list, []);
    // 过滤掉不在当前选项列表里面的值
    state.openKeys = state.openKeys.filter(key => keys.includes(key));
    // 最后更新赋值数据
    state.allKeys = keys;
    // TODO: 这里可以抛出一个事件，给外部做全选的操作
    // emit("allValues", getValues(list, []));
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <Level
    v-for="item in treeData"
    :key="getKey(item, setting)"
    :option="item"
    :setting="setting"
    :open-keys="state.openKeys"
    :checkbox="props.checkbox"
    :values="props.values"
    :disabled="props.disabledMethod"
    :parent-keys="[]"
    :parent-values="[]"
    :usable-value-map="usableValueMap"
  >
    <template #treeitem="option: T">
      <slot v-bind="option"></slot>
    </template>
  </Level>
</template>
