<template>
    <section class="app-main">
        <!-- vue 2.x 写法 -->
        <!-- <transition name="fadeSlideX" mode="out-in">
            <keep-alive :include="layoutState.historyViews">
                <router-view class="app-page" :key="$route.path" />
            </keep-alive>
        </transition> -->

        <!-- vue 3.x 写法 -->
        <router-view class="app-page" v-slot="{ Component, route }">
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
            // layoutState: store.layout.state
        }
    }
})
</script>

<style lang="scss">
@import "@/styles/variables.scss";

// .app-main padding
$appPadding: 12px;

.app-main {
    min-height: calc(100vh - #{$navbarHeight});
    width: 100%;
    padding: $appPadding; 
    position: relative;
    overflow: hidden;
    .app-page {
        transition: $time all;
    }
}

.fixed-header + .app-main {
    padding-top: calc(#{$navbarHeight} + #{$appPadding});
    height: 100vh;
    overflow: auto;
    background-color: #eee;
    .app-page {
        width: 100%;
        min-height: 100%;
        padding: 14px;
        background-color: #fff;
    }
}

.hasTagsView {
    .app-main {
        min-height: calc(100vh - #{$navbarHeight} - #{$tagsViewHeight});
    }

    .fixed-header + .app-main {
        padding-top: calc(#{$navbarHeight} + #{$appPadding} + #{$tagsViewHeight});
    }
}
</style>
