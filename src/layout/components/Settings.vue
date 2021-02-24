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
                <el-switch v-model="pageState.showHistoryView" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>显示侧边栏 Logo</span>
                <el-switch v-model="pageState.showSidebarLogo" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>固定 Header</span>
                <el-switch v-model="pageState.fixedHeader" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>侧边栏文字主题色</span>
                <el-switch v-model="pageState.sidebarTextTheme" class="drawer-switch" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ThemePicker from "./ThemePicker.vue";
import store from "../../store";

@Component({
    components: {
        ThemePicker
    }
})
export default class Settings extends Vue {

    readonly pageState = store.layoutState;

    /**
     * 更新`css`样式
     * @description 这里我单独修改`switch`组件的样式，`vue-typescript-admin`原版是直接插入并修改整个UI库的样式，我觉得有点浪费资源，所以这里单独修改
     * @param value
     */
    updateCss(value: string) {
        const id = "the_switch_style"
        let label = (document.getElementById(id) as HTMLStyleElement);
        if (!label) {
            label = document.createElement("style");
            label.id = id;
            document.head.appendChild(label);
        }
        label.textContent = `.el-switch.is-checked .el-switch__core{border-color: ${value}; background-color: ${value};`;
    }

    themeChange(value: string) {
        if (this.pageState.theme != value) {
            this.pageState.theme = value;
            this.updateCss(value);
        }
    }

    mounted() {
        if (this.pageState.theme) {
            this.updateCss(this.pageState.theme);
        }
    }
}
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
