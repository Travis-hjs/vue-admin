<template>
  <div class="base-upload-image">
    <div class="base-upload-content" :style="{ 'width': width }" v-loading="loading">
      <div v-if="src" class="image-box">
        <img class="image" :src="src" :style="{ 'height': autoHeight ? '' : height }">
        <div class="remove fvc">
          <i class="upload-icon el-icon-delete" @click="removeImg()"></i>
          <i class="upload-icon el-icon-document-copy" @click="onCopy()"></i>
        </div>
      </div>
      <div v-else class="upload-box fvc" :style="{ 'height': height }">
        <div class="add-icon"></div>
        <input class="upload-input" type="file" name="picture" ref="uploadInput" :accept="accept.toString()" @change="onUpload()">
      </div>
    </div>
    <p class="upload-tip" v-if="tip">{{ loading ? "上传中..." : tip }}</p>
  </div>
</template>
<script lang="ts">
/** 单个上传图片组件 */
export default {
  name: "UploadImage"
}
</script>
<script lang="ts" setup>
import { ref } from "vue"
import { copyText } from "@/utils";
import { uploadFile } from "@/api/common";
import { message } from "@/utils/message";
import type { UploadChange } from "./index";

const props = defineProps({
  /** 组件上传图片路径 */
  src: {
    type: String,
    default: "",
  },
  /** 组件`id` */
  uploadId: {
    type: [String, Number],
    default: "",
  },
  width: {
    type: String,
    default: "178px",
  },
  height: {
    type: String,
    default: "178px",
  },
  /** 是否自动高度（针对图片） */
  autoHeight: {
    type: Boolean,
    default: false,
  },
  /** 图片上传提示 */
  tip: {
    type: [String, Number],
    default: "",
  },
  /** 上传图片最大体积（M） */
  maxSize: {
    type: Number,
    default: 5,
  },
  /** 是否需要复制图片地址功能 */
  copy: {
    type: Boolean,
    default: true
  },
  /** 上传文件类型 */
  accept: {
    type: Array,
    default: () => ["image/jpg", "image/png", "image/jpeg", "image/gif"]
  },
})

const loading = ref(false);

const uploadInput = ref<HTMLInputElement>();

const emit = defineEmits<{
  (event: "change", res: UploadChange<any>): void
}>()

/** 清除当前图片 */
function removeImg() {
  emit("change", {
    id: props.uploadId,
    src: "",
  });
};

function onCopy() {
  copyText(props.src, () => message.success("复制图片地址成功！"), tip => message.error(tip));
};

/** 上传图片 */
async function onUpload() {
  const input = uploadInput.value!;
  const file = input.files![0];
  input.value = ""; // 用完记得清空
  // 判断大小
  if (file.size > props.maxSize * 1024 * 1024) {
    return message.warning(`上传的文件不能大于 ${props.maxSize}M`);
  }

  const formData = new FormData();

  formData.append("file", file);
  loading.value = true;
  const res = await uploadFile(formData);
  loading.value = false;
  console.log("上传图片 >>", res);
  if (res.code === 1) {
    const result = res.data.url;
    emit("change", {
      id: props.uploadId,
      src: result,
      // result: res.data
    });
  }
};

</script>
<style lang="scss">
@mixin time() {
  transition: 0.2s all;
}

@mixin addIcon() {
  content: "";
  position: absolute;
  background-color: #999;
}

.base-upload-image {
  .base-upload-content {
    background-color: transparent;
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    overflow: hidden;
    @include time();

    &:hover {
      border-color: var(--blue);
      background-color: #fbfdff;
    }

    .image-box {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .image {
        display: block;
        width: 100%;
      }

      .remove {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: #f4f4f4;
        opacity: 0;
        @include time();

        &:hover {
          opacity: 1;
        }
        .upload-icon {
          font-size: 28px;
          cursor: pointer;
        }
        .upload-icon + .upload-icon {
          margin-left: 6px;
        }
      }

      .btn-icon {
        font-size: 24px;
        color: #f5f5f5;
        cursor: pointer;
      }

      .btn-icon+.btn-icon {
        margin-left: 10px;
      }
    }

    .upload-box {
      width: 100%;
      position: relative;

      .upload-input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        opacity: 0;
        cursor: pointer;
      }

      .add-icon {
        position: relative;
        width: 30px;
        height: 30px;

        &::after {
          @include addIcon();
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          transform: translateX(-50%);
        }

        &::before {
          @include addIcon();
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          transform: translateY(-50%);
        }
      }
    }
  }

  .upload-tip {
    font-size: 12px;
    color: var(--blue);
    line-height: 20px;
    padding: 6px 4px;
  }
}
</style>