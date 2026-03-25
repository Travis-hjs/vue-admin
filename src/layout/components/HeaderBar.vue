<script lang="ts">
/** 顶部栏组件 */
export default {
  name: "HeaderBar"
}
</script>
<script lang="ts" setup>
import BreadCrumb from "./BreadCrumb.vue";
import store from "@/store";
import TagList from "./TagList.vue";
import { useLayoutRoute } from "./hooks";
import { Icon } from "@/components/Icon";

const layoutInfo = store.layout.info;
const userInfo = store.user.info;
const { router } = useLayoutRoute();

function onSwitch() {
  layoutInfo.showSidebar = !layoutInfo.showSidebar;
}

const defaultAvatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";

function onLogout() {
  store.layout.isLogout = true;
  store.user.reset();
  router.push("/login").then(() => {
    // 清空历史记录，确保切换用户类型时缓存不存在的路由记录，没有用户类型权限时可以忽略
    layoutInfo.tagList = [];
    // 可以直接刷新重置
    location.reload();
  });
}

</script>
<style lang="scss">

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
    display: inline-block;
  }

  .logout {
    border: none;
    outline: none;
    background-color: transparent;
    padding: 6px 10px 6px 4px;
    line-height: 1;
    @include font();
    transition: var(--transition);
  
    &:hover {
      color: var(--blue);
    }
  }
}
</style>
<template>
  <div class="the-layout-header">
    <div class="the-layout-navbar flex">
      <div :class="['fvc menu-fold', { 'menu-fold-actived': layoutInfo.showSidebar }]" @click="onSwitch()">
        <Icon name="tdesign:menu-fold" size="24px" color="#555" />
      </div>
      <BreadCrumb class="f1" />
      <div class="user-info-box f-vertical">
        <img class="avatar" :src="userInfo.avatar || defaultAvatar">
        <span class="the-tag green mr-[10px]">{{ userInfo.name || userInfo.account || "用户未设置昵称" }}</span>
        <button class="logout f-vertical" @click="onLogout()">
          <Icon name="tdesign:logout" class="mr-[4px]" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
    <TagList v-if="layoutInfo.showTagList" />
  </div>
</template>
