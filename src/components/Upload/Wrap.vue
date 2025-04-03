<script lang="ts">
/** 上传包裹组件 */
export default {
  name: "UploadWrap"
}
</script>
<script lang="ts" setup>
import { type PropType, ref } from "vue";
import { uploadFile } from "@/api/common";
import { message } from "@/utils/message";
import type { UploadChange } from "./index";

const props = defineProps({
  /** 组件`id`,多个组件使用时区分用 */
  uploadId: {
    type: [String, Number],
    default: "",
  },
  /** 上传文件类型 */
  accept: {
    type: Array as PropType<Array<string>>,
    default: () => ["image/jpg", "image/png", "image/jpeg", "image/gif"]
  },
  /** 上传文件最大体积（M） */
  maxSize: {
    type: Number,
    default: 5,
  },
  /**
   * 上传文件名
   * @example
   * ```js
   * const formData = new FormData();
   * formData.append(this.uploadFileName, file);
   * ```
   */
  uploadFileName: {
    type: String,
    default: "file",
  },
  /** 是否展示加载遮罩效果 */
  showLoading: {
    type: Boolean,
    default: true,
  },
  /** 上传时接口函数，默认是上传图片`uploadFile`，传参方式参考`uploadFile` */
  uploadFn: {
    type: Function as PropType<() => Promise<Api.Result<any>>>,
    default: undefined
  },
  // 上传前的判断
  beforeUploadFn: {
    type: Function as PropType<() => boolean>,
    default: undefined,
  },
  /** 额外的参数 */
  uploadParams: {
    type: Object,
    default: () => ({})
  }
});

const loading = ref(false);

const uploadInput = ref<HTMLInputElement>();

const emit = defineEmits<{
  (event: "load" , res: boolean): void
  (event: "change" , res: UploadChange<any>): void
}>()

function beforeUpload() {
  if (typeof props.beforeUploadFn === "function") {
    return props.beforeUploadFn();
  }
  return true;
};

function checkUpload() {
  if (!beforeUpload()) return;
  uploadInput.value!.click();
};

/** 上传图片 */
async function onUpload() {
  if (loading.value) return;

  const file = uploadInput.value!.files![0];
  // console.log("上传图片文件 >>", file);

  // 用完就清空
  uploadInput.value!.value = "";

  // 判断大小
  if (file.size > props.maxSize * 1024 * 1024) {
    return message.warning(`上传的文件不能大于 ${props.maxSize}M`);
  }

  const formData = new FormData();

  formData.append(props.uploadFileName, file);
  for (const key in props.uploadParams) {
    formData.append(key, props.uploadParams[key])
  }

  loading.value = true;
  emit("load", true);
  const uploadFunction = props.uploadFn || uploadFile;
  const res = await uploadFunction(formData);
  loading.value = false;
  emit("load", false);
  // console.log("上传文件 >>", res);
  if (res.code === 1) {
    const result = res.data.fileUrl;
    emit("change", {
      id: props.uploadId,
      src: result,
      result: res.data
    });
  }
};
</script>
<template>
  <div class="upload-wrap" v-loading="showLoading && loading">
    <slot></slot>
    <div class="upload-input" @click="checkUpload"></div>
    <input
      v-show="false"
      type="file"
      ref="uploadInput"
      :accept="accept.toString()"
      @click="beforeUpload"
      @change="onUpload()"
    >
  </div>
</template>
<style lang="scss">
.upload-wrap {
  // width: 100%;
  display: inline-block;
  position: relative;
  z-index: 1;

  .upload-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
  }
}
</style>