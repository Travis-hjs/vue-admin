<template>
    <div :class="classInfo" class="app-wrapper clearfix">
        <div v-if="classInfo.mobile && layoutState.sidebarOpen" class="drawer-bg" @click="switchSidebar()" />
        <Sidebar class="sidebar-container" />
        <div :class="{'hasTagsView': layoutState.showHistoryView}" class="main-container">
            <div :class="{'fixed-header': layoutState.fixedHeader}">
                <Navbar />
                <TagsView v-if="layoutState.showHistoryView" />
            </div>
            <AppMain />
            <RightPanel v-if="layoutState.showSettings">
                <Settings />
            </RightPanel>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted } from "vue";
import AppMain from "./components/AppMain.vue";
import Navbar from "./components/Navbar.vue";
import RightPanel from "./components/RightPanel.vue";
import Settings from "./components/Settings.vue";
import Sidebar from "./components/Sidebar/index.vue";
import TagsView from "./components/TagsView.vue";
import store from "../store";

export default defineComponent({
    name: "Layout",
    components: {
        AppMain,
        Navbar,
        RightPanel,
        Settings,
        Sidebar,
        TagsView
    },
    setup() {
        const layoutState = store.layoutState;
        const classInfo = computed(function() {
            return {
                hideSidebar: !layoutState.sidebarOpen,
                openSidebar: layoutState.sidebarOpen,
                withoutAnimation: layoutState.sidebarWithoutAnimation,
                mobile: layoutState.device === "mobile"
            }
        })

        function isMobile() {
            const width = document.body.clientWidth;
            return width < 900;
        }

        /** 切换侧边栏 */
        function switchSidebar() {
            layoutState.sidebarOpen = !layoutState.sidebarOpen;
        }
        
        /** 检测窗口变动并更新侧边栏的样式切换 */
        function checkResize() {
            if (!document.hidden) {
                const mobile = isMobile();
                layoutState.device = mobile ? "mobile" : "desktop";
                if (mobile) {
                    layoutState.sidebarWithoutAnimation = true;
                    layoutState.sidebarOpen = false;
                } else {
                    // layoutState.sidebarWithoutAnimation = false;
                    // layoutState.sidebarOpen = true;
                }
            }
        }

        onUnmounted(function() {
            window.removeEventListener("resize", checkResize);
        })

        onMounted(function() {
            const mobile = isMobile();
            if (mobile) {
                layoutState.device = "mobile";
                layoutState.sidebarWithoutAnimation = true;
            }
            window.addEventListener("resize", checkResize);
        })
        
        return {
            layoutState,
            classInfo,
            switchSidebar
        }
    }
})
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
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
