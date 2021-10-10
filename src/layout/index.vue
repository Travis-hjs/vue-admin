<template>
    <div :class="[
        'the-layout',
        { 'has-tags-view': layoutInfo.showTagsView },
        { 'collapsed-sidebar': !layoutInfo.sidebarOpen }
    ]">
        <HeaderBar />
        <Sidebar />
        <div class="the-layout-content">
            <transition name="fadeSlideX" mode="out-in">
                <keep-alive :include="cacheList">
                    <router-view class="the-layout-page" :key="$route.path" />
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import HeaderBar from "./components/HeaderBar.vue";
import Sidebar from "./components/Sidebar.vue";
import store from "../store";
import { RouteItem } from "@/types";

/** 主体布局组件 */
@Component({
    components: {
        HeaderBar,
        Sidebar
    }
})
export default class Layout extends Vue {

    layoutInfo = store.layout.info;

    @Watch("layoutInfo", { deep: true })
    onLayoutChange() {
        // console.count("store.saveLayout");
        store.layout.saveInfo();
    }

    cacheList: Array<string> = [];

    created() {
        function getCachList(list: Array<RouteItem>) {
            let result: Array<string> = [];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const child = item.children;
                if (child && child.length > 0) {
                    result = result.concat(getCachList(child));
                }
                if (item.meta.keepAlive && item.name) {
                    result.push(item.name);
                }
            }
            return result.filter(item => item);
        }

        this.cacheList = getCachList(store.layout.completeRouters);
        // console.log("缓存列表 >>", this.cacheList);
    }
}
</script>

