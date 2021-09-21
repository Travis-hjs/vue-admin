<template>
    <div class="the-layout-sidebar">
        <Menu v-for="item in menuList" :key="item.path" :info="item" />
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import Menu from "./Menu.vue";
import store from "@/store";
import { filterHidden } from "@/router";

export default defineComponent({
    name: "Sidebar",
    components: {
        Menu
    },
    setup(props, context) {
        const layoutInfo = store.layout.info;

        const menuList = filterHidden(store.layout.completeRouters);
        
        return {
            layoutInfo,
            menuList
        }
    }
})
</script>
