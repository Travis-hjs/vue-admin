<template>
    <div class="hello_world">
        <h1 class="title">{{ msg }}</h1>
        <el-divider content-position="left">vue 2.x</el-divider>
        <p class="text"><el-link type="primary" :href="typeScript" target="_blank">typescript</el-link>+<el-link type="primary" :href="elementUi" target="_blank">element-ui</el-link>+<el-link type="primary" :href="vueCli" target="_blank">vue-cli</el-link>后台管理模板。</p>
        <p class="text">考虑到兼容、使用数量、稳定等问题，当前项目搭建还是使用<el-link type="success" :href="vueCli" target="_blank">vue-cli</el-link>而没有使用<el-link type="success" :href="vite" target="_blank">vite</el-link>，等之后<el-link type="success" :href="vite" target="_blank">vite</el-link>稳定了再迁移过去。</p>
        <p class="text">如需使用最新技术，请移步<el-link type="primary" :href="project + '/tree/next'" target="_blank">vue3+typescript+vite</el-link></p>
        <p class="text">项目地址：<el-link type="primary" :href="project" target="_blank">github</el-link></p>
        <el-divider content-position="left">打赏一下</el-divider>
        <div class="code_box">
            <img class="hovercode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode1.jpg">
            <img class="qrcode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode2.jpg">
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "@/store";

@Component({})
export default class HelloWorld extends Vue {
    @Prop({
        type: [String, Number],
        default: ""
    })
    msg!: string;

    vite = "https://www.pipipi.net/vite/guide";

    vueCli = "https://cli.vuejs.org/zh/guide";

    elementUi = "https://element.eleme.cn/#/zh-CN/component/installation";

    typeScript = "https://www.tslang.cn";

    project = store.projectLink;

}
</script>

<style lang="scss">
.hello_world {
    width: 100%;
    .title {
        font-size: 24px;
        color: #444;
        margin-bottom: 20px;
        font-weight: normal;
    }
    .text {
        font-size: 16px;
        color: #555;
        line-height: 28px;
        .el-link {
            padding: 0 4px;
        }
    }
    .code_box {
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
}

</style>
