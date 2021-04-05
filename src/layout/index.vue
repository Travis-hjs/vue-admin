<template>
    <div :class="classInfo" class="app-wrapper clearfix">
        <div v-if="classInfo.mobile && layoutState.sidebarOpen" class="drawer-bg" @click="switchSidebar()" />
        <Sidebar class="sidebar-container" />
        <div :class="{'hasTagsView': layoutState.showHistoryView}" class="main-container">
            <div :class="['app-header', {'fixed-header': layoutState.fixedHeader}]">
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
import { defineComponent, computed, onMounted, onBeforeUnmount } from "vue";
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
        const layoutState = store.layout.state;
        const classInfo = computed(function() {
            return {
                hideSidebar: !layoutState.sidebarOpen,
                openSidebar: layoutState.sidebarOpen,
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
                    layoutState.sidebarOpen = false;
                }
            }
        }

        onBeforeUnmount(function() {
            window.removeEventListener("resize", checkResize);
        })

        onMounted(function() {
            checkResize();
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
        transition: $time;
        margin-left: $sideBarWidth;
        position: relative;
    }

    .sidebar-container {
        transition: $time;
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

    .app-header {
        position: relative;
        z-index: 5;
    }
    
    .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: calc(100% - #{$sideBarWidth});
        transition: $time;
    }
}

.openSidebar {
    .sidebar-container {
        transform: translate3d(0%, 0, 0);
    }
}

.hideSidebar {
    .main-container {
        margin-left: $minSideBarWidth;
    }

    .sidebar-container {
        width: $minSideBarWidth !important;
    }

    .fixed-header {
        width: calc(100% - #{$minSideBarWidth});
    }
}

/* for mobile response 适配移动端 */
.mobile {
    .main-container {
        margin-left: 0px;
    }
    
    &.openSidebar {
        position: fixed;
        top: 0;
        .sidebar-container {
            width: $sideBarWidth !important;
        }
    }

    &.hideSidebar {
        .sidebar-container {
            width: $minSideBarWidth !important;
            pointer-events: none;
            transform: translate3d(-100%, 0, 0);
        }
    }

    .fixed-header {
        width: 100%;
    }
}
</style>
