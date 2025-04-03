<script lang="ts">
/** 历史记录标签 */
export default {
  name: "TagList"
}
</script>
<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { Scrollbar } from "@/components/Scrollbar";
import { copyText } from "@/utils";
import { message } from "@/utils/message";
import store from "@/store";
import { useLayoutRoute } from "./hooks";
import type { LayoutType } from "@/store/types";

const layoutInfo = store.layout.info;
const { route, router, isActive } = useLayoutRoute();

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
  left: "",
});

const tagData = {
  list: [
    {
      label: "关闭其他",
      id: 1,
      click() {
        tagMenu.show = false;
        const tag = tagData.current!;
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
        window.open(`${link[0]}#${tagData.current!.path}`, "_blank");
      },
    },
    {
      label: "复制当前信息",
      id: 3,
      click() {
        tagMenu.show = false;
        const tag = tagData.current;
        copyText(JSON.stringify(tag, null, 4), () => message.success("复制成功！"));
      },
    }
  ],
  current: undefined as undefined | LayoutType.Tag
}

const tagMenuRef = ref<HTMLElement>();

function openTagMenu(e: PointerEvent, item: LayoutType.Tag) {
  tagMenu.show = true;
  tagData.current = item;
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
<template>
  <div class="the-layout-tag-box">
    <Scrollbar>
      <div class="the-layout-tags">
        <router-link
          v-for="(item, itemIndex) in layoutInfo.tagList"
          :class="['the-layout-tag', {'is-active': isActive(item)}]"
          :key="item.path + itemIndex"
          :to="({ path: item.path, query: item.query, params: item.params } as any)"
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
      v-for="opt in tagData.list"
      v-show="opt.show ? opt.show() : true"
      :key="opt.id"
      class="the-layout-tag-menu-item"
      @click="opt.click()"
    >
      {{ opt.label }}
    </div>
  </div>
</template>
