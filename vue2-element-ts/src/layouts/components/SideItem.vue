<template>
    <div class="side-item">
        <div :class="['menu-list', {'class-open-1': item.open}]" v-for="(item, index) in navList" :key="'class-1-' + index">
            <div class="menu-title" v-if="!item.hidden && item.meta" @click="switchMenu(index)">
                <svg-icon v-if="item.meta.icon" :name="item.meta.icon"/>
                <span>{{ item.meta.title }}</span>
            </div>
            <div class="menu-item class-item-1" v-for="(child, index1) in item.children" :key="'class-2-' + index1">
                <svg-icon v-if="child.meta.icon" :name="child.meta.icon"/>
                <span>{{ child.meta.title }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { routeItem } from "../../modules/types";

@Component({})
export default class SideItem extends Vue {
    /** 菜单列表 */
    @Prop({
        type: Array,
        default: []
    })
    menuList!: Array<routeItem>

    mounted() {
        console.log(this.menuList);
        
    }
}

</script>

<style lang="scss" scoped>

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

.side-item{
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
}
</style>