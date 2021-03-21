<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="pageState.historyViews">
                <router-view class="app-page" :key="$route.path" />
            </keep-alive>
        </transition>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../../store";

@Component({})
export default class AppMain extends Vue {
    readonly pageState = store.layoutState;
}
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
