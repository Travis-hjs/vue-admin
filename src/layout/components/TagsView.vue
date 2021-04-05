<template>
    <div id="tags-view-container" class="tags-view-container">
        <ScrollPane class="tags-view-wrapper">
            <router-link
                v-for="tag in layoutState.historyViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="tag.path"
                tag="span"
                class="tags-view-item"
                @contextmenu.prevent.native="openMenu(tag, $event)"
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
import { Component, Vue, Watch } from "vue-property-decorator";
import ScrollPane from "./ScrollPane.vue";
import store from "../../store";
import { RouteItem } from "../../utils/interfaces";

@Component({
    name: "TagsView",
    components: {
        ScrollPane
    }
})
export default class TagsView extends Vue {
    readonly layoutState = store.layout.state;
    /** 是否隐藏右键菜单 */
    visible: boolean = false;
    /** 鼠标位置`Y` */
    top: number = 0;
    /** 鼠标位置`X` */
    left: number = 0;
    /** 选择路由对象 */
    selectedTag: RouteItem = {
        path: ""
    };

    @Watch("$route")
    onRouteChange() {
        this.addhistoryViews();
    }

    @Watch("visible")
    onVisibleChange(value: boolean) {
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
    isActive(item: RouteItem) {
        return item.path === this.$route.path;
    }

    /** 添加记录 */
    addhistoryViews() {
        const hasItem = this.layoutState.historyViews.some(item => item.path === this.$route.path);
        // console.log(hasItem, this.$route.path);
        if (!hasItem && !this.$route.meta.noCache) {
            this.layoutState.historyViews.push(this.$route);
        }
    }

    /**
     * 找到对应路由`item`索引
     * @param item item路由对象
     */
    findItemIndex(item: RouteItem) {
        let index = 0;
        const list = this.layoutState.historyViews;
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
    closeSelectedTag(item: RouteItem) {
        if (this.layoutState.historyViews.length == 0) return;
        const index = this.findItemIndex(item);
        this.layoutState.historyViews.splice(index, 1);
        if (this.isActive(item)) {
            if (this.layoutState.historyViews.length) {
                this.$router.push({ path: this.layoutState.historyViews[this.layoutState.historyViews.length - 1].path });
            }
        }
    }

    /** 关闭其他 */
    closeOthersTags() {
        if (this.selectedTag.path !== this.$route.path) {
            this.$router.push(this.selectedTag.path);
        }
        this.layoutState.historyViews = [this.selectedTag];
    }

    /** 关闭所有 */
    closeAllTags() {
        if (this.layoutState.historyViews.length > 1) {
            this.layoutState.historyViews = [];
            this.$router.push("/");
        }
    }

    /**
     * 右键打开菜单
     * @param item 路由对象
     * @param e 鼠标事件
     */
    openMenu(item: RouteItem, e: MouseEvent) {
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
    closeMenu() {
        this.visible = false;
    }

    // life cycle =========================================================

    mounted() {
        this.addhistoryViews();
    }
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.tags-view-container {
    height: $tagsViewHeight;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px $tagsViewShadowHeight 0 rgba(0, 0, 0, 0.12), 0 0 $tagsViewShadowHeight 0 rgba(0, 0, 0, 0.04);

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
