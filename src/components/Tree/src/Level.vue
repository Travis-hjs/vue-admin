<script lang="ts">
/** 递归树层级组件 */
export default {
  name: "Level"
};
</script>
<script lang="ts" setup>
import { computed, inject, type PropType } from 'vue';
import { getKey, getLabel } from './hooks';
import { useCollapseHeight } from '@/layout/components/hooks';
import globalEvent from '@/utils/event';
import type { TreeType } from './types';
// import { Icon } from '@/components/Icon';

const props = defineProps({
  /** 选项对象 */
  option: {
    type: Object as PropType<any>,
    required: true,
  },
  /** 选项配置对象 */
  setting: {
    type: Object as PropType<TreeType.Setting>,
    required: true,
  },
  /** 需要展开的`key`列表 */
  openKeys: {
    type: Array as PropType<Array<number | string>>,
    required: true,
  },
  /**
   * 直属关联`key`列表
   * - 用于处理或查找树状结构用
   */
  parentKeys: {
    type: Array as PropType<Array<number | string>>,
    required: true,
  },
  /**
   * 直属关联`value`列表
   * - 用于处理或查找树状结构用
   */
  parentValues: {
    type: Array as PropType<Array<number | string>>,
    required: true,
  },
  /** 是否需要选择功能 */
  checkbox: {
    type: Boolean,
    default: false,
  },
  /** 选中值列表 */
  values: {
    type: Array as PropType<Array<number | string>>,
    default: () => [],
  },
  /** 节点禁用函数 */
  disabled: {
    type: Function as PropType<(option: any) => boolean>,
    default: undefined,
  },
  /**
   * 可以进行选中的值对象
   * - `{ [key]: [value] }`
   */
  usableValueMap: {
    type: Object as PropType<BaseObj<Array<number | string>>>,
    required: true,
  },
});

const subList = computed<Array<any>>(() => props.option[props.setting.children!] || []);

const currentKey = computed(() => getKey(props.option, props.setting));

const currentValue = computed(() => props.option[props.setting.value!]);

const isOpened = computed(() => props.openKeys.includes(currentKey.value));

const isChecked = computed(() => props.values.includes(currentValue.value));

const isDisabled = computed(() => props.disabled ? props.disabled(props.option) : false);

const isIndeterminate = computed(() => {
  if (!isChecked.value) {
    return false;
  }
  const current = props.usableValueMap[currentKey.value];
  if (!current) {
    return false;
  }
  return current.some((val) => !props.values.includes(val));
});

const {
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave
} = useCollapseHeight();

/** 父组件注入的对象 */
const root = inject("treeRoot") as { eventMap: TreeType.EventMap };

function onOpen() {
  globalEvent.dispatch(root.eventMap.itemOpen, currentKey.value);
}

function onCheck() {
  if (isDisabled.value) return;
  const params: TreeType.ItemCheckParams = {
    key: currentKey.value,
    value: currentValue.value,
    parentKeys: props.parentKeys,
    parentValues: props.parentValues,
    hasSub: subList.value.length > 0,
  }
  globalEvent.dispatch(root.eventMap.itemCheck, params);
}
</script>
<template>
  <div class="the-tree">
    <div class="the-tree-item f-vertical">
      <div v-if="subList.length > 0" class="the-tree-icon fvc cursor-pointer" @click="onOpen()">
        <i :class="['el-icon-caret-right', { 'is-opened': isOpened }]"></i>
        <!-- <Icon :name="`tdesign:${isOpened ? 'minus' : 'add' }-rectangle`" /> -->
      </div>
      <div v-else class="the-tree-icon fvc">
        <i class="el-icon-collection-tag"></i>
        <!-- <Icon name="tdesign:folder" /> -->
      </div>
      <span
        v-if="checkbox"
        @click="onCheck()"
        :class="[
          'el-checkbox el-checkbox__input',
          {
            'is-checked': isChecked,
            'is-disabled': isDisabled,
            'is-indeterminate': isIndeterminate,
          }
        ]"
      >
        <span class="el-checkbox__inner"></span>
      </span>
      <slot name="treeitem" v-bind="props.option">
        {{ getLabel(props.option, props.setting) }}
      </slot>
    </div>
    <transition
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
      v-if="subList.length > 0"
    >
      <div v-show="isOpened" class="the-tree-sub">
        <Level
          v-for="sub in subList"
          :key="getKey(sub, props.setting)"
          :option="sub"
          :setting="props.setting"
          :open-keys="props.openKeys"
          :checkbox="props.checkbox"
          :values="props.values"
          :disabled="props.disabled"
          :usable-value-map="props.usableValueMap"
          :parent-keys="[...props.parentKeys, currentKey]"
          :parent-values="[...props.parentValues, currentValue]"
        >
          <template #treeitem="subProps: any">
            <slot name="treeitem" v-bind="subProps"></slot>
          </template>
        </Level>
      </div>
    </transition>
    </div>
</template>
<style lang="scss">
.the-tree {
  width: 100%;
  --space: 30px;

  .the-tree-item {
    width: 100%;
    min-height: var(--space);
    border-radius: var(--border-radius);
    font-size: 14px;
    color: #606266;

    &:hover {
      background-color: #edf6ff;
    }
  
    .the-tree-icon {
      height: var(--space);
      width: var(--space);

      i {
        font-size: 15px;
        transition: var(--transition);
      }

      .is-opened {
        transform: rotate(90deg);
      }
    }

    .el-checkbox {
      margin-right: 5px;
    }
  }

  .the-tree-sub {
    padding-left: var(--space);
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: calc(var(--space) / 2);
      top: 0;
      width: 1px;
      height: 100%;
      background-color: var(--border-color);
    }
  }
}
</style>