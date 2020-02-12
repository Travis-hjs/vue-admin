<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="pageState.historyViews">
                <router-view :key="$route.path" />
            </keep-alive>
        </transition>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../../modules/store";

@Component({
    name: "AppMain"
})
export default class AppMain extends Vue {
    private pageState = store.layoutState;
}
</script>

<style lang="scss" scoped>
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
