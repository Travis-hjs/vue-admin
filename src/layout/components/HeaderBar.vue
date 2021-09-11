<template>
    <div class="the-layout-header">
        <div class="the-layout-navbar">
            <div :class="['flex fcenter fvertical hamburger', { 'hamburger-active': layoutInfo.sidebarOpen }]" @click="onSwitch()">
                <svg-icon name="hamburger" />
            </div>
        </div>
        <div class="the-layout-tags">

        </div>
    </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import store from "@/store";

export default defineComponent({
    name: "HeaderBar",
    setup(props, context) {
        const layoutInfo = store.layout.info;

        function onSwitch() {
            layoutInfo.sidebarOpen = !layoutInfo.sidebarOpen;
        }
        return {
            onSwitch,
            layoutInfo
        }
    }
})
</script>
