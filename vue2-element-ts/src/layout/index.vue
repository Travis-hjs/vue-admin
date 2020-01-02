<template>
    <div class="layout-wrap">
        <div class="sidebar">
            <div class="sidebar-view">
                <ul class="menu-list" v-for="(item, index) in menuList" :key="index">
                    <div class="menu-title" v-if="!item.hidden && item.meta">{{ item.meta.title }}</div>
                    <li class="menu-item" v-for="(item1, index1) in item.children" :key="index1">{{ item1.meta.title }}</li>
                </ul>
            </div>
        </div>
        <div class="main-box"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from '../modules/store';

@Component({})
export default class Layout extends Vue {
    
    /** 导航列表 */
    private menuList = store.addRouters;

    mounted() {
        console.log('slide', this.menuList);
    }
}
</script>

<style lang="scss">
$bg: rgb(48, 65, 86);
$color: rgb(191, 203, 217);
$hoverBg: rgb(38,52,69);
$sideWidth: 210px;
$menuTitleHeight: 56px;
$menuItemHeight: 50px;
$menuItemBg: #1f2d3d;
$menuItemHoverBg: #001528;

.layout-wrap {
    ul {
        box-sizing: border-box;
        list-style: none; 
        padding: 0; 
        margin: 0;
    }
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    .sidebar {
        width: $sideWidth;
        height: 100%;
        background-color: $bg;
        overflow: hidden;
        .sidebar-view{
            width: 227px;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            .menu-list {
                max-height: $menuTitleHeight;
                width: $sideWidth;
                overflow: hidden;
                color: $color;
                font-size: 14px;
                cursor: pointer;
                .menu-title{
                    width: 100%;
                    height: $menuTitleHeight;
                    line-height: $menuTitleHeight;
                    padding: 0 20px;
                    box-sizing: border-box;
                    transition: .3s all;
                    &:hover{
                        background-color: $hoverBg;
                    }
                }
                .menu-item{
                    width: 100%;
                    height: $menuItemHeight;
                    line-height: $menuItemHeight;
                    padding: 0 20px;
                    box-sizing: border-box;
                    transition: .3s all;
                    background-color: $menuItemBg;
                    &:hover{
                        background-color: $menuItemHoverBg;
                    }
                }
            }
        }
    }
    .main-box {
        height: 100%;
    }
}
</style>