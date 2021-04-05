<template>
    <div :class="{'has-logo': layoutState.showSidebarLogo}">
        <SidebarLogo v-if="layoutState.showSidebarLogo" :collapse="!layoutState.sidebarOpen" />
        <el-scrollbar wrap-class="sidebar-scrollbar" :style="{'background-color' : variable.menuBg}">
            <el-menu
                :default-active="activeMenu"
                :collapse="!layoutState.sidebarOpen"
                :background-color="variable.menuBg"
                :text-color="variable.menuText"
                :active-text-color="menuActiveTextColor"
                :unique-opened="false"
                :collapse-transition="false"
                mode="vertical"
            >
                <SidebarItem
                    v-for="route in completeRouters"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                    :is-collapse="!layoutState.sidebarOpen"
                />
            </el-menu>
            <!-- 不知是不是`el-scrollbar`组件的原因，滚动高度会小于实际高度，所以这里要增加一个导航高度去补回来 -->
            <div style="height: 56px"></div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import SidebarItem from "./SidebarItem.vue";
import SidebarLogo from "./SidebarLogo.vue";
import store from "../../../store";
import variables from "../../../styles/variables.scss";

export default defineComponent({
    name: "SideBar",
    components: {
        SidebarItem,
        SidebarLogo
    },
    setup(props, context) {
        const route = useRoute();
        
        const layoutState = store.layout.state;

        const variable = reactive(variables);

        const menuActiveTextColor = computed(function() {
            if (layoutState.sidebarTextTheme) {
                return layoutState.theme;
            } else {
                return variable.menuActiveText;
            }
        });

        const activeMenu = computed(function () {
            const { meta, path } = route;
            // 判断是否激活的菜单
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        })

        return {
            layoutState,
            completeRouters: store.layout.completeRouters,
            variable,
            menuActiveTextColor,
            activeMenu
        }
    }
})
</script>

<style lang="scss">
.sidebar-container {
    // 这里必须设置，不然底部会出现滚动条
    .sidebar-scrollbar {
        overflow-x: hidden !important;
    }

    // 设置这个会导致没有滚动条
    // .el-scrollbar__view {
    //     height: 100%;
    // }

    .el-scrollbar__bar {
        // &.is-vertical {
        //     right: 0px;
        // }

        &.is-horizontal {
            display: none;
        }
    }
    .el-scrollbar {
        height: 100%;
    }

    .has-logo {
        .el-scrollbar {
            height: calc(100% - 50px);
        }
    }

    .el-menu {
        border: none;
        height: 100%;
        width: 100% !important;
    }
}
</style>
