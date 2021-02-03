<template>
    <el-color-picker
        v-model="theme"
        :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d']"
        @change="onChange()"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
    />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import store from "../../store";
const defaultColor = "#409EFF";

export default defineComponent({
    name: "ThemePicker",
    setup(props, context) {
        
        let theme = ref(store.layoutState.theme || defaultColor);

        function onChange() {
            context.emit("change", theme.value);
        }

        return {
            theme,
            onChange
        }
    }
})
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
