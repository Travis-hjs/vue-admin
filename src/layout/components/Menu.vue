<template>
    <MenuItem v-for="item in menuList" :key="item.path" :info="item" />
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from "vue";
import MenuItem from "./MenuItem.vue";
import store from "@/store";
import { filterHidden } from "@/router";
import { useRoute } from "vue-router";
import { LayoutMenuItem } from "@/types";

export default defineComponent({
    name: "Menu",
    components: {
        MenuItem
    },
    setup(props, context) {
        const route = useRoute();

        const layoutInfo = store.layout.info;

        const menuList = ref(filterHidden(store.layout.completeRouters));
    
        let levels: Array<number> = [];

        /**
         * 更新菜单列表
         * @param list
         * @param level 层级数组
         */
        function updateMenuList(list: Array<LayoutMenuItem>, level: number) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                item.isActive = item.path === route.path;
                if (item.isActive) {
                    levels[level] = i;
                }
                if (item.children && item.children.length > 0) {
                    if (!item.isActive) {
                        levels[level] = i;
                    }
                    updateMenuList(item.children, level + 1);
                }
            }
        }

        function update() {
            levels = [];
            updateMenuList(menuList.value, 0);
            console.log("levels >>", levels);
            let index = 0;
            let item = menuList.value;
            while (index < levels.length) {
                item[levels[index]].isOpen = true;
                if (item[levels[index]].children && item[levels[index]].children.length > 0) {
                    item = item[levels[index]].children;
                }
                index++;
            }
        }

        watchEffect(function() {
            update()
        })

        onMounted(function() {
            update()
        })
        
        return {
            layoutInfo,
            menuList
        }
    }
})
</script>
