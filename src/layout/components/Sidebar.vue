<template>
    <div class="the-layout-sidebar">
        <Scrollbar :vertical="true" :clickUpdateDelay="300" :thumbSize="10">
            <Menu :mergeOnlyOneChild="true" :onlyMergeFirst="true" />
        </Scrollbar>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Menu from "./Menu.vue";
import Scrollbar from "@/components/Scrollbar/index.vue";

export default defineComponent({
    name: "Sidebar",
    components: {
        Menu,
        Scrollbar
    }
})
</script>
