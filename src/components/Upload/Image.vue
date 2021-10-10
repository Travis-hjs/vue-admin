<template>
    <div class="the-upload-image">
        <div class="the-upload-content" :style="{ 'width': width }">
            <div v-if="src" class="the-upload-image-box">
                <img class="image" :src="src" :style="{ 'height': autoHeight ? null : height }">
                <div class="remove flex fvertical fcenter">
                    <svg-icon v-if="!disabled" name="delete" @click="removeImg()" />
                </div>
            </div>
            <div v-else class="the-upload-box flex fvertical fcenter" :style="{ 'height': height }">
                <div class="the-upload-add-icon"></div>
                <input v-if="!disabled" class="the-upload-input" type="file" accept="image/*" name="picture" ref="uploadinput" @change.stop="onUpload()">
            </div>
        </div>
        <p class="the-upload-tip" v-if="tip">{{ loading ? "上传中..." : tip }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { UploadChange } from "@/types/index";
import { uploadImg } from "@/api/common";

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

            // 判断大小
            if (file.size > props.maxSize * 1024 * 1024) {
                input.value = "";
                alert(`上传的文件不能大于 ${props.maxSize}M`);
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
                input.value = "";
                alert(res.msg);
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
@mixin time {
    transition: 0.2s all;
}

.the-upload-image {
    .the-upload-content {
        background-color: transparent;
        border: 1px dashed #d9d9d9;
        border-radius: 5px;
        overflow: hidden;
        @include time();
        &:hover { border-color: $theme; background-color: #fbfdff; }
        .the-upload-image-box { 
            position: relative; width: 100%; height: 100%; overflow: hidden;
            .image { display: block; width: 100%; }
            .remove {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); color: #f4f4f4; opacity: 0; @include time();
                &:hover { opacity: 1; }
            }
            .svg-icon { width: 28px; height: 28px; cursor: pointer; }
        }
        .the-upload-box { 
            width: 100%; position: relative;
            .the-upload-input { width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 2; opacity: 0; cursor: pointer; }
            .the-upload-add-icon {
                position: relative; width: 30px; height: 30px;
                transform: rotate(-45deg);
                @include closeIcon(#999, 100%, 2px);
            }
        }
    }
    .the-upload-tip { font-size: 12px; color: $theme; line-height: 20px; padding: 6px 4px; }
}
</style>