<template>
    <div>
        <MenuItem v-for="item in menuList" :key="item.key" :info="item" />
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import { Route } from "vue-router";
import MenuItem from "./MenuItem.vue";
import store from "@/store";
import { filterHidden } from "@/router";
import { LayoutMenuItem, RouteItem } from "@/types";

/**
 * 格式化菜单列表
 * @param list 
 * @param parentKey 上层`key`
 */
function formatMenuList(list: Array<RouteItem>, parentKey?: string) {
    list = JSON.parse(JSON.stringify(list));
    const result: Array<LayoutMenuItem> = [];
    for (let i = 0; i < list.length; i++) {
        const routeItem = list[i];
        const item: LayoutMenuItem = {
            key: parentKey ? `${parentKey}-${i}` : i.toString(),
            isOpen: false,
            isActive: false,
            hasActive: false,
            children: [],
            path: routeItem.path,
            link: routeItem.link,
            ...routeItem.meta
        }
        if (!item.hidden) {
            result.push(item);
            const child = routeItem.children;
            if (child && child.length > 0) {
                item.children = formatMenuList(child, item.key);
            }
        }
    }
    return result;
}

/**
 * 处理合并只有一条子菜单的列表数据
 * @param list
 * @param onlyMergeFirst
 */
function handleMerge(list: Array<LayoutMenuItem>, onlyMergeFirst: boolean) {
    list = JSON.parse(JSON.stringify(list));
    const result: Array<LayoutMenuItem> = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const child = item.children;
        if (child && child.length > 0) {
            if (child.length === 1) {
                child[0].key = item.key;
                result.push(child[0]);
                if (child[0].children && child[0].children.length > 0 && !onlyMergeFirst) {
                    child[0].children = handleMerge(child[0].children, onlyMergeFirst);
                }
            } else {
                result.push(item);
                if (!onlyMergeFirst) {
                    item.children = handleMerge(child, onlyMergeFirst);
                }
            }
        } else {
            result.push(item);
        }
    }
    return result;
}

@Component({
    name: "Menu",
    components: {
        MenuItem
    },
})
export default class Menu extends Vue {
    /** 是否合并只有一个子项 */
    @Prop({
        type: Boolean,
        default: false
    })
    mergeOnlyOneChild!: boolean;

    /** 是否只合并第一层路由列表 */
    @Prop({
        type: Boolean,
        default: false
    })
    onlyMergeFirst!: boolean

    /** 菜单数据列表 */
    menuList: Array<LayoutMenuItem> = [];

    /**
     * 激活的索引列表
     */
    private activeList: Array<number> = [];

    /**
     * 更新菜单列表激活状态
     * @param list
     */
    private updateActive(list: Array<LayoutMenuItem>) {
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            // 这里要先重置一下
            item.hasActive = false;
            // 设置 mergeOnlyOneChild 时的判断，并初始化值
            if (item.isOpen && (!item.children || (item.children && item.children.length === 0))) {
                item.isOpen = false;
            }
            item.isActive = item.path === this.$route.path;
            if (item.isActive) {
                this.activeList = item.key.split("-").map(val => Number(val));
            }
            if (item.children && item.children.length > 0) {
                this.updateActive(item.children);
            }
        }
    }

    /**
     * 设置激活`item`状态
     * @param list
     * @param setp 层级
     */
    private setItem(list: Array<LayoutMenuItem>, setp = 0) {
        const index = this.activeList[setp];
        const item = list[index];
        item.hasActive = item.isOpen = true;
        if (setp < this.activeList.length - 1) {
            this.setItem(item.children!, setp + 1);
        }
    }

    update() {
        this.activeList = [];
        this.updateActive(this.menuList);
        if (this.activeList.length > 0) {
            this.setItem(this.menuList);
        }
        // console.log("menuList >>", this.menuList);
    }

    @Watch("$route")
    onRoute() {
        this.update();
    }

    created() {
        let list = formatMenuList(filterHidden(store.layout.completeRouters));
        if (this.mergeOnlyOneChild) {
            list = handleMerge(list, this.mergeOnlyOneChild);
            // console.log("处理合并只有一条子菜单的列表数据 >>", list);
        }
        this.menuList = list;
    }

    sizeInfo = store.layout.menuSizeInfo;

    mounted() {
        this.update();
        function getElementHeight(name: string, defaultHeight = 0) {
            const el = document.querySelector(name) as HTMLElement;
            if (el) {
                return el.clientHeight;
            } else {
                console.log("%c 找不到节点 >>", "color: #ff4949", name, "已使用默认值 >>", defaultHeight);
                return defaultHeight;
            }
        }
        this.sizeInfo.titleHeight = getElementHeight(".the-layout-menu .the-layout-menu-title", 50);
        this.sizeInfo.itemHeight = getElementHeight(".the-layout-menu .the-layout-menu-item", 44);
        // console.log("Menu >>", this.sizeInfo);
    }

}
</script>
