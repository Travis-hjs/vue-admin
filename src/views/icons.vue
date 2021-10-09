<template>
    <div class="page-icons">
        <div class="title mgb_20">点击复制代码</div>
        <div class="icon-item" v-for="(item) in list" :key="item" v-copy="getSvgIconCode(item)" :title="getSvgIconCode(item)">
            <svg-icon :name="item" />
            <p>{{ item }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
const req = require.context("../icons/svg", false, /\.svg$/);
const requireAll = (requireContext: any) => requireContext.keys();
const svgIcons = requireAll(req).map((str: string) => {
    return str.match(/\.\/(.*)\.svg/)![1];
});

@Component({
    name: "svg-icons"
})
export default class Icons extends Vue {

    list = svgIcons;

    getSvgIconCode(symbol: string) {
        return `<svg-icon name="${symbol}" />`;
    }
}
</script>

<style lang="scss">
.page-icons {
    width: 100%;
    .title {
        font-size: 22px;
        color: #333;
    }
    .icon-item {
        display: inline-block;
        text-align: center;
        cursor: pointer;
        width: 120px;
        padding: 10px 16px;
        margin-bottom: 16px;
        margin-right: 16px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        color: #555;
        font-size: 15px;
        .svg-icon {
            width: 28px;
            height: 28px;
            margin-bottom: 10px;
            transition: 0.3s all;
        }
        &:hover {
            .svg-icon {
                transform: scale(1.2);
            }
        }
    }
}
</style>
