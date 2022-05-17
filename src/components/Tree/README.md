# 树形层级组件

使用示例

```html
<template>
    <div class="demo">
        <!-- 默认用法 -->
        <Tree ref="the-tree" :list="options" :setting="propSetting" checkbox @nodeChange="onChange" @nodeClick="onChange" />
        <!-- 选择父节点时，也把其子节点也勾选上 -->
        <Tree :list="options" :setting="propSetting" checkbox checkChild />
        <!-- 插槽用法 -->
        <Tree :list="options" :setting="propSetting" checkbox>
            <template slot-scope="item">
                <span>{{ item.label }}</span>
                <!-- original 为原始数据 -->
                <span>ID: {{ item.original.id }}</span>
            </template>
        </Tree>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tree, { TreeItem } from "@/components/Tree/index.vue";

@Component({
    components: {
        Tree
    }
})
export default class Demo extends Vue {

    options = [
        {
            id: "1",
            name: "选项 1",
            list: [
                {
                    id: "1-2",
                    name: "选项 1-2",
                }
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

    propSetting = {
        value: "id",
        label: "name",
        children: "list"
    }

    $refs!: {
        "the-tree": Tree
    }

    /** 获取选中值 */
    getValues() {
      const ids = this.$refs["the-tree"].getCheckedValues();
    }
    
    /** 设置选中值 */
    setValues() {
      this.$refs["the-tree"].setCheckedValues(["1", "1-2"]);
    }

    onChange(item: TreeItem) {
      console.log("是否选中 >>", item.checked, item);
    }
}
</script>
```

## 参数说明：

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- | 
| list | array | 是 | 树型结构数据 |
| checkChild | boolean | 否 | 选择父节点时，是否也选中所有其子节点 |
| checkParent | boolean | 否 | 选择当前节点时，把上级没有选中的关联父节点给勾选上 |
| checkbox | boolean | 否 | 是否需要选择功能 |
| setting | object | 否 | 配置表`<{ label: '定义显示字段', value: '对应的值', children: '下级数据字段', key: '指定唯一值' }>` |
| filterNodeMethod | function | 否 | 节点过滤函数，要求返回布尔值 |

## 暴露的方法：

| 方法名 | 说明 |
| --- | --- |
| filter(val: string) | 搜索用，配合`:filterNodeMethod="过滤函数"` |
| setCheckedValues(vals: Array<string/number>) | 设置选中值 |
| getCheckedValues(): Array<string/number> | 获取选中的值 |