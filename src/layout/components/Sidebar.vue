<template>
    <div class="the-layout-sidebar">
        <Scrollbar :clickUpdateDelay="300" :thumbSize="10">
            <transition name="fade">
                <div class="the-logo-box" v-if="layoutInfo.showSidebarLogo">
                    <router-link class="the-logo-link flex fvertical fcenter" to="/">
                        <img class="the-logo" :src="info.logo" />
                        <h1 class="the-logo-title ellipsis">{{ info.title }}</h1>
                    </router-link>
                </div>
            </transition>
            <Menu :mergeOnlyOneChild="true" :onlyMergeFirst="true" />
        </Scrollbar>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Scrollbar from "@/components/Scrollbar/index.vue";
import Menu from "./Menu.vue";
import store from "@/store";

@Component({
    name: "Sidebar",
    components: {
        Scrollbar,
        Menu
    }
})
export default class Sidebar extends Vue {
    layoutInfo = store.layout.info;

    info = store.projectInfo;
}
</script>
