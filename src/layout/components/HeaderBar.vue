<template>
    <div class="the-layout-header">
        <div class="the-layout-navbar flex">
            <div :class="['flex fcenter fvertical hamburger', { 'hamburger-active': layoutInfo.sidebarOpen }]" @click="onSwitch()">
                <svg-icon name="hamburger" />
            </div>
            <Breadcrumb class="f1" />
        </div>
        <div class="the-layout-tags">

        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Breadcrumb from "./Breadcrumb.vue";
import store from "@/store";

export default defineComponent({
    name: "HeaderBar",
    components: {
        Breadcrumb
    },
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
