<template>
    <div class="the_upload_img">
        <div class="upload_content" :style="{'width': width + 'px'}" v-loading="loading">
            <div v-if="imgUrl" class="image_box">
                <img class="image" :src="imgUrl" :style="{ 'height': autoHeight ? null : height + 'px' }">
                <div class="remove flex fvertical fcenter">
                    <i class="el-icon-delete" @click="removeImg()" />
                </div>
            </div>
            <div v-else class="upload_box flex fvertical fcenter" :style="{ 'height': height + 'px' }">
                <div class="add_icon"></div>
                <input class="upload_input" type="file" name="picture" ref="uploadinput" @change="uploadImg()">
            </div>
        </div>
        <p class="upload_tip" v-if="tip">{{ loading ? "上传中..." : tip }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UploadChange } from "../utils/interfaces";
import api from "../api/index";

@Component({})
export default class UploadImg extends Vue {

    /** 组件上传图片路径 */
    @Prop({
        type: String,
        default: ""
    })
    imgUrl!: string;
    
    /** 组件`id` */
    @Prop({
        type: [String, Number],
        default: ""
    })
    uploadId!: UploadChange["id"];

    /** 图片宽度 */
    @Prop({
        type: Number,
        default: 178
    })
    width!: number;

    /** 图片宽度 */
    @Prop({
        type: Number,
        default: 178
    })
    height!: number;

    /** 是否自动高度（针对图片） */
    @Prop({
        type: Boolean,
        default: false
    })
    autoHeight!: boolean; 

    /** 图片上传提示 */
    @Prop({
        type: [String, Number],
        default: ""
    })
    tip!: string;

    /** 加载动画 */
    loading = false;

    /** 发送数据到父组件中 */
    emitChange(info: UploadChange) {
        this.$emit("change", info);
    }

    /** 清除当前图片 */
    removeImg() {
        this.emitChange({
            id: this.uploadId,
            src: ""
        });
    }

    /** 上传图片 */
    async uploadImg() {
        // 这样写也可以，但是命令台会报错，浏览器不会
        // const input = (this.$refs.uploadinput as HTMLInputElement);

        const input: any = this.$refs.uploadinput;

        const file: File = input.files[0];
        // console.log("上传图片文件 >>", file);
        
        /** 上传类型数组 */
        const typeList = ["image/jpg", "image/png", "image/jpeg", "image/gif"];

        // 判断文件类型
        if (typeList.indexOf(file.type) < 0) {
            this.$message.warning("文件格式只支持：jpg、png、gif");
            input.value = null;
            return;
        }

        // 判断大小
        if (file.size > 2 * 1024 * 1024) {
            this.$message.warning("上传的文件不能大于2M");
            input.value = null;
            return;
        }

        // const formData = new FormData();

        // formData.append("file", file);

        this.loading = true;
        const res = await api.uploadImg(file)
        this.loading = false;
        console.log("上传图片 >>", res);
        if (res.code === 1) {
            const result: string = res.data.img;
            this.emitChange({
                id: this.uploadId,
                src: result
            });
        } else {
            this.$message.error("上传图片失败");
        }
    }

}
</script>

<style lang="scss">
@import "@/styles/element-variables.scss";
@mixin time() { transition: 0.2s all; }
@mixin addIcon() { content: ""; position: absolute; background-color: #999; }

.the_upload_img {
    .upload_content {
        background-color: transparent;
        border: 1px dashed #d9d9d9;
        border-radius: 5px;
        overflow: hidden;
        @include time();
        &:hover { border-color: $--color-primary; background-color: #fbfdff; }
        .image_box{ 
            position: relative; width: 100%; height: 100%; overflow: hidden;
            .image { display: block; width: 100%; }
            .remove {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); color: #f4f4f4; opacity: 0; @include time();
                &:hover { opacity: 1; }
            }
            .el-icon-delete { font-size: 20px; line-height: 20px; cursor: pointer; }
        }
        .upload_box{ 
            width: 100%; position: relative;
            .upload_input { width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 2; opacity: 0; cursor: pointer; }
            .add_icon {
                position: relative; width: 30px; height: 30px;
                &::after{ @include addIcon(); top: 0; left: 50%; width: 2px; height: 100%; transform: translateX(-50%); }
                &::before{ @include addIcon(); top: 50%; left: 0; width: 100%; height: 2px; transform: translateY(-50%); }
            }
        }
    }
    .upload_tip { font-size: 12px; color: $--color-primary; line-height: 20px; padding: 6px 4px; }
}
</style>