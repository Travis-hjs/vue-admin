<template>
    <div class="home">
        <HelloWorld :msg="content" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";

export default defineComponent({
    components: {
        HelloWorld
    },
    setup() {
        const content = "首页";
        return {
            content
        }
    }
})
</script>