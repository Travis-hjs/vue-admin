<template>
    <div class="the_upload_img" v-loading="loading" :style="{'width': width + 'px'}">
        <div v-if="imgUrl" class="image_box">
            <img class="image" :src="imgUrl">
            <div @click="removeImg()" class="remove flex fvertical fcenter">
                <i class="el-icon-close" />
            </div>
        </div>
        <div v-else class="upload_box flex fvertical fcenter" :style="{ 'height': width + 'px' }">
            <div class="add_icon"></div>
            <input class="upload_input" type="file" name="picture" ref="uploadinput" @change.stop="uploadImg()">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { UploadChange } from "../utils/interfaces";
import api from "../api/index";
import utils from "../utils";

export default defineComponent({
    name: "UploadImg",
    props: {
        /** 组件上传图片路径 */
        imgUrl: {
            type: String,
            default: ""
        },
        /** 上传组件`id` */
        uploadId: {
            type: [String, Number] as PropType<UploadChange["id"]>,
            default: ""
        },
        /** 图片宽度 */
        width: {
            type: Number,
            default: 240
        }
    },
    setup(props, context) {
        /** 上传组件`input`节点 */
        const uploadinput = ref<HTMLInputElement>(null as any);
        /** 上传状态 */
        let loading = ref(false);

        /** 上传图片 */
        function uploadImg() {
            const input = uploadinput.value;
            const file = (input.files as FileList)[0];
            // console.log("上传图片文件 >>", file);
            
            /** 上传类型数组 */
            let typeStr = ["image/jpg", "image/png", "image/jpeg", "image/gif"];

            // 判断文件类型
            if (typeStr.indexOf(file.type) < 0) {
                utils.showWarning("文件格式只支持：jpg 和 png")
                input.value = "";
                return;
            }

            // 判断大小
            if (file.size > 2 * 1024 * 1024) {
                utils.showWarning("上传的文件不能大于2M");
                input.value = "";
                return;
            }

            // const formData = new FormData();

            // formData.append("file", file);

            loading.value = true;
            api.uploadImg(file, res => {
                loading.value = false;
                const result: string = res;
                context.emit("change", {
                    id: props.uploadId,
                    src: result
                })
            }, err => {
                loading.value = false;
                utils.showError("上传图片失败");
                // console.log("上传图片失败 >>", err);
            });
        }

        /** 清除当前图片 */
        function removeImg() {
            context.emit("change", {
                id: props.uploadId,
                src: ""
            })
        }

        return {
            uploadinput,
            loading,
            uploadImg,
            removeImg
        }
    }
})
</script>

<style lang="scss">
.the_upload_img {
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    overflow: hidden;
    &:hover{ border-color: #409eff; }
    .image_box{ 
        position: relative; width: 100%; height: 100%; overflow: hidden;
        .image{ display: block; width: 100%; }
        .remove{ position: absolute; top: 0; right: 0; line-height: normal; border-radius: 100%; cursor: pointer; width: 30px; height: 30px; background-color: rgba(0,0,0,0.5); font-size: 28px; color: #fff; }
    }
    .upload_box{ 
        width: 100%; position: relative; 
        .upload_input{ width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 2; opacity: 0; cursor: pointer; }
        .add_icon{
            position: relative; width: 30px; height: 30px;
            &::after{ content: ""; position: absolute; top: 0; left: 50%; width: 2px; height: 100%; background-color: #999; transform: translateX(-50%); }
            &::before{ content: ""; position: absolute; top: 50%; left: 0; width: 100%; height: 2px; background-color: #999; transform: translateY(-50%); }
        }
    }  
    .el-icon-close{ font-size: 20px; line-height: 20px; }
}
</style>