<template>
    <div class="tags-view-container" ref="el">
        <ScrollPane ref="scrollPane" class="tags-view-wrapper">
            <router-link
                v-for="tag in layoutState.historyViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="tag.path"
                tag="span"
                class="tags-view-item"
                @contextmenu.prevent="openMenu(tag, $event)"
            >
                {{ tag.meta.title }}
                <span v-show="layoutState.historyViews.length > 1" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
            </router-link>
        </ScrollPane>
        <ul v-show="visible" :style="{left: left + 'px', top: top+'px'}" class="contextmenu">
            <li @click="closeSelectedTag(selectedTag)">关闭</li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags">关闭所有</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "../../router";
import ScrollPane from "./ScrollPane.vue";
import store from "../../store";
import { RouteItem } from "../../utils/interfaces";

export default defineComponent({
    name: "TagsView",
    components: {
        ScrollPane
    },
    setup(props, context) {
        const route = useRoute();
        const layoutState = store.layoutState;
        /** 是否隐藏右键菜单 */
        let visible = ref(false);
        /** 鼠标位置`Y` */
        let top = ref(0);
        /** 鼠标位置`X` */
        let left = ref(0);
        /** 选择路由对象 */
        let selectedTag = reactive({
            path: ""
        } as RouteItem);

        /** 添加记录 */
        function addhistoryViews() {
            const hasItem = layoutState.historyViews.some(item => item.path === route.path);
            // console.log(hasItem, route.path);
            if (!hasItem && !route.meta.noCache) {
                // 参考`store.saveLayout`需要的字段
                layoutState.historyViews.push({
                    name: route.name,
                    meta: route.meta,
                    path: route.path
                } as any);
            }
        }

        /** 关闭窗口 */
        function closeMenu() {
            visible.value = false;
        }

        watch(route, addhistoryViews)

        watch(visible, function(value) {
            if (value) {
            document.body.addEventListener("click", closeMenu);
        } else {
            document.body.removeEventListener("click", closeMenu);
        }
        })

        /**
         * 是否高亮
         * @param item item路由对象
         */
        function isActive(item: RouteItem) {
            return item.path === route.path;
        }

        /**
         * 找到对应路由`item`索引
         * @param item item路由对象
         */
        function findItemIndex(item: RouteItem) {
            let index = 0;
            const list = layoutState.historyViews;
            for (let i = 0; i < list.length; i++) {
                const obj = list[i];
                if (obj.path === item.path) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        
        /**
         * 关闭选中
         * @param item item路由对象
         */
        function closeSelectedTag(item: RouteItem) {
            if (layoutState.historyViews.length == 0) return;
            const index = findItemIndex(item);
            layoutState.historyViews.splice(index, 1);
            if (isActive(item)) {
                if (layoutState.historyViews.length) {
                    router.push({ path: layoutState.historyViews[layoutState.historyViews.length - 1].path });
                }
            }
        }

        /** 关闭其他 */
        function closeOthersTags() {
            if (selectedTag.path !== route.path) {
                router.push(selectedTag.path);
            }
            layoutState.historyViews = [selectedTag];
        }

        /** 关闭所有 */
        function closeAllTags() {
            if (layoutState.historyViews.length > 1) {
                layoutState.historyViews = [];
                router.push('/');
            }
        }

        /** 当前组件节点 */
        const el = ref<HTMLElement>(null as any);

        /**
         * 右键打开菜单
         * @param item 路由对象
         * @param e 鼠标事件
         */
        function openMenu(item: RouteItem, e: MouseEvent) {
            const menuMinWidth = 105;
            const offsetLeft = el.value.getBoundingClientRect().left; // container margin left
            const offsetWidth = el.value.offsetWidth; // container width
            const maxLeft = offsetWidth - menuMinWidth; // left boundary
            const _left = e.clientX - offsetLeft + 15; // 15: margin right
            if (_left > maxLeft) {
                left.value = maxLeft;
            } else {
                left.value = _left;
            }
            top.value = e.clientY;
            visible.value = true;
            selectedTag = item;
        }


        onMounted(function() {
            addhistoryViews();
        })

        return {
            layoutState,
            visible,
            top,
            left,
            selectedTag,
            isActive,
            closeSelectedTag,
            closeOthersTags,
            closeAllTags,
            openMenu,
            el
        }
    }
})
</script>

<style lang="scss">
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-wrapper {
        padding-top: 4px;
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 24px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;

            &:first-of-type {
                margin-left: 15px;
            }

            &:last-of-type {
                margin-right: 15px;
            }

            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;

                &::before {
                    content: "";
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 2px;
                }
            }
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                transform-origin: 100% 50%;

                &:before {
                    transform: scale(0.6);
                    display: inline-block;
                    vertical-align: -3px;
                }

                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }
}
</style>
