<template>
    <div class="the-layout-header">
        <div class="the-layout-navbar flex">
            <div :class="['flex fcenter fvertical hamburger', { 'hamburger-active': layoutInfo.sidebarOpen }]" @click="onSwitch()">
                <svg-icon name="hamburger" />
            </div>
            <Breadcrumb class="f1" />
            <div class="user-info-box flex fvertical">
                <img class="avatar" :src="userInfo.avatar || defaultAvatar" >
                <span class="username mgr_10">{{ userInfo.name || user.account }}</span>
                <button class="logout flex fvertical" @click="onLogout()">
                    <svg-icon name="exit" />
                    <span>退出登录</span>
                </button>
            </div>
        </div>
        <div class="the-layout-tags">

        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "./Breadcrumb.vue";
import store from "@/store";
import { removeRoutes } from "@/router/permission";

export default defineComponent({
    name: "HeaderBar",
    components: {
        Breadcrumb
    },
    setup(props, context) {
        const router = useRouter();
        const layoutInfo = store.layout.info;
        const userInfo = store.user.info;

        function onSwitch() {
            layoutInfo.sidebarOpen = !layoutInfo.sidebarOpen;
        }

        const defaultAvatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";
        
        function onLogout() {
            store.user.reset();
            router.push("/login").then(() => {
                // 清空历史记录，确保切换用户类型时缓存不存在的路由记录，没有用户类型权限时可以忽略
                layoutInfo.historyViews = [];

                // vue 2.x 做法退出登陆后，需要刷新页面，因为我们是通过`addRoutes`添加的，`router`没有`deleteRoutes`这个api
                // 所以清除`token`,清除`permissionList`等信息，刷新页面是最保险的。
                // 网上有另外一种方法是二次封装`addRoutes`去实现无刷新切换动态路由，我嫌麻烦就直接清空缓存信息并刷新实现
                // location.reload();

                // 现在不需要了，vue 3.x 之后路由增加了删除路由方法
                removeRoutes();
            })
        }

        return {
            defaultAvatar,
            layoutInfo,
            userInfo,
            onSwitch,
            onLogout,
        }
    }
})
</script>
<style lang="scss">
@import "@/styles/variables.scss";
@mixin font {
    font-size: 15px;
    color: #555;
}
.user-info-box {
    @include font();
    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 10px;
    }
    .username {
        padding: 6px 8px;
        color: #13ce66;
        background-color: #e7faf0;
        line-height: 1;
        // border-radius: 2px;
    }
    .logout {
        border: none;
        outline: none;
        background-color: transparent;
        padding: 6px 10px 6px 4px;
        line-height: 1;
        @include font();
        @include moveTime();
        &:hover {
            color: $theme;
        }
        .svg-icon {
            margin-right: 4px;
        }
    }
}
</style>