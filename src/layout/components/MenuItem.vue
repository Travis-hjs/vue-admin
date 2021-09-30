<template>
    <div class="the-layout-menu" ref="menuBox">
        <button :class="titleClass" :style="titleStyle" @click="switchClose()" v-if="hasChidren(info)">
            <span class="f1 ellipsis">{{ info.title }}</span>
            <i class="the-layout-menu-arrow"></i>
        </button>
        <template v-else>
            <!-- 外链 -->
            <a :class="titleClass" :style="titleStyle" :href="info.link" target="_blank" v-if="info.link">
                <span class="f1 ellipsis">{{ info.title }}</span>
            </a>
            <!-- 单个菜单 -->
            <router-link :class="titleClass" :style="titleStyle" :to="info.path" v-else>
                <span class="f1 ellipsis">{{ info.title }}</span>
            </router-link>
        </template>
        <!-- :class="['the-layout-menu-list', { 'the-layout-menu-list-close': !info.isOpen }]" -->
        <div class="the-layout-menu-list" :style="listStyle" v-if="info.children && info.children.length > 0">
            <div v-for="(item) in info.children" :key="item.path">
                <MenuItem v-if="hasChidren(item)" :info="item" :level="level + 1" />
                <template v-else>
                    <!-- 外链 -->
                    <a :class="getItemClass(item)" :style="itemStyle" :href="item.link" target="_blank" v-if="item.link">
                        <span class="ellipsis">{{ item.title }}</span>
                    </a>
                    <!-- 单个菜单 -->
                    <router-link :class="getItemClass(item)" :style="itemStyle" :to="item.path" v-else>
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
        /** 是否合并只有一条下级菜单的到当前标题中去 */
        mergeFirst: {
            type: Boolean,
            default: false
        }
    },
    setup(props, context) {

        /**
         * 是否有下级菜单
         * @param item
         */
        function hasChidren(item: LayoutMenuItem) {
            return item.children && item.children.length > 0 ? true : false;
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
                child.forEach(menuItem => {
                    const height = menuItem.children && menuItem.children.length > 0 ? size.titleHeight : size.itemHeight;
                    result += height;
                    result += getListHeight(menuItem);
                })
            }
            return result;
        }
        
        /** 
         * 检测当前菜单栏下是否有激活状态的菜单
         * @param item 列表单个对象
         */
        function hasActiveItem(item: LayoutMenuItem) {
            if (hasChidren(item)) {
                for (let i = 0; i < item.children!.length; i++) {
                    const child = item.children![i];
                    if (child.isActive) {
                        return true;
                    }
                    if (hasChidren(child) && hasActiveItem(child)) {
                        return true;
                    }
                }
            }
            return false;
        }

        const titleClass = computed(function () {
            return {
                "the-layout-menu-title flex fvertical": true,
                "the-layout-menu-on": props.info.isActive,
                "the-layout-menu-hasopen": props.info.isOpen,
                "the-layout-menu-hasactive": hasActiveItem(props.info)
            }
        })

        function getItemClass(item: LayoutMenuItem) {
            return {
                "the-layout-menu-item flex fvertical": true,
                "the-layout-menu-on": item.isActive 
            }
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
            titleClass,
            getItemClass,
            menuBox,
            listStyle,
            hasChidren,
            switchClose,
        }
    }
})

export default MenuItem;
</script>
