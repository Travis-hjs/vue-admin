<template>
    <div :class="{'has-logo': pageState.showSidebarLogo}">
        <sidebar-logo v-if="pageState.showSidebarLogo" :collapse="!pageState.sidebarOpen" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
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
                <sidebar-item
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
import { base } from "../../../router"
import SidebarItem from "./SidebarItem.vue";
import SidebarLogo from "./SidebarLogo.vue";
import store from "../../../modules/store";

@Component({
    name: "SideBar",
    components: {
        SidebarItem,
        SidebarLogo
    }
})
export default class SideBar extends Vue {

    private variables = {
        menuActiveText: '#409EFF',
        menuBg: '#304156',
        menuText: '#bfcbd9'
    }

    private pageState = store.layoutState;

    get routes() {
        return store.completeRouters;
    }

    get menuActiveTextColor() {
        if (store.layoutState.sidebarTextTheme) {
            return store.layoutState.theme;
        } else {
            return this.variables.menuActiveText;
        }
    }

    get activeMenu() {
        const route = this.$route;
        const { meta, path } = route;
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
            return meta.activeMenu;
        }
        return path;
    }

}
</script>

<style lang="scss">
.sidebar-container {
    // reset element-ui css
    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
        overflow-x: hidden !important;
    }

    .el-scrollbar__view {
        height: 100%;
    }

    .el-scrollbar__bar {
        &.is-vertical {
            right: 0px;
        }

        &.is-horizontal {
            display: none;
        }
    }
}
</style>

<style lang="scss" scoped>
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
</style>
