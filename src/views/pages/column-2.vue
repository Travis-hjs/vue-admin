<template>
    <div class="column-2">
        <el-alert :closable="false" :title="content" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        const content = "栏目-2";
        return {
            content
        }
    }
})
</script>