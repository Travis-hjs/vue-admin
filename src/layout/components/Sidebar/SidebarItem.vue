<template>
    <div
        :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}, 'sidebar-item']"
        v-if="!item.meta || !item.meta.hidden"
    >
        <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
            <SidebarItemLink v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
                <el-menu-item :index="resolvePath(theOnlyOneChild.path)" :class="{'submenu-title-noDropdown': isFirstLevel}">
                    <svg-icon v-if="theOnlyOneChild.meta.icon" :name="theOnlyOneChild.meta.icon" />
                    <template #title v-if="theOnlyOneChild.meta.title">
                        <span>{{ theOnlyOneChild.meta.title }}</span>
                    </template>
                </el-menu-item>
            </SidebarItemLink>
        </template>
        <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
            <template #title>
                <svg-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon" />
                <!-- <span v-if="item.meta && item.meta.title" #title>{{ item.meta.title }}</span> -->
                <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
            </template>
            <template v-if="item.children">
                <!-- 注意！！！这里的 SidebarItem 是自身，defineComponent({ name: SidebarItem }) -->
                <SidebarItem
                    v-for="child in item.children"
                    :key="child.path"
                    :item="child"
                    :is-collapse="isCollapse"
                    :is-first-level="false"
                    :base-path="resolvePath(child.path)"
                    class="nest-menu"
                />
            </template>
        </el-submenu>
    </div>
</template>

<script lang="ts">
import path from "path";
import { defineComponent, PropType, computed } from "vue";
import SidebarItemLink from "./SidebarItemLink.vue";
import utils from "../../../utils";
import { 
    RouteItem 
} from "../../../utils/interfaces";

export default defineComponent({
    name: "SidebarItem", // 必须要有 name 值才上面才可以引用自身组件
    components: {
        SidebarItemLink
    },
    props: {
        item: {
            type: Object as PropType<RouteItem>,
            required: true
        },
        isCollapse: {
            type: Boolean,
            default: false,
        },
        isFirstLevel: {
            type: Boolean,
            default: true,
        },
        basePath: {
            type: String,
            default: "",
        }
    },
    setup(props, context) {
        const alwaysShowRootMenu = computed(function() {
            if (props.item.meta && props.item.meta.alwaysShow) {
                return true;
            }
            return false;
        })

        const showingChildNumber = computed(function() {
            if (props.item.children) {
                const showingChildren = props.item.children.filter(item => {
                    if (item.meta && item.meta.hidden) {
                        return false;
                    } else {
                        return true;
                    }
                });
                return showingChildren.length;
            }
            return 0;
        })

        const theOnlyOneChild = computed(function() {
            if (showingChildNumber.value > 1) {
                return null;
            }
            if (props.item.children) {
                for (let child of props.item.children) {
                    if (!child.meta || !child.meta.hidden) {
                        return child;
                    }
                }
            }
            // If there is no children, return itself with path removed,
            // because props.basePath already conatins item"s path information
            return { ...props.item, path: "" };
        })

        function resolvePath(routePath: string) {
            if (utils.isExternal(routePath)) {
                return routePath;
            }
            if (utils.isExternal(props.basePath)) {
                return props.basePath;
            }
            return path.resolve(props.basePath, routePath);
        }

        return {
            alwaysShowRootMenu,
            theOnlyOneChild,
            resolvePath
        }
    }
})
</script>

<style lang="scss">
@import "@/styles/variables.scss";
.el-submenu.is-active > .el-submenu__title {
    color: $subMenuActiveText !important;
}

.full-mode {
    .nest-menu .el-submenu > .el-submenu__title,
    .el-submenu .el-menu-item {
        min-width: $sideBarWidth !important;
        background-color: $subMenuBg !important;

        &:hover {
            background-color: $subMenuHover !important;
        }
    }
}

.simple-mode {
    &.first-level {
        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;

            // .el-tooltip {
            //     padding: 0 !important;
            // }
        }

        .el-submenu {
            overflow: hidden;

            & > .el-submenu__title {
                // padding: 0px !important;

                .el-submenu__icon-arrow {
                    display: none;
                }

                & > span {
                    visibility: hidden;
                }
            }
        }
    }
}
.sidebar-item{
    .svg-icon {
        margin-right: 16px;
    }

    .simple-mode {
        .svg-icon {
            margin-left: 20px;
        }
    }
}
</style>
