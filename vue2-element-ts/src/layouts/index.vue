<template>
    <div class="layout-wrap">
        <sidebar></sidebar>
        <div class="main-box">
            <nav-top></nav-top>
            <!-- <route-view></route-view> -->
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Sidebar from "./components/Sidebar.vue";
import NavTop from "./components/NavTop.vue";

@Component({
    components: {
        sidebar: Sidebar,
        'nav-top': NavTop
    }
})
export default class Layout extends Vue {

    mounted() {
        // console.log(this.navList);
    }
}
</script>

<style lang="scss">
.layout-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    .main-box {
        flex: 1;
        height: 100%;
        overflow-y: auto;
    }
}
</style>