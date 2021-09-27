<template>
    <div class="the-layout-menu" ref="menuBox">
        <button
            :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : info.isActive}, {'the-layout-menu-hasopen': info.isOpen }]"
            :style="titleStyle"
            @click="switchClose()"
            v-if="hasChidren(info)"
        >
            <span class="f1 ellipsis">{{ info.meta.title }}</span>
            <i class="the-layout-menu-arrow"></i>
        </button>
        <template v-else>
            <a
                :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : info.isActive}]"
                :href="info.link"
                target="_blank"
                :style="titleStyle"
                v-if="info.link"
            >
                <span class="f1 ellipsis">{{ info.meta.title }}</span>
            </a>
            <router-link
                :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : info.isActive}]"
                :to="info.path"
                :style="titleStyle"
                v-else
            >
                <span class="f1 ellipsis">{{ info.meta.title }}</span>
            </router-link>
        </template>
        <div
            :class="['the-layout-menu-list', { 'the-layout-menu-list-close': !info.isOpen }]"
            :style="listStyle"
            v-if="info.children && info.children.length > 0"
        >
            <div v-for="(item) in info.children" :key="item.path">
                <MenuItem
                    v-if="hasChidren(item)"
                    :info="item"
                    :level="level + 1"
                    ref="menuChildren"
                />
                <template v-else>
                    <a
                        :class="['the-layout-menu-item flex fvertical', {'the-layout-menu-on' : item.isActive}]"
                        :href="item.link"
                        target="_blank"
                        :style="itemStyle"
                        v-if="item.link"
                    >
                        <span class="ellipsis">{{ item.meta.title }}</span>
                    </a>
                    <router-link
                        :class="['the-layout-menu-item flex fvertical', {'the-layout-menu-on' : item.isActive}]"
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
import { computed, defineComponent, onMounted, PropType, reactive, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import { LayoutMenuItem } from "@/types";

/** 当前组件`class`名 */
const menuClassName = "the-layout-menu";
/** 菜单列表`class`名 */
const listClassName = "the-layout-menu-list";
/** 菜单列表关闭`class`名 */
const listColseClassName = "the-layout-menu-list-close";

interface ChildMenu {
    maxListHeight: number
    menuChildren: ChildMenu
}

const MenuItem = defineComponent({
    name: "MenuItem",
    props: {
        level: {
            type: Number,
            default: 1
        },
        info: {
            type: Object as PropType<LayoutMenuItem>,
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
        function hasChidren(item: LayoutMenuItem) {
            return item.children && item.children.length > 0;
        }

        const titleStyle = reactive({
            paddingLeft: ""
        })

        const itemStyle = reactive({
            paddingLeft: ""
        })
        
        function getMenuHeight(item: LayoutMenuItem, com?: ChildMenu) {
            let result = 0;
            if (item.isOpen && com) {
                result += com.maxListHeight;
                item.children && item.children.forEach(el => {
                    result += getMenuHeight(el, com.menuChildren);
                })
            }
            return result;
        }

        const listStyle = computed(function() {
            let result = maxListHeight.value;
            result = getMenuHeight(props.info, menuChildren.value);
            console.log("listStyle >>", result);
            
            return {
                height: result + "px"
            }
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
            if (listBox) {
                const child = listBox.children;
                if (child) {
                    for (let i = 0; i < child.length; i++) {
                        const item = child[i];
                        height += item.clientHeight;
                    }
                }
            }
            return height;
        }

        /** 当前整体节点 */
        const menuBox = ref<HTMLElement>();

        /** 下级菜单 */
        const menuChildren = ref<ChildMenu>();

        function switchClose() {
            props.info.isOpen = !props.info.isOpen;
        }

        onMounted(function() {
            const el = menuBox.value!;
            maxListHeight.value = getListHeight(el);
            // updateListHeight(0);
            // hasChildrenOpen();

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
            listStyle,
            maxListHeight,
            menuChildren,
            switchClose,
        }
    }
})

export default MenuItem;
</script>
