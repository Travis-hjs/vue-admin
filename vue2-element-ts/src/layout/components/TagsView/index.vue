<template>
    <div id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
            <router-link
                v-for="tag in pageState.cachedViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
                tag="span"
                class="tags-view-item"
                @contextmenu.prevent.native="openMenu(tag, $event)"
            >
                {{ tag.meta.title }}
                <span v-show="pageState.cachedViews.length > 1" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{left: left + 'px', top: top+'px'}" class="contextmenu">
            <li @click="closeSelectedTag(selectedTag)">关闭</li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags">关闭所有</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import VueRouter, { Route, RouteRecord, RouteConfig } from "vue-router";
import ScrollPane from "./ScrollPane.vue";
import store from "../../../modules/store";

@Component({
    name: "TagsView",
    components: {
        ScrollPane
    }
})
export default class TagsView extends Vue {
    /** 是否隐藏右键菜单 */
    private visible: boolean = false;
    /** 鼠标位置`Y` */
    private top: number = 0;
    /** 鼠标位置`X` */
    private left: number = 0;
    /** 选择路由对象 */
    private selectedTag: any = {
        path: ''
    };
    
    private pageState = store.layoutState;

    @Watch("$route")
    private onRouteChange() {
        this.addCachedViews();
    }

    @Watch("visible")
    private onVisibleChange(value: boolean) {
        if (value) {
            document.body.addEventListener("click", this.closeMenu);
        } else {
            document.body.removeEventListener("click", this.closeMenu);
        }
    }

    // methods ===========================================================

    /**
     * 是否高亮
     * @param item item路由对象
     */
    private isActive(item: Route) {
        return item.path === this.$route.path;
    }

    /** 添加记录 */
    private addCachedViews() {
        const hasItem = this.pageState.cachedViews.some(item => item.path === this.$route.path);
        // console.log(hasItem, this.$route.path);
        if (!hasItem) {
            this.pageState.cachedViews.push(this.$route);
        }
    }

    /**
     * 找到对应路由`item`索引
     * @param item item路由对象
     */
    private findItemIndex(item: Route) {
        let index = 0;
        const list = this.pageState.cachedViews;
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
    private closeSelectedTag(item: Route) {
        if (this.pageState.cachedViews.length == 0) return;
        const index = this.findItemIndex(item);
        this.pageState.cachedViews.splice(index, 1);
        if (this.isActive(item)) {
            if (this.pageState.cachedViews.length) {
                this.$router.push({ path: this.pageState.cachedViews[this.pageState.cachedViews.length - 1].path });
            }
        }
    }

    /** 关闭其他 */
    private closeOthersTags() {
        if (this.selectedTag.path !== this.$route.path) {
            this.$router.push(this.selectedTag.path);
        }
        this.pageState.cachedViews = [this.selectedTag];
    }

    /** 关闭所有 */
    private closeAllTags() {
        if (this.pageState.cachedViews.length > 1) {
            this.pageState.cachedViews = [];
            this.$router.push('/');
        }
    }

    /**
     * 右键打开菜单
     * @param item 路由对象
     * @param e 鼠标事件
     */
    private openMenu(item: Route, e: MouseEvent) {
        const menuMinWidth = 105;
        const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
        const offsetWidth = (this.$el as HTMLElement).offsetWidth; // container width
        const maxLeft = offsetWidth - menuMinWidth; // left boundary
        const left = e.clientX - offsetLeft + 15; // 15: margin right
        if (left > maxLeft) {
            this.left = maxLeft;
        } else {
            this.left = left;
        }
        this.top = e.clientY;
        this.visible = true;
        this.selectedTag = item;
    }

    /** 关闭窗口 */
    private closeMenu() {
        this.visible = false;
    }

    // life cycle =========================================================

    mounted() {
        this.addCachedViews();
    }
}
</script>

<style lang="scss">
// Reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        line-height: 24px !important;
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
</style>
<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;

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
