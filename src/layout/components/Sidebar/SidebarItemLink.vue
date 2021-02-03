<template>
    <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
        <slot />
    </a>
    <router-link v-else :to="to">
        <slot />
    </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import utils from "../../../utils";

export default defineComponent({
    name: "SidebarItemLink",
    props: {
        to: {
            type: String,
            required: true
        }
    },
    setup() {
        return {
            isExternal: utils.isExternal
        }
    }
})
</script>
