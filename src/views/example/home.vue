<template>
    <div class="page-home">
        <h2 class="the-title mgb_10">Vue2 + Vue-cli + TypeScript 后台管理模板</h2>
        <div class="mgb_20">
            <el-tag>无 UI 框架依赖，可以无缝接入自己喜欢的任何第三方库</el-tag>
            <el-link :href="project" target="_blank" type="primary">项目地址</el-link>
            <el-link :href="juejin" target="_blank" type="primary">掘金描述说明</el-link>
        </div>
        <h2 class="the-title mgb_20">布局操作开关</h2>
        <div class="options-box">
            <el-checkbox class="mgb_10" v-model="layoutInfo.showSidebarLogo">显示侧边栏logo</el-checkbox>
            <el-checkbox class="mgb_10" v-model="layoutInfo.showTagsView">显示历史记录标签</el-checkbox>
            <el-checkbox v-model="layoutInfo.sidebarOpen">侧边栏展开</el-checkbox>
        </div>
        <h2 class="the-title mgb_10">打赏一下</h2>
        <div class="code-box">
            <img class="hovercode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode1.jpg">
            <img class="qrcode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode2.jpg">
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";

@Component({})
export default class Home extends Vue {
    layoutInfo = store.layout.info;

    project = store.projectInfo.link;

    juejin = "https://juejin.cn/post/7017278822068273166";

}
</script>
<style lang="scss">
.page-home {
    .the-title {
        font-weight: normal;
        font-size: 24px;
        color: #444;
    }
    width: 100%;
    .el-link {
        margin-left: 10px;
    }
    .code-box {
        width: 100%;
        img {
            display: inline-block;
            vertical-align: top;
            width: 280px;
            margin-right: 16px;
            border-radius: 4px;
            box-shadow: 0 4px 4px rgba(0,0,0,0.1);
            transition: 0.3s all;
        }
        .hovercode {
            cursor: pointer;
            &:hover + .qrcode {
                opacity: 1;
                transform: translateX(0px);
            }
        }
        .qrcode {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    .options-box {
        width: 220px;
        margin-bottom: 24px;
    }
}
</style>