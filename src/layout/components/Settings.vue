<template>
    <div class="drawer-container">
        <div>
            <h3 class="drawer-title">系统布局配置</h3>

            <div class="drawer-item">
                <span>主题色</span>
                <ThemePicker style="float: right; height: 26px; margin: -3px 8px 0 0;" @change="themeChange" />
            </div>

            <div class="drawer-item">
                <span>显示历史记录列表</span>
                <el-switch v-model="layoutState.showHistoryView" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>显示侧边栏 Logo</span>
                <el-switch v-model="layoutState.showSidebarLogo" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>固定 Header</span>
                <el-switch v-model="layoutState.fixedHeader" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>侧边栏文字主题色</span>
                <el-switch v-model="layoutState.sidebarTextTheme" class="drawer-switch" />
            </div>
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
        const layoutState = store.layoutState;

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
            if (layoutState.theme !== store.defaultTheme) {
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
.drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
        margin-bottom: 12px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        line-height: 22px;
    }

    .drawer-item {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        padding: 12px 0;
    }

    .drawer-switch {
        float: right;
    }
}
</style>
