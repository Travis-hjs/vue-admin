<template>
    <div class="menu-2">
        <el-alert :closable="false" :title="content" type="info" effect="dark" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        const content = "菜单 2-2";
        return {
            content
        }
    }
})
</script>

<style>

</style>