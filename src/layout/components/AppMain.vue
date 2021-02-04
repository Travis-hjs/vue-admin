<template>
    <section class="app-main">
        <!-- vue 2.x 写法 -->
        <!-- <transition name="fadeSlideX" mode="out-in">
            <keep-alive :include="layoutState.historyViews">
                <router-view :key="$route.path" />
            </keep-alive>
        </transition> -->

        <!-- vue 3.x 写法 -->
        <router-view v-slot="{ Component, route }">
            <transition name="fadeSlideX" mode="out-in">
                <!-- 需要保持缓存时开启 -->
                <!-- <keep-alive> -->
                    <component :is="Component" :key="route.path" />
                <!-- </keep-alive> -->
            </transition>
        </router-view>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import store from "../../store";

export default defineComponent({
    name: "AppMain",
    setup() {

        return {
            // layoutState: store.layoutState
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

</style>
