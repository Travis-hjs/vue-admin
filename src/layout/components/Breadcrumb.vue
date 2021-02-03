<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in list" :key="item.path">
                <span v-if="index === list.length - 1" class="no-redirect">{{ item.meta.title }}</span>
                <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from "vue";
import { useRoute, RouteLocationMatched } from "vue-router";

export default defineComponent({
    name: "Breadcrumb",
    setup() {
        const route = useRoute();
        /** 路由列表 */
        let list = ref([] as Array<RouteLocationMatched>);
        
        function updateList() {
            const matched = route.matched.filter(item => item.meta && item.meta.title);
            // console.log(matched);
            list.value = matched; // matched.filter(item => item.meta && item.meta.title);
        }

        // 监听路由变动
        watch(route, function(res) {
            // 如果转到重定向页面，就不更新面包屑
            if (res.path.startsWith("/redirect/")) return;
            updateList();
        });

        updateList();

        return {
            list
        }
    }
})
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
