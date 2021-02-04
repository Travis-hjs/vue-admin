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
import { defineComponent, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: "Breadcrumb",
    setup() {
        const route = useRoute();
        /** 路由列表 */
        let list = ref<Array<{ path: string, meta: any }>>([]);
        
        function updateList() {
            const matched = route.matched.filter(item => item.meta && item.meta.title).map(item => {
                return {
                    path: item.path,
                    meta: {...item.meta}
                }
            });
            list.value = matched;
        }

        // 监听路由变动 注意这里如果使用`watch`来监听路由控制台会出现警告，打包之后会直接卡死，但不报错
        // watch(route, function(res) {
        //     // 如果转到重定向页面，就不更新面包屑
        //     if (res.path.startsWith("/redirect/")) return;
        //     updateList();
        // });
        
        // 所有响应式数据变动
        watchEffect(function() {
            // console.log(route.path);
            if (route.path.startsWith("/redirect/")) return;
            updateList();
        })

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
