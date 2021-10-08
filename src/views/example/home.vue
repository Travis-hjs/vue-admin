<template>
    <div class="page-home">
        <h2 class="the-title mgb_10">Vue3 + Vite + TypeScript 后台管理模板</h2>
        <div class="mgb_20">
            <span class="the-tag link">无 UI 框架依赖，可以无缝接入自己喜欢的任何第三方库</span>
            <a class="the-tag success link" :href="project" target="_blank">项目地址</a>
            <a class="the-tag success link" :href="project" target="_blank">掘金描述说明</a>
        </div>
        <h2 class="the-title mgb_10">打赏一下</h2>
        <div class="code-box">
            <img class="hovercode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode1.jpg">
            <img class="qrcode" src="https://huangjingsheng.gitee.io/hjs/images/wxcode2.jpg">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
    setup() {

        const project = store.projectInfo.link;

        return {
            project
        }
    }
})
</script>
<style lang="scss">
.page-home {
    width: 100%;
    .link + .link {
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
}
</style>