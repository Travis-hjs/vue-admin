<template>
    <div :class="{'has-logo': pageState.showSidebarLogo}">
        <SidebarLogo v-if="pageState.showSidebarLogo" :collapse="!pageState.sidebarOpen" />
        <el-scrollbar wrap-class="sidebar-scrollbar" :style="{'background-color' : variables.menuBg}">
            <el-menu
                :default-active="activeMenu"
                :collapse="!pageState.sidebarOpen"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :active-text-color="menuActiveTextColor"
                :unique-opened="false"
                :collapse-transition="false"
                mode="vertical"
            >
                <SidebarItem
                    v-for="route in routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                    :is-collapse="!pageState.sidebarOpen"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SidebarItem from "./SidebarItem.vue";
import SidebarLogo from "./SidebarLogo.vue";
import store from "../../../store";
import variables from "../../../styles/variables.scss";

@Component({
    components: {
        SidebarItem,
        SidebarLogo
    }
})
export default class SideBar extends Vue {

    readonly variables = variables;

    readonly pageState = store.layoutState;

    readonly routes = store.completeRouters;

    get menuActiveTextColor() {
        if (store.layoutState.sidebarTextTheme) {
            return store.layoutState.theme;
        } else {
            return this.variables.menuActiveText;
        }
    }

    get activeMenu() {
        const { meta, path } = this.$route;
        // 判断是否激活的菜单
        if (meta.activeMenu) {
            return meta.activeMenu;
        }
        return path;
    }

    // mounted() {
    //     console.log("variables", variables);
    // }
}
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
