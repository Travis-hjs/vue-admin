<template>
    <div class="layout-breadcrumb flex fvertical">
        <transition-group name="breadcrumb">
            <span :class="['layout-breadcrumb-item', {'last': index === list.length - 1}]" v-for="(item, index) in list" :key="item.path">
                <i class="separator" v-if="index > 0">/</i>
                <a href="javascript:void(0)" v-if="index === list.length - 1">{{ item.meta.title }}</a>
                <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
            </span>
        </transition-group>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

@Component({
    name: "Breadcrumb",
})
export default class Breadcrumb extends Vue {
    list: Array<{ path: string, meta: any }> = [];

    @Watch("$route")
    onRoute(route: Route) {
        // 如果转到重定向页面，就不更新面包屑
        if (route.path.startsWith("/redirect/")) return;
        this.updateList();
    }

    updateList() {
        const matched = this.$route.matched.filter(item => item.meta && item.meta.title).map(item => {
            return {
                path: item.path,
                meta: {...item.meta}
            }
        });
        this.list = matched;
    }

    created() {
        this.updateList();
    }
}
</script>
