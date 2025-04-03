<script lang="ts">
/** 一直累加的`id` */
let treeId = 1;
/** 树形组件 */
export default {
  name: "Tree"
};
</script>
<script lang="ts" setup>
import { ref, type PropType, onUnmounted, provide, watch } from "vue";
import { useLevelProps, type TreeItem } from "./index";
import globalEvent from "@/utils/event";
import Level from "./Level.vue";

const props = defineProps({
  /** 数组列表 */
  list: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  /** 选择当前节点时，把上级没有选中的关联父节点给勾选上 */
  checkParent: {
    type: Boolean,
    default: false
  },
  /** 配置表 */
  setting: {
    type: Object as PropType<OptionSetting>,
    default: () => ({})
  },
  /** 节点过滤函数 */
  filterNodeMethod: {
    type: Function as PropType<(value: string, data: any, node: TreeItem) => boolean>,
    default: undefined
  },
  /** 
   * 是否保留操作状态：展开，选中等操作
   * - 保留操作一定要设置`setting.key`
   */
  keepState: {
    type: Boolean,
    default: false
  },
  ...useLevelProps()
});

const emit = defineEmits<{
  (event: "nodeChange", item: TreeItem): void
  (event: "nodeClick", item: TreeItem): void
}>();

/** 内部使用的选项数据 */
const options = ref<Array<TreeItem>>([]);

/** 备份数据 */
let backups: Array<TreeItem> = [];
/** 计时器 */
let timer: NodeJS.Timeout | undefined;

function updateOptions() {
  const setting: OptionSetting = {
    label: "label",
    value: "value",
    children: "children",
    disabled: "disabled",
    key: "",
    ...props.setting,
  }

  const keep = props.keepState;

  /**
   * 格式化选项数据
   * @param arr 要格式化的数据
   * @param parentIndex 父节点索引字段
   * @param beforeList 原始数据
   */
  function format(arr: Array<any>, parentIndex: string, beforeList: Array<TreeItem> = []): Array<TreeItem> {
    return arr.map(function (item, index) {
      const indexs = parentIndex ? `${parentIndex}-${index}` : index.toString();
      const key = setting.key && item[setting.key] ? item[setting.key] : indexs;
      const children = item[setting.children!] || undefined;
      // const before = (beforeList[index] && beforeList[index].key === key) ? beforeList[index] : undefined;
      const before = keep ? beforeList.find(b => b.key === key) : undefined;
      // console.log("before >>", before, before && before.label);
      return {
        label: item[setting.label!],
        value: item[setting.value!],
        disabled: item[setting.disabled!] === true,
        children: children ? format(children, indexs, before && before.children) : [],
        key,
        indexs,
        open: keep && before ? before.open : false,
        checked: keep && before ? before.checked : false,
        height: keep && before ? before.height : 30,
        // 原始数据
        original: {
          ...item
        }
      }
    })
  }

  options.value = format(props.list, "", options.value);

  /**
   * 对比差异
   * @param options 当前应用选项数据
   * @param backups 备份数据
   */
  function getDiffList(options: Array<TreeItem>, backups: Array<TreeItem>) {
    function getIndexs(option: Array<TreeItem>) {
      let indexs: Array<string> = [];
      option.forEach(item => {
        indexs.push(item.indexs);
        indexs = [...indexs, ...getIndexs(item.children || [])];
      })
      return indexs;
    }

    const before = getIndexs(backups);

    const now = getIndexs(options);

    return now.concat(before).filter((item, _, arr) => arr.indexOf(item) === arr.lastIndexOf(item));
  }

  const diffList = backups.length > 0 ? getDiffList(options.value, backups) : [];
  // console.log("diffList >>", diffList);
  timer && clearTimeout(timer);
  if (props.keepState && diffList.length) {
    timer = setTimeout(() => {
      diffList.forEach(indexs => {
        updateHeight({indexs});
      })
    }, 100);
  }
  backups = JSON.parse(JSON.stringify(options.value));
  // console.log("format11 >>", JSON.parse(JSON.stringify(this.options)));
}

/**
 * 设置父节点选中
 * @param item
 */
function setParentCheck(item: TreeItem) {
  // console.log(item);
  const indexList = item.indexs.split("-").map(item => Number(item));
  if (item.checked && indexList.length > 1) {
    let index = 0;
    let node: TreeItem;
    while (index < indexList.length) {
      node = index === 0 ? options.value[indexList[0]] : node!.children[indexList[index]];
      node.checked = true;
      index++;
    }
  }
}

/** 
 * 更新展开收起高度
 * @param item
 */
