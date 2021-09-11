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
                    <!-- 需要保持缓存时开启 -->
                    <!-- <keep-alive> -->
                        <component :is="Component" :key="route.path" />
                    <!-- </keep-alive> -->
                </transition>
            </router-view>
        </div>
    </div>
</template>
<script>
import store from "@/store";
import { defineComponent, reactive } from "vue";
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
        
        return {
            layoutInfo
        }
    }
})
</script>
