<template>
    <MenuItem v-for="item in menuList" :key="item.path" :info="item" />
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
         */
        function formatMenuList(array: Array<RouteItem>) {
            array = JSON.parse(JSON.stringify(array));
            const result: Array<LayoutMenuItem> = [];
            for (let i = 0; i < array.length; i++) {
                const routeItem = array[i];
                const item: LayoutMenuItem = {
                    isActive: false,
                    isOpen: false,
                    children: [],
                    path: routeItem.path,
                    link: routeItem.link,
                    ...routeItem.meta
                }
                if (!item.hidden) {
                    result.push(item);
                    if (routeItem.children && routeItem.children.length > 0) {
                        item.children = formatMenuList(routeItem.children);
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
         * 更新菜单列表激活状态
         * @param list
         */
        function updateActive(list: Array<LayoutMenuItem>) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                item.isActive = item.path === route.path;
                if (item.children && item.children.length > 0) {
                    updateActive(item.children);
                }
            }
        }

        /**
         * 更新展开状态
         * @param list
         */
        function updateOpen(list: Array<LayoutMenuItem>) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.children && item.children.length > 0) {
                    updateOpen(item.children);
                    const isOpen = item.children.some(el => el.isActive || el.isOpen);
                    if (isOpen) {
                        item.isOpen = isOpen;
                    }
                }
            }
        }

        function update() {
            updateActive(menuList.value);
            updateOpen(menuList.value);
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
