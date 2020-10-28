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
import { Component, Vue } from "vue-property-decorator";
import { UploadImage } from "../../utils/interfaces";
import UploadImg from "../../components/UploadImg.vue";

@Component({
    components: {
        UploadImg
    }
})
export default class Page5 extends Vue {

    private pageData = {
        title: "上传图片组件",
        dec: "element-ui 自身的上传组件会有 bug，在一个组件中使用多个 el-upload 组件时，初始化设置的图片传参只会有一个生效（最后一个），所以自己整了一个上传图片组件。",
        
        uploadList: [
            {
                image: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
            }, {
                image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            }
        ],

        single: ""
    }

    private getPicUrl(info: UploadImage) {
        const index = info.id as number;
        this.pageData.uploadList[index].image = info.src;
    }

    getSingleUrl(info: UploadImage) {
        this.pageData.single = info.src;
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