<template>
    <div class="the-components">
        <h2 class="the-title mgb_20">上传图片组件</h2>
        <div class="flex mgb_20">
            <UploadImage uploadId="logo" :src="formData.logo" tip="正方形图片" @change="onUpload" />
            <UploadImage uploadId="banner" :src="formData.banner" tip="高度自适应" :autoHeight="true" @change="onUpload" />
        </div>
        <h2 class="the-title mgb_20">滚动条组件</h2>
        <span class="the-tag success mgb_10">横向滚动</span>
        <div class="list-x mgb_20">
            <Scrollbar thumbColor="#42b983">
                <div class="item" v-for="(item) in list" :key="item"></div>
            </Scrollbar>
        </div>
        <span class="the-tag success mgb_10">垂直滚动</span>
        <div class="list-y mgb_20">
            <Scrollbar :vertical="true" thumbColor="#42b983">
                <div class="item" v-for="(item) in list" :key="item"></div>
            </Scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";
import Scrollbar from "@/components/Scrollbar/index.vue";
import UploadImage, { UploadChange } from "@/components/Upload/Image.vue";

export default defineComponent({
    components: {
        Scrollbar,
        UploadImage
    },
    setup(props, context) {
        const formData = reactive({
            banner: "",
            logo: ""
        })

        /**
         * 监听上传图片
         * @param info 回调数据
         */
        function onUpload(info: UploadChange<"banner"|"logo">) {
            // info.id 就是组件绑定的 uploadId，多个上传组件的时候用来区分用，可传可不传
            formData[info.id] = info.src;
        }

        return {
            list: new Array(10).fill(0).map((_, index) => index),
            formData,
            onUpload
        }
    }
})
</script>
<style lang="scss">
.the-components {
    width: 100%;
    .list-x {
        width: 300px;
        height: 88px;
        .item {
            display: inline-block;
            width: 120px;
            height: 100%;
            background-color: tomato;
        }
        .item + .item {
            margin-left: 14px;
        }
    }
    .list-y {
        width: 120px;
        height: 400px;
        .item {
            width: 100%;
            height: 88px;
            margin-bottom: 14px;
            background-color: tomato;
            &:last-child {
                margin-bottom: 0px;
            }
        }
    }
    .the-upload-image + .the-upload-image {
        margin-left: 14px;
    }
}
</style>