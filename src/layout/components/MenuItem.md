## 备份文件

```html
<template>
    <div class="the-layout-menu" ref="menuBox">
        <button
            :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : isActive(info.path)}]"
            :style="titleStyle"
            @click="switchClose()"
            v-if="hasChidren(info)"
        >
            <span class="f1 ellipsis">{{ info.meta.title }}</span>
            <i class="the-layout-menu-arrow"></i>
        </button>
        <template v-else>
            <a
                :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : isActive(info.path)}]"
                :href="info.link"
                target="_blank"
                :style="titleStyle"
                v-if="info.link"
            >
                <span class="f1 ellipsis">{{ info.meta.title }}</span>
            </a>
            <router-link
                :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : isActive(info.path)}]"
                :to="info.path"
                :style="titleStyle"
                v-else
            >
                <span class="f1 ellipsis">{{ info.meta.title }}</span>
            </router-link>
        </template>
        <div
            :class="['the-layout-menu-list', { 'the-layout-menu-list-close': !open }]"
            :style="listStyle"
            v-if="info.children && info.children.length > 0"
        >
            <div v-for="(item) in info.children" :key="item.path">
                <MenuItem
                    :info="item"
                    v-if="hasChidren(item)"
                    :level="level + 1"
                    @change="updateListHeight"
                    @children-open="onChildrenOpen"
                    ref="menuChildren"
                />
                <template v-else>
                    <a
                        :class="['the-layout-menu-item flex fvertical', {'the-layout-menu-on' : isActive(item.path)}]"
                        :href="item.link"
                        target="_blank"
                        :style="itemStyle"
                        v-if="item.link"
                    >
                        <span class="ellipsis">{{ item.meta.title }}</span>
                    </a>
                    <router-link
                        :class="['the-layout-menu-item flex fvertical', {'the-layout-menu-on' : isActive(item.path)}]"
                        :to="item.path"
                        :style="itemStyle"
                        v-else
                    >
                        <span class="ellipsis">{{ item.meta.title }}</span>
                    </router-link>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { RouteItem } from "@/types";

/** 当前组件`class`名 */
const menuClassName = "the-layout-menu";
/** 菜单列表`class`名 */
const listClassName = "the-layout-menu-list";
/** 菜单列表关闭`class`名 */
const listColseClassName = "the-layout-menu-list-close";

const MenuItem = defineComponent({
    name: "MenuItem",
    props: {
        level: {
            type: Number,
            default: 1
        },
        info: {
            type: Object as PropType<RouteItem>,
            default: () => ({
                meta: {
                    title: '-'
                }
            })
        },
    },
    setup(props, context) {
        const route = useRoute();

        /**
         * 是否有下级菜单
         * @param item
         */
        function hasChidren(item: RouteItem) {
            return item.children && item.children.length > 0;
        }

        const titleStyle = reactive({
            paddingLeft: ""
        })

        const itemStyle = reactive({
            paddingLeft: ""
        })
        
        const listStyle = reactive({
            height: ""
        })
        
        /** 当前菜单列表展开高度 */
        const maxListHeight = ref(0);

        /**
         * 获取列表展开宽度
         * @param el 
         */
        function getListHeight(el: HTMLElement) {
            const listBox = el.querySelector(`.${listClassName}`);
            let height = 0;
            // && !listBox.classList.contains(listColseClassName)
            if (listBox) {
                const child = listBox.children;
                if (child) {
                    for (let i = 0; i < child.length; i++) {
                        const item = child[i];
                        // const box = item.querySelector(`.${menuClassName}`) as HTMLElement;
                        // if (box) {
                        //     height += getListHeight(box);
                        // }
                        height += item.clientHeight;
                    }
                }
            }
            return height;
        }

        /** 当前整体节点 */
        const menuBox = ref<HTMLElement>();

        /** 下级菜单 */
        const menuChildren = ref<{ open: boolean, maxListHeight: number }>();

        /** 是否展开 */
        const open = ref(false);

        function switchClose() {
            open.value = !open.value;
            let childrenHeight = 0;
            if (menuChildren.value && menuChildren.value.open) {
                childrenHeight = menuChildren.value.maxListHeight;
            }
            context.emit("change", open.value ? (maxListHeight.value + childrenHeight) : 0);
        }

        /**
         * 接收组件传递过来的高度
         * @param height 
         */
        function updateListHeight(height: number) {
            listStyle.height = height + maxListHeight.value + "px";
            context.emit("change", height + maxListHeight.value);
        }

        /**
         * 是否激活状态
         * @param path 当前路由路径
         */
        function isActive(path: string) {
            return route.path === path;
        }

        function hasChildrenOpen() {
            const child = props.info.children;
            const hasOpen = child ? child.some(item => isActive(item.path)) : false;
            open.value = isActive(props.info.path) || hasOpen;
            context.emit("children-open", hasOpen);
        }
        
        /**
         * 监听子菜单展开
         * @param state
         */
        function onChildrenOpen(state: boolean) {
            console.log("监听子菜单展开 >>", state);
            open.value = state;
        }

        onMounted(function() {
            const el = menuBox.value!;
            maxListHeight.value = getListHeight(el);
            updateListHeight(0);
            hasChildrenOpen();

            // 设置左边距
            if (props.level >= 1) {
                const style = getComputedStyle(el!.children[0] as HTMLElement);
                const value = parseFloat(style.paddingLeft);
                if (isNaN(value)) return;
                titleStyle.paddingLeft = value * props.level + "px";
                itemStyle.paddingLeft = value * (props.level + 1) + "px";
            }
            // console.log(menuChildren.value);
        })

        return {
            hasChidren,
            itemStyle,
            titleStyle,
            menuBox,
            menuChildren,
            listStyle,
            open,
            maxListHeight,
            isActive,
            switchClose,
            updateListHeight,
            onChildrenOpen
        }
    }
})

export default MenuItem;
</script>

```