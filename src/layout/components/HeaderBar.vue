<template>
  <div class="the-layout-header">
    <div class="the-layout-navbar flex">
      <div :class="['fvc hamburger', { 'hamburger-active': layoutInfo.sidebarOpen }]" @click="onSwitch()">
        <svg-icon name="hamburger" />
      </div>
      <Breadcrumb class="f1" />
      <div class="user-info-box fvertical">
        <img class="avatar" :src="userInfo.avatar || defaultAvatar" >
        <span class="the-tag green mgr_10">{{ userInfo.name || userInfo.account || "用户未设置昵称" }}</span>
        <button class="logout fvertical" @click="onLogout()">
          <svg-icon name="exit" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
    <div class="the-layout-tags" v-if="layoutInfo.showTagsView">
      <Scrollbar>
        <router-link
          :class="['the-layout-tag', {'the-layout-tag-on': isActive(item)}]"
          v-for="(item, index) in layoutInfo.historyViews"
          :key="index + item.path"
          :to="{ path: item.path, query: item.query, params: item.params }"
        >
          <span>{{ item.meta.lang ? $language[item.meta.lang] : item.meta.title }}</span>
          <i class="close" @click.prevent.stop="onRemove(index)">-</i>
        </router-link>
      </Scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Breadcrumb from "./Breadcrumb.vue"
import Scrollbar from "@/components/Scrollbar/index.vue";
import store from "@/store";
import { HistoryViewsItem } from "@/types";
import { Route } from "vue-router";

@Component({
  name: "HeaderBar",
  components: {
    Breadcrumb,
    Scrollbar
  }
})
export default class HeaderBar extends Vue {
  userInfo = store.user.info;

  layoutInfo = store.layout.info;

  defaultAvatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";

  onSwitch() {
    this.layoutInfo.sidebarOpen = !this.layoutInfo.sidebarOpen;
  }

  onLogout() {
    const exit = () => {
      store.user.reset();
      // 清空历史记录，确保切换用户类型时缓存不存在的路由记录，没有用户类型权限时可以忽略
      this.layoutInfo.historyViews = [];

      // vue 2.x 做法退出登陆后，需要刷新页面，因为我们是通过`addRoutes`添加的，`router`没有`deleteRoutes`这个api
      // 所以清除`token`,清除`permissionList`等信息，刷新页面是最保险的。
      // 网上有另外一种方法是二次封装`addRoutes`去实现无刷新切换动态路由，我嫌麻烦就直接清空缓存信息并刷新实现
      location.reload();
    }
    // 是否为首页
    if (["/", "/home"].includes(this.$route.path)) {
      exit()
    } else {
      this.$router.push("/")
      exit()
    }

  }

  isActive(item: HistoryViewsItem) {
    const route = this.$route;
    return item.path === route.path && JSON.stringify(item.query) === JSON.stringify(route.query) && JSON.stringify(item.params) === JSON.stringify(route.params);
  }

  onRemove(index: number) {
    this.layoutInfo.historyViews.splice(index, 1);
  }

  @Watch("$route", { immediate: true })
  onRoute(route: Route) {
    const hasItem = this.layoutInfo.historyViews.some(item => this.isActive(item))
    if (!hasItem) {
      this.layoutInfo.historyViews.push({
        name: route.name as string,
        path: route.path,
        query: route.query,
        params: route.params,
        meta: route.meta as any
      })
    }
  }

}
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