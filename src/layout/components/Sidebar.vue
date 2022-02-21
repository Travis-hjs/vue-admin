<template>
    <div class="the-layout-sidebar">
        <Scrollbar :clickUpdateDelay="300" :thumbSize="10">
            <transition name="fade">
                <div class="the-logo-box" v-if="layoutInfo.showSidebarLogo">
                    <router-link class="the-logo-link flex fvertical fcenter" to="/">
                        <img class="the-logo" :src="info.logo" />
                        <h1 class="the-logo-title ellipsis">{{ info.title }}</h1>
                    </router-link>
                </div>
            </transition>
            <Menu :mergeOnlyOneChild="true" :onlyMergeFirst="true" />
        </Scrollbar>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Menu from "./Menu.vue";
import Scrollbar from "@/components/Scrollbar/index.vue";
import store from "@/store";

export default defineComponent({
    name: "Sidebar",
    components: {
        Menu,
        Scrollbar
    },
    setup() {
        const layoutInfo = store.layout.info;
        const info = store.projectInfo;
        
        return {
            layoutInfo,
            info
        }
    }
})
</script>