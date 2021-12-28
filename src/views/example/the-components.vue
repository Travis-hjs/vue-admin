<template>
    <div class="the-component">
        <div class="mgb_30 flex">
            <h2 class="the-title">{{ pageData.title }}</h2>
        </div>
        <el-alert style="margin-bottom: 16px" :title="pageData.dec" type="success" />
        <div class="flex mgb_40">
            <div v-for="(item, index) in pageData.uploadList" :key="index" style="margin-right: 16px;">
                <UploadImage :src="item.image" :uploadId="index" @change="getPicUrl" :autoHeight="true" tip="提示：图片高度自适应" />
            </div>
            <div>
                <UploadImage :src="pageData.single" @change="getSingleUrl" width="300px" height="200px" tip="提示：图片宽高固定尺寸 300px * 200px；限制 5M 内" :maxSize="5" />
            </div>
        </div>
        <div class="mgb_30">
            <h2 class="the-title mgr_40">滚动条组件</h2>
            <el-button icon="el-icon-plus" size="medium" type="primary" @click="() => list.push(list.length + 1)">添加一个列表 item</el-button>
        </div>
        <div class="mgb_10"><span class="the-tag green">横向滚动</span></div>
        <div class="list-x mgb_40">
            <Scrollbar thumbColor="#42b983">
                <div class="item" v-for="(item) in list" :key="item">{{ item }}</div>
            </Scrollbar>
        </div>
        <div class="mgb_10"><span class="the-tag blue">垂直滚动</span></div>
        <div class="list-y mgb_40">
            <Scrollbar :vertical="true" thumbColor="#ffd000">
                <div class="item flex fvertical fcenter" v-for="(item) in list" :key="item">{{ item }}</div>
            </Scrollbar>
        </div>
        <div class="mgb_30">
            <h2 class="the-title mgr_40">折叠盒子组件</h2>
            <el-button type="success" size="medium" icon="el-icon-plus" @click="addOptionItems()">添加选项数据</el-button>
        </div>
        <div class="option-box">
            <FoldBox closeHeight="40px" ref="the-fold-box">
                <button class="option-item" v-for="item in opotionList" :key="item">选项-{{ item }}</button>
            </FoldBox>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadImage, { UploadChange } from "@/components/Upload/Image.vue";
import Scrollbar from "@/components/Scrollbar/index.vue";
import FoldBox from "@/components/FoldBox/index.vue";

@Component({
    components: {
        UploadImage,
        Scrollbar,
        FoldBox
    }
})
export default class Page5 extends Vue {

    pageData = {
        title: "上传图片组件",
        dec: "自定义上传图片组件，配合自定义请求方法上传图片",
        uploadList: [
            {
                image: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
            },
            {
                // image: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                image: "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcb3645c82654a4b9d7feab62dc6e332~tplv-k3u1fbpfcp-watermark.image"
            }
        ],
        single: ""
    }

    getPicUrl(info: UploadChange<number>) {
        const index = info.id;
        this.pageData.uploadList[index].image = info.src;
    }

    getSingleUrl(info: UploadChange) {
        this.pageData.single = info.src;
    }

    list = new Array(10).fill(0).map((_, index) => index + 1)

    opotionList = new Array(9).fill(0).map((_, index) => index + 1)
    
    $refs!: {
        ["the-fold-box"]: FoldBox
    }

    addOptionItems() {
        const total = this.opotionList.length;
        const list = [];
        for (let i = total + 1; i < total + 8; i++) {
            list.push(i);
        }
        this.opotionList = this.opotionList.concat(list);
        this.$refs["the-fold-box"].updateSize();
    }
}
</script>

<style lang="scss">
.the-component {
    .list-x {
        width: 30vw;
        max-width: 500px;
        height: 88px;
        .item {
            display: inline-block;
            width: 120px;
            height: 100%;
            text-align: center;
            line-height: 88px;
            background-color: tomato;
            color: #fff;
        }
        .item + .item {
            margin-left: 14px;
        }
    }
    .list-y {
        width: 120px;
        height: 400px;
        .item {
            color: #fff;
            width: 100%;
            height: 88px;
            margin-bottom: 14px;
            background-color: #1a9df5;
            &:last-child {
                margin-bottom: 0px;
            }
        }
    }
    .option-box {
        width: 624px;
        padding: 10px 10px 1px;
        border: dashed 1px #eee;
        .option-item {
            background-color: #1a9df5;
            border: none;
            outline: none;
            font-size: 14px;
            color: #fff;
            height: 30px;
            margin-bottom: 10px;
            margin-right: 10px;
            border-radius: 4px;
            padding: 0 8px;
        }
    }
}
</style>