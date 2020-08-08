<template>
    <div class="the-component">
        <h2 class="title">{{ pageData.title }}</h2>
        <el-alert :title="pageData.dec" type="success" />
        <div class="flex">
            <div style="margin-right: 16px;">
                <upload-img :imgUrl="pageData.picUrlone" @getImgUrl="getPicUrlone" />
            </div>
            <div>
                <upload-img :imgUrl="pageData.picUrltwo" @getImgUrl="getPicUrltwo" />   
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadImg from "../../components/UploadImg.vue";

@Component({
    components: {
        "upload-img": UploadImg
    }
})
export default class Page5 extends Vue {

    private pageData = {
        title: "上传图片组件",
        dec: "element-ui 自身的上传组件会有 bug，在一个组件中使用多个 el-upload 组件时，初始化设置的图片传参只会有一个生效（最后一个），所以自己整了一个上传图片组件。",
        picUrlone: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578458594858&di=57853784eecdee8e3e2389faf165cd04&imgtype=0&src=http%3A%2F%2Fwx1.sinaimg.cn%2Forj360%2F006cSBLKgy1g99h3bpeuoj30c80c00t7.jpg",
        picUrltwo: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578458563728&di=554415fd4152e6bbcf5bb96fe2a80658&imgtype=0&src=http%3A%2F%2Fwww.5577.com%2Fup%2F2018-6%2F15296575076571272.jpg",
    }

    private getPicUrlone(src: string) {
        this.pageData.picUrlone = src;
    }

    private getPicUrltwo(src: string) {
        this.pageData.picUrltwo = src;
    }

    mounted() {

    }

}
</script>

<style lang="scss">
.the-component{
    .title{ font-size: 24px; font-weight: normal; margin-bottom: 20px; line-height: 32px; }
    .el-alert{ margin-bottom: 16px; }
}
</style>