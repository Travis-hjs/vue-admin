<template>
    <div class="drawer_content">
        <h3 class="drawer_title">系统布局配置</h3>
        <el-divider></el-divider>
        <div class="drawer_item">
            <span>主题色</span>
            <ThemePicker style="float: right; height: 26px; margin: -3px 8px 0 0;" @change="themeChange" />
        </div>
        <div class="drawer_item">
            <span>显示历史记录列表</span>
            <el-switch v-model="layoutState.showHistoryView" class="drawer-switch" />
        </div>
        <div class="drawer_item">
            <span>显示侧边栏 Logo</span>
            <el-switch v-model="layoutState.showSidebarLogo" class="drawer-switch" />
        </div>
        <div class="drawer_item">
            <span>固定栏目头部</span>
            <el-switch v-model="layoutState.fixedHeader" class="drawer-switch" />
        </div>
        <div class="drawer_item">
            <span>侧边栏文字应用主题色</span>
            <el-switch v-model="layoutState.sidebarTextTheme" class="drawer-switch" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import ThemePicker from "./ThemePicker.vue";
import store from "../../store";
import { themeChangeAsync } from "../theme";

export default defineComponent({
    name: "Settings",
    components: {
        ThemePicker
    },
    setup(props, context) {
        const layoutState = store.layout.state;

        async function updateCss(value: string) {
            await themeChangeAsync(value);
            layoutState.theme = value;
        }

        function themeChange(value: string) {
            if (layoutState.theme != value) {
                layoutState.theme = value;
                updateCss(value);
            }
        }

        onMounted(function() {
            if (layoutState.theme !== store.layout.defaultTheme) {
                updateCss(layoutState.theme);
            }
        })

        return {
            layoutState,
            themeChange
        }
    }
})
</script>

<style lang="scss">
.drawer_content {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    .drawer_title {
        margin-bottom: 12px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 15px;
        line-height: 22px;
    }
    .drawer_item {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        padding: 12px 0;
    }
    .drawer-switch {
        float: right;
    }
}
</style>
