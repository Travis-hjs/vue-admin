<template>
    <section class="app-main">
        <!-- el-fade-in -->
        <transition name="fade_slide" mode="out-in">
            <keep-alive :include="layoutState.historyViews">
                <router-view :key="$route.path" />
            </keep-alive>
        </transition>

        <!-- <router-view v-slot="{ Component }">
            <transition name="fade_slide" mode="out-in">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view> -->
    </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import store from "../../store";

export default defineComponent({
    name: "AppMain",
    setup() {
        const route = useRoute();
        const layoutState = store.layoutState;
        const Component = computed(function() {
            const item = layoutState.historyViews.find(item => item.path == route.path);
            if (item) {
                return item.component
            }
            return null
        })

        return {
            layoutState,
            Component
        }
    }
})
</script>

<style lang="scss">
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    padding: 14px; 
    position: relative;
    overflow: hidden;
}

.fixed-header + .app-main {
    padding-top: 64px;
    height: 100vh;
    overflow: auto;
}

.hasTagsView {
    .app-main {
        /* 98 = navbar + tags-view = 50 + 34 + 14 */
        min-height: calc(100vh - 98px);
    }

    .fixed-header + .app-main {
        padding-top: 98px;
    }
}

// ================== 定义过渡动画 ==================
.fade_slide-leave-active, .fade_slide-enter-active {
    transition: all .4s;
}

.fade_slide-enter-active,
.fade_slide-leave-active {
    opacity: 1;
    transform: translateX(0px);
}

.fade_slide-enter-from {
    opacity: 0;
    transform: translateX(-40px);
}
.fade_slide-leave-to {
    opacity: 0;
    transform: translateX(40px);
}

</style>
