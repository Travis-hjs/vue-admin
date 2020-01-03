<template>
    <div class="nav-top">
        <div class="nav-box">
            <div class="icon-box">
                <svg-icon name="hamburger" />
            </div>
            <div class="title-list">
                <div :class="['title-item', {'title-active': index == titleList.length - 1}]" v-for="(item, index) in titleList" :key="'title-' + index">
                    <span v-if="index != 0" class="label">/</span>
                    <span>{{ item }}</span>
                </div>
            </div>
            <div class="nav-right">

            </div>
        </div>
        <div class="history-box" v-if="showHistory">

        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class NavTop extends Vue {
    
    @Prop({
        type: Boolean,
        default: true
    })
    private showHistory!:boolean;

    private titleList = ['首页', '一级分页', '二级分页'];

}

</script>

<style lang="scss">
.nav-top{
    width: 100%;
    overflow: hidden;
    position: relative;
    padding-bottom: 16px;
    .nav-box{
        height: 50px;
        overflow: hidden;
        position: relative;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0,21,41,.08);
        display: flex;
        flex-wrap: wrap;
        .icon-box{ 
            width: 50px; 
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: .3s all;
            &:hover{
                background-color: rgba(0,0,0,0.025);
            }
            .svg-icon{
                width: 20px;
                height: 20px;
                color: #000;
            }
        }
        .title-list{
            flex: 2;
            margin-right: 8px;
            color: #1f2d3d;
            font-size: 14px;
            display: flex;
            align-items: center;
            .title-item{
                padding: 0 4px;
                .label{
                    margin-right: 8px;
                }
            }
            .title-active{
                color: #97a8be;
            }
        }
        .nav-right{
            flex: 1;
        }
    }
    .history-box{
        height: 34px;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
    }
}
</style>