<template>
    <div class="the-layout-sidebar">
        <div></div>
    </div>
    <!-- 占位符 -->
    <!-- <div class="the-layout-sidebar"></div> -->
</template>
<script>
import { defineComponent, reactive } from "vue";
import store from "@/store";

export default defineComponent({
    name: "Sidebar",
    setup(props, context) {
        const layoutInfo = store.layout.info;
        
        return {
            layoutInfo
        }
    }
})
</script>
