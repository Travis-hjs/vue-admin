<script lang="ts">
/** 上传图片组件 */
export default {
  name: "UploadImage"
}
</script>
<script lang="ts" setup>
import { type PropType, ref } from "vue";
import { uploadFile } from "@/api/common";
import { message } from "@/utils/message";
import type { UploadChange } from "./index";
import { Icon } from "../Icon";

const props = defineProps({
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
    default: 5
  },
  /** 是否禁用状态 */
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (event: "change", res: UploadChange<any>): void
}>();

/** 上传组件`input`节点 */
const uploadInput = ref<HTMLInputElement>();
/** 上传状态 */
const loading = ref(false);

/** 上传图片 */
async function onUpload() {
  const input = uploadInput.value!;
  const file = input.files![0];
  input.value = ""; // 使用完一定要清空
  // console.log("上传图片文件 >>", file);

  // 判断大小
  if (file.size > props.maxSize * 1024 * 1024) {
    message.warning(`上传的文件不能大于 ${props.maxSize}M`);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  loading.value = true;
  const res = await uploadFile(formData)
  loading.value = false;
  console.log("上传图片 >>", res);
  if (res.code === 1) {
    const result: string = res.data.url;
    emit("change", {
      id: props.uploadId,
      src: result
    });
  }
}

/** 清除当前图片 */
function removeImg() {
  emit("change", {
    id: props.uploadId,
    src: ""
  });
}
</script>
<template>
  <div class="the-upload-image">
    <div class="the-upload-content" :style="{ 'width': width }">
      <div v-if="src" class="the-upload-image-box">
        <img class="image" :src="src" :style="{ 'height': autoHeight ? undefined : height }">
        <div class="remove fvc">
          <Icon v-if="!disabled" size="28px" name="ep:delete" class="cursor-pointer" @click="removeImg()" />
        </div>
      </div>
      <div v-else class="the-upload-box fvc" :style="{ 'height': height }">
        <div class="the-upload-add-icon"></div>
        <input
          v-if="!disabled"
          class="the-upload-input"
          type="file"
          accept="image/*"
          name="picture"
          ref="uploadInput"
          @change.stop="onUpload()"
        >
      </div>
    </div>
    <p class="the-upload-tip" v-if="tip">{{ loading ? "上传中..." : tip }}</p>
  </div>
</template>
<style lang="scss">
@import "@/styles/mixins.scss";

.the-upload-image {
  .the-upload-content {
    background-color: transparent;
    border: 1px dashed #d9d9d9;
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: var(--transition);

    &:hover {
      border-color: var(--blue);
      background-color: #fbfdff;
    }

    .the-upload-image-box {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .image {
        display: block;
        width: 100%;
        object-fit: fill;
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
        transition: var(--transition);

        &:hover {
          opacity: 1;
        }
      }
    }

    .the-upload-box {
      width: 100%;
      position: relative;

      .the-upload-input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        opacity: 0;
        cursor: pointer;
      }

      .the-upload-add-icon {
        position: relative;
        width: 30px;
        height: 30px;
        transform: rotate(-45deg);
        @include close-icon(#999, 100%, 2px);
      }
    }
  }

  .the-upload-tip {
    font-size: 12px;
    color: var(--blue);
    line-height: 20px;
    padding: 6px 4px;
  }
}
</style>
