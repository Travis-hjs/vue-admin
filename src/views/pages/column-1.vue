<template>
    <div class="column-1">
        <el-alert :closable="false" :title="content" type="success" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        const content = "栏目-1";
        return {
            content
        }
    }
})
</script>