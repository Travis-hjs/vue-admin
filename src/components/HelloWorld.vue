<template>
    <div class="hello_world">
        <h1 class="title">{{ msg }}</h1>
        <el-divider content-position="left">vue 3.x</el-divider>
        <p class="text"><el-link type="primary" :href="typeScript" target="_blank">typescript</el-link>+<el-link type="primary" :href="elementUi" target="_blank">element-ui</el-link>后台管理模板。</p>
        <p class="text">当前项目使用的技术均为最新</p>
        <p class="text">项目地址：<el-link type="primary" :href="project" target="_blank">github</el-link></p>
        <el-divider content-position="left">打赏一下</el-divider>
        <div class="code_box">
            <img class="hovercode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode1.jpg">
            <img class="qrcode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode2.jpg">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "HelloWorld",
    props: {
        msg: {
            type: String,
            default: ""
        },
    },
    setup() {
        const vite = "https://www.pipipi.net/vite/guide/";

        const vueCli = "https://cli.vuejs.org/zh/guide/";

        const elementUi = "https://element-plus.gitee.io/#/zh-CN/component/installation";

        const typeScript = "https://www.tslang.cn/";

        const project = "https://github.com/Hansen-hjs/vue-admin/tree/next";

        return {
            vite,
            vueCli,
            elementUi,
            typeScript,
            project
        }
    }
});
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
