<template>
    <div class="the-component">
        <h2 class="title">{{ pageData.title }}</h2>
        <el-alert :title="pageData.dec" type="success" />
        <div class="flex">
            <div v-for="(item, index) in pageData.uploadList" :key="index" style="margin-right: 16px;">
                <UploadImg :imgUrl="item.image" :uploadId="index" @change="getPicUrl" />
            </div>
            <div>
                <UploadImg :imgUrl="pageData.single" @change="getSingleUrl" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import UploadImg from "../../components/UploadImg.vue";
import { UploadChange } from "../../utils/interfaces";

export default defineComponent({
    components: {
        UploadImg
    },
    setup() {
        const pageData = reactive({
            title: "上传图片组件",
            dec: "element-ui 自身的上传组件会有 bug，在一个组件中使用多个 el-upload 组件时，初始化设置的图片传参只会有一个生效（最后一个），所以自己整了一个上传图片组件。",
            
            uploadList: [
                {
                    image: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
                }, {
                    // image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                    image: "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcb3645c82654a4b9d7feab62dc6e332~tplv-k3u1fbpfcp-watermark.image"
                }
            ],

            single: ""
        })

        function getPicUrl(info: UploadChange) {
            const index = info.id as number;
            pageData.uploadList[index].image = info.src;
        }

        function getSingleUrl(info: UploadChange) {
            pageData.single = info.src;
        }

        return {
            pageData,
            getPicUrl,
            getSingleUrl
        }
    }
})
</script>

<style lang="scss">
.the-component{
    .title{ font-size: 24px; font-weight: normal; margin-bottom: 20px; line-height: 32px; }
    .el-alert{ margin-bottom: 16px; }
}
</style>