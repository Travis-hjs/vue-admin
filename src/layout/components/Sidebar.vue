<template>
    <div class="the-layout-sidebar">
        <Menu />
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import Menu from "./Menu.vue";

export default defineComponent({
    name: "Sidebar",
    components: {
        Menu
    },
    setup(props, context) {
        
    }
})
</script>
