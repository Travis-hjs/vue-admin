<template>
    <MenuItem v-for="item in menuList" :key="item.path" :info="item" />
</template>
<script lang="ts">
import { defineComponent, onMounted, provide, ref } from "vue";
import MenuItem from "./MenuItem.vue";
import store from "@/store";
import { filterHidden } from "@/router";

export default defineComponent({
    name: "Menu",
    components: {
        MenuItem
    },
    setup(props, context) {
        const layoutInfo = store.layout.info;

        const menuList = ref(filterHidden(store.layout.completeRouters));
        
        onMounted(function() {
            console.log(menuList.value);
        })

        return {
            layoutInfo,
            menuList
        }
    }
})
</script>
