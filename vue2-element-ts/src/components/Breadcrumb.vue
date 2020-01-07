<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
                <span v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1" class="no-redirect">{{ item.meta.title }}</span>
                <!-- <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a> -->
                <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { RouteRecord, Route } from "vue-router";
// import pathToRegexp from "path-to-regexp";

@Component({
    name: "Breadcrumb"
})
export default class extends Vue {
    private breadcrumbs: RouteRecord[] = [];

    @Watch("$route")
    private onRouteChange(route: Route) {
        // if you go to the redirect page, do not update the breadcrumbs
        if (route.path.startsWith("/redirect/")) {
            return;
        }
        this.getBreadcrumb();
    }

    created() {
        this.getBreadcrumb();
    }

    private getBreadcrumb() {
        let matched = this.$route.matched.filter(
            item => item.meta && item.meta.title
        );
        const first = matched[0];
        // if (!this.isDashboard(first)) {
        //     matched = [
        //         {
        //             path: "/dashboard",
        //             meta: { title: "dashboard" }
        //         } as RouteRecord
        //     ].concat(matched);
        // }
        this.breadcrumbs = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    }

    // private isDashboard(route: RouteRecord) {
    //     const name = route && route.name;
    //     if (!name) {
    //         return false;
    //     }
    //     return (
    //         name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
    //     );
    // }

    // 下面这两个方法是复制开源项目`vue-typescript-admin-template`的，会报错，所以对应的，
    // 上面`a`标签我换成了规范的`router-link`

    // private pathCompile(path: string) {
    //     To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    //     const { params } = this.$route;
    //     const toPath = pathToRegexp.compile(path);
    //     return toPath(params);
    // }

    // private handleLink(item: any) {
    //     console.log('handleLink', item);

    //     const { redirect, path } = item;
    //     if (redirect) {
    //         this.$router.push(redirect);
    //         return;
    //     }
    //     this.$router.push(this.pathCompile(path));
    // }
}
</script>

<style lang="scss" scoped>
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
