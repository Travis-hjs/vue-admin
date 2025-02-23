<template>
  <div class="the-layout-header">
    <div class="the-layout-navbar flex">
      <div :class="['fvc hamburger', { 'hamburger-actived': layoutInfo.showSidebar }]" @click="onSwitch()">
        <svg-icon name="hamburger" />
      </div>
      <BreadCrumb class="f1" />
      <div class="user-info-box f-vertical">
        <img class="avatar" :src="userInfo.avatar || defaultAvatar">
        <span class="the-tag green mgr-10">{{ userInfo.name || userInfo.account || "用户未设置昵称" }}</span>
        <button class="logout f-vertical" @click="onLogout()">
          <svg-icon name="exit" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
    <div class="the-layout-tag-box" v-if="layoutInfo.showTagList">
      <Scrollbar>
        <div class="the-layout-tags">
          <router-link
            v-for="(item, itemIndex) in layoutInfo.tagList"
            :class="['the-layout-tag', {'the-layout-tag-on': isActive(item)}]"
            :key="item.path + itemIndex"
            :to="{ path: item.path, query: item.query, params: item.params } as any"
            @contextmenu.prevent="openTagMenu($event, item)"
          >
            <span>{{ item.meta.title }}</span>
            <i class="close" @click.prevent.stop="onRemove(itemIndex)">-</i>
          </router-link>
        </div>
      </Scrollbar>
    </div>
    <div
      v-show="tagMenu.show"
      ref="tagMenuRef"
      class="the-layout-tag-menu"
      :style="{ left: tagMenu.left }"
    >
      <div
        v-for="opt in tagMenu.list"
        v-show="opt.show ? opt.show() : true"
        :key="opt.id"
        class="the-layout-tag-menu-item"
        @click="opt.click()"
      >
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/** 顶部栏组件 */
export default {
  name: "HeaderBar"
}
</script>
<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BreadCrumb from "./BreadCrumb.vue";
import { Scrollbar } from "@/components/Scrollbar";
import store from "@/store";
import { removeRoutes } from "@/router/permission";
import { copyText } from "@/utils";
import { message } from "@/utils/message";
import type { LayoutType } from "@/store/types";

const route = useRoute();
const router = useRouter();
const layoutInfo = store.layout.info;
const userInfo = store.user.info;

function onSwitch() {
  layoutInfo.showSidebar = !layoutInfo.showSidebar;
}

const defaultAvatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";

function onLogout() {
  store.user.reset();
  router.push("/login").then(() => {
    // 清空历史记录，确保切换用户类型时缓存不存在的路由记录，没有用户类型权限时可以忽略
    layoutInfo.tagList = [];

    // vue 2.x 做法退出登陆后，需要刷新页面，因为我们是通过`addRoutes`添加的，`router`没有`deleteRoutes`这个api
    // 所以清除`token`,清除`permissionList`等信息，刷新页面是最保险的。
    // 网上有另外一种方法是二次封装`addRoutes`去实现无刷新切换动态路由，我嫌麻烦就直接清空缓存信息并刷新实现
    // location.reload();

    // 现在不需要了，vue 3.x 之后路由增加了删除路由方法
    removeRoutes();
  })
}

function isActive(item: LayoutType.Tag) {
  return item.path === route.path && JSON.stringify(item.query) === JSON.stringify(route.query) && JSON.stringify(item.params) === JSON.stringify(route.params);
}

function onRemove(index: number) {
  if (isActive(layoutInfo.tagList[index])) {
    const target = index > 0 ? index - 1 : index + 1;
    const tag = layoutInfo.tagList[target];
    router.push({
      path: tag.path,
      query: tag.query,
      params: tag.params
    } as any);
  }
  layoutInfo.tagList.splice(index, 1);
}

// layoutInfo.tagList = [];
watch(
  () => route.path,
  function () {
    // console.log("route >>", route);
    const hasItem = layoutInfo.tagList.some(item => isActive(item))
    if (!hasItem) {
      layoutInfo.tagList.push({
        name: route.name as string,
        path: route.path,
        query: route.query,
        params: route.params,
        meta: route.meta as any
      })
    }
  },
  {
    immediate: true
  }
)

const tagMenu = reactive({
  show: false,
  list: [
    {
      label: "关闭其他",
      id: 1,
      click() {
        tagMenu.show = false;
        const tag = tagMenu.current!;
        if (!isActive(tag)) {
          router.push(tag.path).then(() => {
            layoutInfo.tagList = [tag];
          });
        } else {
          layoutInfo.tagList = [tag];
        }
      },
      show: () => layoutInfo.tagList.length > 1
    },
    {
      label: "在新标签打开",
      id: 2,
      click() {
        tagMenu.show = false;
        const link = location.href.split("#");
        window.open(`${link[0]}#${tagMenu.current!.path}`, "_blank");
      },
    },
    {
      label: "复制当前信息",
      id: 3,
      click() {
        tagMenu.show = false;
        const tag = tagMenu.current;
        copyText(JSON.stringify(tag, null, 4), () => message.success("复制成功！"));
      },
    }
  ],
  left: "",
  current: undefined as undefined | LayoutType.Tag
});

const tagMenuRef = ref<HTMLElement>();

function openTagMenu(e: PointerEvent, item: LayoutType.Tag) {
  tagMenu.show = true;
  tagMenu.current = item;
  // nextTick 之后才能获取到真实的节点宽度
  nextTick(() => {
    let left = e.x;
    const boxWidth = parseFloat(getComputedStyle(tagMenuRef.value!).width);
    const maxWidth = document.body.clientWidth - boxWidth;
    if (left > maxWidth) {
      left = maxWidth;
    }
    tagMenu.left = `${left}px`;
  });
}

function onTagMenuMask(e: MouseEvent) {
  const node = e.target as HTMLElement;
  if (tagMenu.show && !tagMenuRef.value!.contains(node)) {
    tagMenu.show = false;
  }
}

onMounted(function () {
  document.addEventListener("click", onTagMenuMask);
});

onUnmounted(function () {
  document.removeEventListener("click", onTagMenuMask);
});
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
    .svg-icon {
      margin-right: 4px;
    }
  }
}
</style>