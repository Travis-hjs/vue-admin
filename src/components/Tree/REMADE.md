# 树型层级组件

## 参数说明

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- |
| list | array | 是 | 树型结构数据 |
| checkChild | boolean | 否 | 选择父节点时，是否也选中所有其子节点 |
| checkParent | boolean | 否 | 选择当前节点时，把上级没有选中的关联父节点给勾选上 |
| checkbox | boolean | 否 | 是否需要选择功能 |
| setting | object | 否 | 配置表`{ label: '定义显示字段', value: '对应的值', children: '下级数据字段', key: '指定唯一值' }` |
| filterNodeMethod | function | 否 | 节点过滤函数，要求返回布尔值 |
| keepState | boolean | 否 | 是否保留操作状态：展开，选中等；保留操作一定要设置`setting.key`唯一值 |

## 暴露的方法

| 方法名 | 说明 |
| --- | --- |
| `filter(val: string)` | 搜索用，配合`:filterNodeMethod="过滤函数"` |
| `setCheckedValues(vals: Array<string/number>, open: boolean)` | 设置选中值，第二个值为是否展开选中项 |
| `getCheckedValues(): Array<string/number>` | 获取选中的值 |

## 使用示例

```html
<template>
  <div class="demo">
    <h2 class="the-title">默认用法</h2>
    <Tree
      ref="theTree"
      :list="options"
      :setting="propSetting"
      checkbox
      @nodeChange="onChange"
      @nodeClick="onChange"
    />

    <h2 class="the-title">选择父节点时，也把其子节点也勾选上</h2>
    <Tree :list="options" :setting="propSetting" checkbox checkChild />

    <h2 class="the-title">插槽用法</h2>
    <Tree :list="options" :setting="propSetting" checkbox>
      <template #default="item">
        <span>{{ item.label }}</span>
        <!-- original 为原始数据 -->
        <span>ID: {{ item.original.id }}</span>
      </template>
    </Tree>
    <el-button @click="getValues()">获取选中值</el-button>
    <el-button type="success" @click="setValues()">设置选中值</el-button>
  </div>
</template>
<script lang="ts" setup>
import Tree from "@/components/Tree";
import { ref } from "vue";

const options = [
  {
    id: "1",
    name: "选项 1",
    list: [
      {  
        id: "1-2",
        name: "选项 1-2",
      },
      {  
        id: "1-3",
        name: "选项 1-3",
        disabled: true
      },
    ]
  },
  {
    id: "2",
    name: "选项 2",
    list: [
      {
        id: "2-2",
        name: "选项 2-2",
      }
    ]
  },
];

const propSetting: CommonOption = {
  value: "id",
  label: "name",
  children: "list",
  key: "id"
}

const theTree = ref<InstanceType<typeof Tree>>();

/** 获取选中值 */
function getValues() {
  const ids = theTree.value?.getCheckedValues();
  console.log(ids);
}

/** 设置选中值 */
function setValues() {
  theTree.value?.setCheckedValues(["1", "1-2"], true);
}

function onChange(item: TreeItem) {
  console.log("是否选中 >>", item.checked, item);
}

</script>
```

## 备份文件

`TreeLevel.tsx`

```tsx
import { defineComponent, inject, PropType } from "vue";
import globalEvent from "@/utils/event";

/** 递归树层级组件 */
const TreeLevel = defineComponent({
  name: "TreeLevel",
  props: {
    options: {
      type: Array as PropType<Array<TreeItem>>,
      default: () => []
    },
    level: {
      type: Number,
      default: 0
    },
    /** 选择父节点时，是否也选中所有其子节点 */
    checkChild: {
      type: Boolean,
      default: false
    },
    /** 是否需要选择功能 */
    checkbox: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    /** 父组件注入的对象 */
    const parentProvide = inject<{ eventMap: { itemClick: string, itemChange: string } }>("treeParent");

    function onOpen(item: TreeItem) {
      item.open = !item.open;
      globalEvent.dispatch(parentProvide!.eventMap.itemClick, item);
    }

    function onChecked(item: TreeItem) {
      item.checked = !item.checked;
      /**
       * 递归处理
       * @param list
       * @param value
       */
      function each(list: Array<TreeItem>, value: boolean) {
        list.forEach(function (e) {
          e.checked = value;
          e.children.length && each(e.children, value);
        })
      }
      if (props.checkChild) {
        each(item.children, item.checked);
      } 
      // else {
      //   !item.checked && each(item.children, false);
      // }
      globalEvent.dispatch(parentProvide!.eventMap.itemChange, item);
    }
    
    return () => (
      <div style={{ paddingLeft: props.level > 0 ? "15px" : "0px" }}>
        {
          props.options.map(item => (
            <div
              class="base-tree-level"
              style={{ "height": item.height + "px" }}
              key={item.key}
              data-key={item.key}
              data-level={props.level}
            >
              <div class="base-tree-item f-vertical" onClick={() => onOpen(item)}>
                <i class={`base-tree-icon el-icon-caret-right ${item.children.length ? "" : "hidden-icon"} ${item.open ? "expanded" : ""}`}></i>
                {
                  props.checkbox ? (
                    <span onClick={ e => e.stopPropagation() }>
                      <el-checkbox model-value={item.checked} onChange={() => onChecked(item)} disabled={item.disabled}></el-checkbox>
                    </span>
                  ) : undefined
                }
                { context.slots.treeitem ? context.slots.treeitem(item) : item.label }
              </div>
              {
                item.children.length ? (
                  <TreeLevel
                    options={item.children}
                    level={props.level + 1}
                    checkChild={props.checkChild}
                    checkbox={props.checkbox}
                    v-slots={{
                      treeitem: context.slots.treeitem ? (info: TreeItem) => context.slots.treeitem!(info) : undefined
                    }}
                  />
                ) : undefined
              }
            </div>
          ))
        }
      </div>
    )
  }
});

export default TreeLevel;

```
