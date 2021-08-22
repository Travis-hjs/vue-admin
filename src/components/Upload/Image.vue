<template>
    <div class="the_upload_img">
        <div class="upload_content" :style="{ 'width': width }" v-loading="loading">
            <div v-if="src" class="image_box">
                <img class="image" :src="src" :style="{ 'height': autoHeight ? null : height }">
                <div class="remove flex fvertical fcenter">
                    <i v-if="!disabled" class="el-icon-delete" @click="removeImg()" />
                </div>
            </div>
            <div v-else class="upload_box flex fvertical fcenter" :style="{ 'height': height }">
                <div class="add_icon"></div>
                <input v-if="!disabled" class="upload_input" type="file" name="picture" ref="uploadinput" @change.stop="onUpload()">
            </div>
        </div>
        <p class="upload_tip" v-if="tip">{{ loading ? "上传中..." : tip }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { UploadChange } from "@/utils/interfaces";
import { uploadImg } from "@/api/common";
import utils from "@/utils";

/** 上传图片组件 */
export default defineComponent({
    name: "UploadImage",
    props: {
        /** 组件上传图片路径 */
        src: {
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
            type: String,
            default: "178px"
        },
        /** 图片高度 */
        height: {
            type: String,
            default: "178px"
        },
        /** 是否自动高度（针对图片） */
        autoHeight: {
            type: Boolean,
            default: false
        },
        /** 图片上传提示 */
        tip: {
            type: [String, Number],
            default: ""
        },
        /** 上传图片最大体积（M） */
        maxSize: {
            type: Number,
            default: 2
        },
        /** 是否禁用状态 */
        disabled: {
            type: Boolean,
            default: false
        }
    },
    setup(props, context) {
        /** 上传组件`input`节点 */
        const uploadinput = ref<HTMLInputElement>(null as any);
        /** 上传状态 */
        const loading = ref(false);

        /**
         * 发送数据到父组件中
         * @param info 数据对象
        */
        function emitChange(info: UploadChange) {
            context.emit("change", info);
        }

        /** 上传图片 */
        async function onUpload() {
            const input = uploadinput.value;
            const file = (input.files as FileList)[0];
            // console.log("上传图片文件 >>", file);
            
            /** 上传类型数组 */
            const typeList = ["image/jpg", "image/png", "image/jpeg", "image/gif"];

            // 用完就清空
            input.value = "";

            // 判断文件类型
            if (typeList.indexOf(file.type) < 0) {
                utils.showWarning("文件格式只支持：jpg、png、gif");
                return;
            }

            // 判断大小
            if (file.size > props.maxSize * 1024 * 1024) {
                utils.showWarning(`上传的文件不能大于 ${props.maxSize}M`);
                return;
            }

            // const formData = new FormData();
            // formData.append("file", file);

            loading.value = true;
            const res = await uploadImg(file)
            loading.value = false;
            console.log("上传图片 >>", res);
            if (res.code === 1) {
                const result: string = res.data.img;
                emitChange({
                    id: props.uploadId,
                    src: result
                })
            } else {
                utils.showError(res.msg);
            }
        }

        /** 清除当前图片 */
        function removeImg() {
            emitChange({
                id: props.uploadId,
                src: ""
            })
        }

        return {
            uploadinput,
            loading,
            onUpload,
            removeImg
        }
    }
})
</script>

<style lang="scss">
@import "@/styles/variables.scss";
@mixin time() { transition: 0.2s all; }
@mixin addIcon() { content: ""; position: absolute; background-color: #999; }

.the_upload_img {
    .upload_content {
        background-color: transparent;
        border: 1px dashed #d9d9d9;
        border-radius: 5px;
        overflow: hidden;
        @include time();
        &:hover { border-color: $theme; background-color: #fbfdff; }
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
    .upload_tip { font-size: 12px; color: $theme; line-height: 20px; padding: 6px 4px; }
}
</style>