<template>
    <div :style="{ 'padding-left': level > 0 ? '15px' : '0px' }">
        <div class="the-tree-level" v-for="item in options" :style="{ 'height': item.height + 'px' }" :key="item.key" :data-key="item.key" :data-level="level">
            <div class="the-tree-item fvertical" @click="onOpen(item)">
                <i :class="['the-tree-icon el-icon-caret-right', { 'hidden-icon': !item.children.length }, { 'expanded': item.open }]"></i>
                <el-checkbox v-if="checkbox" :value="item.checked" @change="onChecked(item)"></el-checkbox>
                <slot name="treeitem" v-bind="item">{{ item.label }}</slot>
            </div>
            <Level v-if="item.children.length" :options="item.children" :level="level + 1" :checkChild="checkChild" :checkbox="checkbox">
                <template v-slot:treeitem="slotProps">
                    <slot name="treeitem" v-bind="slotProps"></slot>
                </template>
            </Level>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { TreeItem } from "./index.vue";

/** 递归树型层级组件 */
@Component({
    name: "Level"
})
export default class Level extends Vue {
    @Prop({
        type: Array,
        default: () => []
    })
    options!: Array<{ [k: string]: string | number }>;

    @Prop({
        type: Number,
        default: 0
    })
    level!: number;

    /** 选择父节点时，是否也选中所有其子节点 */
    @Prop({
        type: Boolean,
        default: false
    })
    checkChild!: boolean;
    
    /** 是否需要选择功能 */
    @Prop({
        type: Boolean,
        default: false
    })
    checkbox!: boolean;

    onChecked(item: TreeItem) {
        item.checked = !item.checked;
        /**
         * 递归处理
         */
        function each(list: Array<TreeItem>, value: boolean) {
            list.forEach(function (e) {
            e.checked = value;
            e.children.length && each(e.children, value);
            })
        }
        if (this.checkChild) {
            each(item.children, item.checked);
        } else {
            !item.checked && each(item.children, false);
        }
        this.dispatch("Tree", "levelItemChange", [item]);
    }


    onOpen(item: TreeItem) {
      item.open = !item.open;
      this.dispatch("Tree", "levelItemClick", [item]);
    }

    /**
     * 指定派发组件监听的事件
     * @description 通过递归遍历来找到对应的父组件并且将当前组件属性方法和参数带到父组件方便调用
     * @param componentName 指定的组件名
     * @param eventName 事件名
     * @param params 派发的参数
     */
    dispatch<T>(componentName: string, eventName: string, params: Array<T>) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;

        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;
            if (parent) {
                name = parent.$options.name;
            }
        }

        if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params as any) as any);
        }
    }

}
</script>
