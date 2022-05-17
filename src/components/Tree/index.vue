<template>
    <div class="the-tree">
        <Level :level="0" :options="options" :checkChild="checkChild" :checkbox="checkbox">
            <template v-slot:treeitem="slotProps">
                <slot v-bind="slotProps"></slot>
            </template>
        </Level>
    </div>
</template>
<script lang="ts">
import { checkType } from "@/utils";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Level from "./Level.vue";

/** 多级树节点对象 */
export interface TreeItem<T = object> {
  /** 字段名 */
  label: string
  /** 对应的值 */
  value: string
  /** 下级数据 */
  children: Array<TreeItem>
  /** 唯一`key` */
  key: string
  /** 索引，多层用`-`串联 */
  indexs: string
  /** 是否展开下级 */
  open: boolean
  /** 是否选中 */
  checked: boolean
  /** 组件展开收起高度，默认`30` */
  height: number
  /** 原始数据 */
  original: T
}

/** 树形结构组件 */
@Component({
    components: {
        Level
    }
})
export default class Tree extends Vue {
    /** 数组列表 */
    @Prop({
        type: Array,
        default: () => []
    })
    list!: Array<{ [k: string]: string|number }>;

    /** 选择父节点时，是否也选中所有其子节点 */
    @Prop({
        type: Boolean,
        default: false
    })
    checkChild!: boolean;

    /** 选择当前节点时，把上级没有选中的关联父节点给勾选上 */
    @Prop({
        type: Boolean,
        default: false
    })
    checkParent!: boolean;

    /** 是否需要选择功能 */
    @Prop({
        type: Boolean,
        default: false
    })
    checkbox!: boolean;

    /** 配置表 */
    @Prop({
        type: Object,
        default: () => ({
            label: "label",
            value: "value",
            children: "children",
            key: ""
        })
    })
    setting!: { label: string, value: string, children: string, key: string };

    /** 节点过滤函数 */
    @Prop({
        type: Function,
        default: undefined
    })
    filterNodeMethod!: (val: string | number, item: object, node: TreeItem) => boolean;

    /** 使用的选项数据 */
    options: Array<TreeItem> = [];
    
    /** 备份数据 */
    backups!: Array<TreeItem>;

    @Watch("list", {
        deep: true,
        immediate: true
    })
    onListChange() {
        this.updateOptions();
    }

    updateOptions() {
        const setting = Object.assign({
            label: "label",
            value: "value",
            children: "children",
            key: "",
        }, this.setting);

        /**
         * 格式化选项数据
         * @param arr
         * @param parentKey
         */
        function format(arr: Array<any>, parentKey = ""): Array<TreeItem> {
            return arr.map(function (item, index) {
                const indexs = parentKey ? `${parentKey}-${index}` : index.toString();
                const key = setting.key && item[setting.key] ? item[setting.key] : indexs;
                const children = item[setting.children] || undefined;
                return {
                    label: item[setting.label],
                    value: item[setting.value],
                    children: children ? format(children, indexs) : [],
                    key,
                    indexs,
                    open: false,
                    checked: false,
                    height: 30,
                    // 原始数据
                    original: {
                        ...item
                    }
                }
            })
        }
        this.options = format(this.list);
        this.backups = JSON.parse(JSON.stringify(this.options));
    }

    /**
     * 设置父节点选中
     * @param item
     */
    setParentCheck(item: TreeItem) {
        // console.log(item);
        const indexList = item.indexs.split("-").map(i => Number(i));
        if (item.checked && indexList.length > 1) {
            let index = 0;
            let node: TreeItem;
            while (index < indexList.length) {
                node = index === 0 ? this.options[indexList[0]] : node!.children[indexList[index]];
                node.checked = true;
                index++;
            }
        }
    }

    /** 
     * 更新展开收起高度
     * @param item
     */
    updateHeight(item: TreeItem) {
        const indexList = item.indexs.split("-").map(i => Number(i));

        /**
         * 后续遍历设置高度
         * @param node 节点单个对象
         */
        function setHeight(node: TreeItem) {
            let res = 30;

            // 没有子节点或节点没有打开时，更新当前节点高度并返回
            if (node.children && (!node.children.length || !node.open)) {
                return node.height = res;
            }
            
            if (node.children && node.children.length) {
                // 设置所有子节点的高度
                node.children.forEach(sub => {
                    res += setHeight(sub);
                })
            }
            // 更新父节点高度并返回
            return node.height = res;
        }

        setHeight(this.options[indexList[0]]);
    }

    /**
     * 获取选中的值
     */
    getCheckedValues() {
        const values: Array<string | number> = [];

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

        each(this.options);

        return values;
    }

    /**
     * 设置选中值
     * @param values
     */
    setCheckedValues(values: Array<string | number>) {
        /**
         * 递归处理
         * @param list
         */
        function each(list: Array<TreeItem>) {
            list.forEach(function (item) {
                item.checked = values.includes(item.value);
                item.children.length && each(item.children);
            });
        }

        each(this.options);
    }

    /**
     * @param {string} value
     */
    filter(value: string) {

        const conditionFn = this.filterNodeMethod;

        if (checkType(conditionFn) !== "function") return console.warn("请先定义 filterNodeMethod 过滤函数！");

        /**
         * 递归过滤
         * @param list
         */
        function eachFilter(list: Array<TreeItem>) {
            return list.filter(function (item) {
                if (item.children && item.children.length) {
                    item.children = eachFilter(item.children);
                }
                return item.children.length > 0 || conditionFn(value, item.original, item);
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

        const backups = JSON.parse(JSON.stringify(this.backups));

        if (value) {
            this.options = eachFilter(backups);
        } else {
            this.options = backups;
        }

        eachSetIndexs(this.options);

    }

    created() {
        this.$on("levelItemChange", (item: TreeItem) => {
            this.checkParent && this.setParentCheck(item);
            this.$emit("nodeChange", item);
        });

        this.$on("levelItemClick", (item: TreeItem) => {
            item.children.length && this.updateHeight(item); // 没有下级的点击不用更新，减少性能开销
            this.$emit("nodeClick", item);
        });
    }
}
</script>
<style lang="scss">
@import "@/styles/variables.scss";

.the-tree {
    width: 100%;
    .the-tree-level {
        height: 30px;
        overflow: hidden;
        @include moveTime();
    }
    .the-tree-item {
        width: 100%;
        height: 30px;
        font-size: 14px;
        color: #1f2d3d;
        @include moveTime();
        cursor: pointer;
        border-radius: 2px;

        &:hover {
            background-color: #edf6ff;
        }
        .the-tree-icon {
            padding: 4px;
            margin-right: 2px;
            color: #c0c4cc;
            @include moveTime();
        }
        .the-tree-icon.hidden-icon {
            opacity: 0;
        }
        .the-tree-icon.expanded {
            transform: rotate(90deg);
        }
        .el-checkbox {
            margin-right: 8px;
        }
    }
}
</style>