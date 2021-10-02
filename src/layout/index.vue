<template>
    <div :class="[
        'the-layout',
        { 'has-tags-view': layoutInfo.showTagsView },
        { 'collapsed-sidebar': !layoutInfo.sidebarOpen }
    ]">
        <HeaderBar />
        <Sidebar />
        <div class="the-layout-content">
            <router-view class="the-layout-page" v-slot="{ Component, route }">
                <transition name="fadeSlideX" mode="out-in">
                    <keep-alive :include="cacheList">
                        <component :is="Component" :key="route.path" />
                    </keep-alive>
                </transition>
            </router-view>
        </div>
    </div>
</template>
<script lang="ts">
import store from "@/store";
import { RouteItem } from "@/types";
import { defineComponent } from "vue";
import HeaderBar from "./components/HeaderBar.vue";
import Sidebar from "./components/Sidebar.vue";

export default defineComponent({
    name: "Layout",
    components: {
        HeaderBar,
        Sidebar
    },
    setup(props, context) {
        const layoutInfo = store.layout.info;
        
        function getCachList(list: Array<RouteItem>) {
            let result: Array<string> = [];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const child = item.children;
                if (child && child.length > 0) {
                    result = getCachList(child);
                }
                if (item.meta.keepAlive && item.name) {
                    result.push(item.name);
                }
            }
            return result.filter(item => item);
        }

        // 这里不是动态的，所以可以不用响应式
        const cacheList = getCachList(store.layout.completeRouters);
        // console.log("cacheList >>", cacheList);

        return {
            layoutInfo,
            cacheList
        }
    }
})
</script>
