<template>
    <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
        <slot />
    </a>
    <router-link v-else :to="to">
        <slot />
    </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import utils from "../../../utils";

@Component({})
export default class SidebarItemLink extends Vue {
    @Prop({ required: true }) private to!: string;

    private isExternal = utils.isExternal;
}
</script>
