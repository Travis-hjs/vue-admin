<template>
    <div class="menu-1">
        <el-alert :closable="false" :title="content" type="success" effect="dark" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        const content = "菜单 2-1";
        return {
            content
        }
    }
})
</script>

<style>

</style>