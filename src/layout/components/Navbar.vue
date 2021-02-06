<template>
    <div class="navbar">
        <Hamburger :is-active="layoutState.sidebarOpen" class="hamburger-container" @toggleClick="toggleSideBar()" />
        <Breadcrumb class="breadcrumb-container" />
        <div class="right-menu">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
                    <i class="el-icon-caret-bottom" />
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <router-link to="/profile/">
                            <el-dropdown-item>个人中心</el-dropdown-item>
                        </router-link>
                        <router-link to="/">
                            <el-dropdown-item>首页</el-dropdown-item>
                        </router-link>
                        <a target="_blank" href="https://github.com/Hansen-hjs/vue-admin">
                            <el-dropdown-item>项目地址</el-dropdown-item>
                        </a>
                        <el-dropdown-item divided>
                            <div @click="logout()">退出登录</div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Hamburger from "./Hamburger.vue";
import Breadcrumb from "./Breadcrumb.vue";
import store from "../../store";
import router from "../../router";
// import { removeRoutes } from "../../router/permission";
// 不知道为什么使用`import { removeRoutes } from "../../router/permission"`;
// 会导致`permission.ts`里面`router`为`undefined`，所以暂时不使用导出方式使用，改用下面`require`调用，之后找到解决方法再改回来

export default defineComponent({
    name: "Navbar",
    components: {
        Hamburger,
        Breadcrumb,
    },
    setup() {
        const { removeRoutes } = require("@/router/permission");
        const avatar = ref("https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
        const layoutState = store.layoutState;

        function toggleSideBar() {
            layoutState.sidebarOpen = !layoutState.sidebarOpen;
        }

        function logout() {
            store.removeUserState();
            // 清空历史记录，确保切换用户类型时缓存不存在的路由记录，没有用户类型权限时可以忽略
            router.push("/login").then(() => {
                layoutState.historyViews = [];

                // vue 2.x 做法退出登陆后，需要刷新页面，因为我们是通过`addRoutes`添加的，`router`没有`deleteRoutes`这个api
                // 所以清除`token`,清除`permissionList`等信息，刷新页面是最保险的。
                // 网上有另外一种方法是二次封装`addRoutes`去实现无刷新切换动态路由，我嫌麻烦就直接清空缓存信息并刷新实现
                // location.reload();

                // 现在不需要了，vue 3.x 之后路由增加了删除路由方法
                removeRoutes();
            })
        }

        return {
            layoutState,
            avatar,
            toggleSideBar,
            logout
        }
    }
})

</script>

<style lang="scss">
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        display: flex;
        align-items: center;
        height: 100%;
        float: left;
        padding: 0 15px;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.08);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        
        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
