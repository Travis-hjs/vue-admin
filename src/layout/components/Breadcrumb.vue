<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
                <span v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1" class="no-redirect">{{ item.meta.title }}</span>
                <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { RouteRecord, Route } from "vue-router";

@Component({})
export default class Breadcrumb extends Vue {
    breadcrumbs: Array<RouteRecord> = [];

    @Watch("$route")
    onRouteChange(route: Route) {
        // 如果转到重定向页面，就不更新面包屑
        if (route.path.startsWith("/redirect/")) return;
        this.getBreadcrumb();
    }

    getBreadcrumb() {
        const matched = this.$route.matched.filter(item => item.meta && item.meta.title);
        this.breadcrumbs = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    }
    
    created() {
        this.getBreadcrumb();
    }

}
</script>

<style lang="scss">
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
    font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
