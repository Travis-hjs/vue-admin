<template>
    <div :class="classObj" class="app-wrapper clearfix">
        <div v-if="classObj.mobile && pageState.sidebarOpen" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" />
        <div :class="{'hasTagsView': pageState.showHistoryView}" class="main-container">
            <div :class="{'fixed-header': pageState.fixedHeader}">
                <navbar />
                <tags-view v-if="pageState.showHistoryView" />
            </div>
            <app-main />
            <right-panel v-if="pageState.showSettings">
                <settings />
            </right-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import RightPanel from "../components/RightPanel.vue";
import store from "../modules/store";

@Component({
    name: "Layout",
    components: {
        "app-main": AppMain,
        "navbar": Navbar,
        "right-panel": RightPanel,
        "settings": Settings,
        "sidebar": Sidebar,
        'tags-view': TagsView
    }
})
export default class Layout extends Vue {
    /** 页面状态 */
    private pageState = store.layoutState;

    get classObj() {
        return {
            hideSidebar: !this.pageState.sidebarOpen,
            openSidebar: this.pageState.sidebarOpen,
            withoutAnimation: this.pageState.sidebarWithoutAnimation,
            mobile: this.pageState.device === "mobile"
        };
    }

    @Watch("$route")
    private onRouteChange() {
        if (this.pageState.device === "mobile" && this.pageState.sidebarOpen) {
            this.pageState.sidebarWithoutAnimation = false;
        }
    }

    // methods ===============================

    private handleClickOutside() {
        this.pageState.sidebarOpen = !this.pageState.sidebarOpen;
    }

    private isMobile() {
        const rect = document.body.getBoundingClientRect();
        return rect.width - 1 < 990;
    }

    private resizeHandler() {
        if (!document.hidden) {
            const isMobile = this.isMobile();
            this.pageState.device = isMobile ? "mobile" : "desktop";
            if (isMobile) {
                this.pageState.sidebarWithoutAnimation = true;
                this.pageState.sidebarOpen = false;
            }
        }
    }

    // life cycle ================================

    beforeMount() {
        window.addEventListener("resize", this.resizeHandler);
    }

    beforeDestroy() {
        window.removeEventListener("resize", this.resizeHandler);
    }

    mounted() {
        const isMobile = this.isMobile();
        if (isMobile) {
            this.pageState.device = "mobile";
            this.pageState.sidebarWithoutAnimation = true;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: $sideBarWidth;
    position: relative;
}

.sidebar-container {
    transition: width 0.28s;
    width: $sideBarWidth !important;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar {
    .main-container {
        margin-left: 54px;
    }

    .sidebar-container {
        width: 54px !important;
    }

    .fixed-header {
        width: calc(100% - 54px);
    }
}

/* for mobile response 适配移动端 */
.mobile {
    .main-container {
        margin-left: 0px;
    }

    .sidebar-container {
        transition: transform 0.28s;
        width: $sideBarWidth !important;
    }

    &.openSidebar {
        position: fixed;
        top: 0;
    }

    &.hideSidebar {
        .sidebar-container {
            pointer-events: none;
            transition-duration: 0.3s;
            transform: translate3d(-$sideBarWidth, 0, 0);
        }
    }

    .fixed-header {
        width: 100%;
    }
}

.withoutAnimation {
    .main-container,
    .sidebar-container {
        transition: none;
    }
}
</style>
