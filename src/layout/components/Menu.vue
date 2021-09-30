<template>
    <MenuItem v-for="item in menuList" :key="item.key" :info="item" />
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import MenuItem from "./MenuItem.vue";
import store from "@/store";
import { filterHidden } from "@/router";
import { useRoute } from "vue-router";
import { LayoutMenuItem, RouteItem } from "@/types";

/**
 * 侧边菜单组件
 */
const Menu = defineComponent({
    name: "Menu",
    components: {
        MenuItem
    },
    setup(props, context) {
        const route = useRoute();

        const layoutInfo = store.layout.info;

        /**
         * 格式化菜单列表
         * @param array 
         * @param parentKey 上层`key`
         */
        function formatMenuList(array: Array<RouteItem>, parentKey?: string) {
            array = JSON.parse(JSON.stringify(array));
            const result: Array<LayoutMenuItem> = [];
            for (let i = 0; i < array.length; i++) {
                const routeItem = array[i];
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
                    if (routeItem.children && routeItem.children.length > 0) {
                        item.children = formatMenuList(routeItem.children, item.key);
                    }
                }
            }
            return result;
        }

        /**
         * 菜单数据列表
         */
        const menuList = ref(formatMenuList(filterHidden(store.layout.completeRouters)));

        /**
         * 激活的索引列表
         */
        let activeList: Array<number> = [];

        /**
         * 更新菜单列表激活状态
         * @param list
         */
        function updateActive(list: Array<LayoutMenuItem>) {
            for (let index = 0; index < list.length; index++) {
                const item = list[index];
                item.hasActive = false; // 这里要先重置一下
                item.isActive = item.path === route.path;
                if (item.isActive) {
                    activeList = item.key.split("-").map(val => Number(val));
                }
                if (item.children && item.children.length > 0) {
                    updateActive(item.children);
                }
            }
        }

        /**
         * 设置激活`item`状态
         * @param list
         * @param setp 层级
         */
        function setItem(list: Array<LayoutMenuItem>, setp = 0) {
            const index = activeList[setp];
            const item = list[index];
            item.hasActive = item.isOpen = true;
            if (setp < activeList.length - 1) {
                setItem(item.children!, setp + 1);
            }
        }

        function update() {
            activeList = [];
            updateActive(menuList.value);
            if (activeList.length > 0) {
                setItem(menuList.value);
            }
            // console.log("menuList >>", menuList.value);
        }

        watch(() => route.path, function() {
            update();
        })

        onMounted(function() {
            update();
            const $ = (name: string) => document.querySelector(name) as HTMLElement;
            store.layout.menuSizeInfo.titleHeight = $(".the-layout-menu .the-layout-menu-title").clientHeight;
            store.layout.menuSizeInfo.itemHeight = $(".the-layout-menu .the-layout-menu-item").clientHeight;
        })
        
        return {
            layoutInfo,
            menuList
        }
    }
})
export default Menu;
</script>
