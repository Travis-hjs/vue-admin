<template>
    <el-color-picker
        v-model="theme"
        :predefine="colors"
        @change="onChange()"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
    />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "../../store";

@Component({})
export default class ThemePicker extends Vue {

    theme = store.layout.state.theme;

    colors = [store.layout.defaultTheme, "#304156","#212121","#11a983", "#13c2c2", "#409EFF", "#6959CD", "#f5222d"];

    onChange() {
        this.$emit("change", this.theme);
    }
}
</script>

<style lang="scss">
.theme-message,
.theme-picker-dropdown {
    z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
}
</style>