function updateHeight(item: Pick<TreeItem, "indexs">) {
  const indexList = item.indexs.split("-").map(item => Number(item));

  /**
   * 后续遍历设置高度
   * @param node 节点单个对象
   */
  function setHeight(node: TreeItem) {
    let res = 30;
    // base case
    // 没有子节点或节点没有打开时，更新当前节点高度并返回
    if (node.children && (!node.children.length || !node.open)) {
      return node.height = res
    }
    // 压栈
    if (node.children && node.children.length) {
      // 设置所有子节点的高度
      node.children.forEach(sub => {
        res += setHeight(sub)
      })
    }
    // 更新父节点高度并返回
    return node.height = res;
  }

  options.value[indexList[0]] && setHeight(options.value[indexList[0]]);
}

/**
 * 获取选中的值
 */
function getCheckedValues() {
  const values: Array<string|number> = [];

  /**
   * 递归处理
   * @param list
   */
  function each(list: Array<TreeItem>) {
    list.forEach(function (item) {
      item.checked && values.push(item.value);
      item.children.length && each(item.children);
    });
  }

  each(options.value);

  return values;
}

/**
 * 设置选中值
 * @param values 选中值
 * @param isOpen 是否展开选中项
 */
function setCheckedValues(values: Array<string|number>, isOpen = false) {
  /**
   * 递归处理
   * @param list
   */
  function each(list: Array<TreeItem>) {
    list.forEach(function (item) {
      item.checked = values.includes(item.value);
      if (isOpen) {
        item.open = item.checked;
      }
      item.children.length && each(item.children);
    });
  }

  each(options.value);
  isOpen && options.value.forEach(item => updateHeight(item));
}

/**
 * 暴露给外部使用的过滤函数
 * @param value 
 */
function filter(value: string) {
  const conditionFn = props.filterNodeMethod;

  if (typeof conditionFn !== "function") return console.warn("请先定义 filterNodeMethod 过滤函数！");

  /**
   * 递归过滤
   * @param list
   */
  function eachFilter(list: Array<TreeItem>) {
    return list.filter(function (item) {
      if (item.children && item.children.length) {
        item.children = eachFilter(item.children);
      }
      return item.children.length > 0 || conditionFn!(value, item.original, item);
    });
  }

  /**
   * 递归设置索引
   * @param list
   * @param parentIndex
   */
  function eachSetIndexs(list: Array<TreeItem>, parentIndex = "") {
    list.forEach(function (item, index) {
      item.indexs = parentIndex ? `${parentIndex}-${index}` : index.toString();
      item.children.length && eachSetIndexs(item.children, item.indexs);
    })
  }

  const _backups = JSON.parse(JSON.stringify(backups));

  if (value) {
    options.value = eachFilter(_backups);
  } else {
    options.value = _backups;
  }

  eachSetIndexs(options.value);

}

watch(() => props.list, function() {
  updateOptions();
}, {
  deep: true,
  immediate: true
});

const eventMap = {
  itemChange: `level-item-change-${treeId}`,
  itemClick: `level-item-click-${treeId}`
}

treeId++;

function onLevelItemChange(item: TreeItem) {
  // console.log("监听子组件传过来的事件 >>", item);
  props.checkParent && setParentCheck(item);
  emit("nodeChange", item);
}

globalEvent.on(eventMap.itemChange, onLevelItemChange);

function onLevelItemClick(item: TreeItem) {
  item.children.length && updateHeight(item); // 没有下级的点击不用更新，减少性能开销
  emit("nodeClick", item);
}

globalEvent.on(eventMap.itemClick, onLevelItemClick);

onUnmounted(function() {
  timer && clearTimeout(timer);
  globalEvent.off(eventMap.itemChange, onLevelItemChange);
  globalEvent.off(eventMap.itemClick, onLevelItemClick);
});

provide("treeParent", {
  eventMap,
});

defineExpose({
  eventMap,
  getCheckedValues,
  setCheckedValues,
  filter,
});
</script>
<template>
  <div class="base-tree">
    <Level
      :level="0"
      :options="options"
      :checkChild="checkChild"
      :checkbox="checkbox"
    >
      <template #treeitem="slotProps" v-if="$slots.default">
        <slot v-bind="slotProps"></slot>
      </template>
    </Level>
  </div>
</template>
<style lang="scss">
.base-tree {
  width: 100%;
  width: 100%;
  .base-tree-level {
    height: 30px;
    overflow: hidden;
    transition: var(--transition);
  }
  .base-tree-item {
    width: 100%;
    height: 30px;
    color: #606266;
    font-size: 14px;
    transition: var(--transition);
    cursor: pointer;
    border-radius: 2px;

    &:hover {
      background-color: #edf6ff;
    }
    .base-tree-icon {
      padding: 4px;
      margin-right: 2px;
      color: #c0c4cc;
      transition: var(--transition);
    }
    .base-tree-icon.hidden-icon {
      opacity: 0;
    }
    .base-tree-icon.expanded {
      transform: rotate(90deg);
    }
    .el-checkbox {
      margin-right: 8px;
    }
  }
}
</style>
