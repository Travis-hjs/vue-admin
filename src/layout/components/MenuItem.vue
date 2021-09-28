<template>
    <div class="the-layout-menu" ref="menuBox">
        <button
            :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : info.isActive}, {'the-layout-menu-hasopen': info.isOpen }]"
            :style="titleStyle"
            @click="switchClose()"
            v-if="hasChidren(info)"
        >
            <span class="f1 ellipsis">{{ info.title }}</span>
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
                <span class="f1 ellipsis">{{ info.title }}</span>
            </a>
            <router-link
                :class="['the-layout-menu-title flex fvertical', {'the-layout-menu-on' : info.isActive}]"
                :to="info.path"
                :style="titleStyle"
                v-else
            >
                <span class="f1 ellipsis">{{ info.title }}</span>
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
                />
                <template v-else>
                    <a
                        :class="['the-layout-menu-item flex fvertical', {'the-layout-menu-on' : item.isActive}]"
                        :href="item.link"
                        target="_blank"
                        :style="itemStyle"
                        v-if="item.link"
                    >
                        <span class="ellipsis">{{ item.title }}</span>
                    </a>
                    <router-link
                        :class="['the-layout-menu-item flex fvertical', {'the-layout-menu-on' : item.isActive}]"
                        :to="item.path"
                        :style="itemStyle"
                        v-else
                    >
                        <span class="ellipsis">{{ item.title }}</span>
                    </router-link>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref } from "vue";
import { LayoutMenuItem } from "@/types";
import store from "@/store";

/**
 * 菜单`item`组件
 */
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
                title: "-"
            })
        },
    },
    setup(props, context) {

        /**
         * 是否有下级菜单
         * @param item
         */
        function hasChidren(item: LayoutMenuItem) {
            return item.children && item.children.length > 0;
        }

        /**
         * 获取列表高度
         * @param item 列表单个对象
         */
        function getListHeight(item: LayoutMenuItem) {
            let result = 0;
            const child = item.children;
            const size = store.layout.menuSizeInfo;
            if (item.isOpen && child && child.length > 0) {
                // result += store.layout.menuSizeInfo.titleHeight;
                result += (child.length - 1) * size.itemHeight + size.titleHeight;
                child.forEach(el => {
                    result += getListHeight(el);
                })
            }
            return result;
        }

        const titleStyle = reactive({
            paddingLeft: ""
        })

        const itemStyle = reactive({
            paddingLeft: ""
        })

        /**
         * 菜单列表样式
         */
        const listStyle = computed(function() {
            let height = getListHeight(props.info);
            // console.log("height >>", height);
            return {
                height: height + "px"
            }
        })

        /** 当前整体节点 */
        const menuBox = ref<HTMLElement>();

        function switchClose() {
            props.info.isOpen = !props.info.isOpen;
        }

        onMounted(function() {
            const el = menuBox.value!;
            
            // 设置左边距
            if (props.level >= 1) {
                const style = getComputedStyle(el.children[0] as HTMLElement);
                const value = parseFloat(style.paddingLeft);
                if (isNaN(value)) return;
                titleStyle.paddingLeft = value * props.level + "px";
                itemStyle.paddingLeft = value * (props.level + 1) + "px";
            }
        })

        return {
            itemStyle,
            titleStyle,
            menuBox,
            listStyle,
            hasChidren,
            switchClose,
        }
    }
})

export default MenuItem;
</script>
