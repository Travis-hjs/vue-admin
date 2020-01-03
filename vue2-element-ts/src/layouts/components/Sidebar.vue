<template>
    <div class="sidebar">
        <div class="sidebar-view">
            <div :class="['menu-list', {'class-open-1': item.open}]" v-for="(item, index) in navList" :key="'class-1-' + index">
                <div class="menu-title" v-if="!item.hidden && item.meta" @click="switchMenu(index)">
                    <svg-icon v-if="item.meta.icon" :name="item.meta.icon"/>
                    <span>{{ item.meta.title }}</span>
                </div>
                <div class="menu-item class-item-1" v-for="(item1, index1) in item.children" :key="'class-2-' + index1">
                    <svg-icon v-if="item1.meta.icon" :name="item1.meta.icon"/>
                    <span>{{ item1.meta.title }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { routeItem } from '../../modules/types';
import store from '../../modules/store';

@Component({})
export default class Sidebar extends Vue {
    /** 导航列表 */
    private navList: Array<routeItem> = [];

    /**
     * 菜单折叠切换
     * @param index 点击索引
     */
    private switchMenu(index: number) {
        this.navList[index].open = !this.navList[index].open;
        // console.log(index);
    }

    private init() {
        let list: Array<any> = store.addRouters.map(item => {
            return {
                open: false, // 这里动态添加一个变量作为切换class用
                path: item.path,
                hidden: item.hidden || false,
                meta: item.meta || null,
                children: item.children || null
            }
        });
        this.navList = list;
        // console.log(list);
    }

    created() {
        this.init();
    }
}

</script>

<style lang="scss">
$bg: rgb(48, 65, 86);
$color: rgb(191, 203, 217);
$hoverBg: rgb(38,52,69);
$sideWidth: 210px;
$sideMaxWidth: 227px;
$menuTitleHeight: 56px;
$menuItemHeight: 50px;
$menuItemBg: #1f2d3d;
$menuItemHoverBg: #001528;
@mixin verticalCenter {
    display: flex; 
    flex-wrap: wrap;
    align-items: center;
}

.sidebar{
    width: $sideWidth;
    height: 100%;
    overflow: hidden;
    background-color: $bg;
    box-sizing: border-box;
    .sidebar-view{
        width: $sideMaxWidth;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        .menu-list {
            width: $sideWidth;
            overflow: hidden;
            color: $color;
            font-size: 14px;
            cursor: pointer;
            transition: .3s all;
            .menu-title{
                width: 100%;
                height: $menuTitleHeight;
                @include verticalCenter;
                padding: 0 20px;
                box-sizing: border-box;
                transition: .3s all;
                &:hover{
                    background-color: $hoverBg;
                }
            }
            .menu-item{
                width: 100%;
                height: 0px;
                line-height: $menuItemHeight;
                padding: 0 20px;
                box-sizing: border-box;
                transition: .3s all;
                background-color: $menuItemBg;
                &:hover{
                    background-color: $menuItemHoverBg;
                }
            }
            svg {
                margin-right: 14px;
            }
            span {
                line-height: 14px;
            }
        }
        // 添加一级导航展开class
        .class-open-1{
            .class-item-1{
                padding-left: 40px;
                height: $menuItemHeight;
            }
        }
        // 二级
        .class-open-2{
            .class-item-2{
                padding-left: 60px;
                height: $menuItemHeight;
            }
        }
    }
}
</style>