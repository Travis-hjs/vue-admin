<template>
  <div class="upload-wrap" v-loading="showLoading && loading">
    <slot></slot>
    <div class="upload-input" @click="checkUpload"></div>
    <input style="display:none" type="file" ref="uploadInput" :accept="accept.toString()" @click="beforeUpload" @change="onUpload()">
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { uploadImg } from "@/api/common";

/**
 * 上传包裹器`@change`回调类型
 */
export interface UploadChange<T = string | number> {
  /** 和当前上传组件绑定的`id` */
  id: T
  /** 文件路径 */
  result: string
  /** 接口原始数据 */
  response: any
}

/**
 * 上传包裹组件，用法看`README.md`
 */
@Component({
  name: "UploadWrap",
})
export default class UploadWrap extends Vue {
  /** 组件`id`,多个组件使用时区分用 */
  @Prop({
    type: [String, Number],
    default: "",
  })
  uploadId!: string | number;

  /** 上传文件类型 */
  @Prop({
    type: Array,
    default: () => ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'],
  })
  accept!: Array<string>;
  
  /** 上传文件最大体积（M） */
  @Prop({
    type: Number,
    default: 10,
  })
  maxSize!: number;

  /**
   * 上传文件名
   * @example
   * ```js
   * const formData = new FormData();
   * formData.append(this.uploadFileName, file);
   * ```
   */
  @Prop({
    type: String,
    default: "file",
  })
  uploadFileName!: string;

  /** 是否展示加载遮罩效果 */
  @Prop({
    type: Boolean,
    default: true,
  })
  showLoading!: boolean;

  /** 上传时接口函数，默认是上传图片`uploadImg`，传参方式参考`uploadImg` */
  @Prop({
    type: Function,
    default: undefined
  })
  uploadFn!: (res: FormData) => Promise<ApiResult<any>>;

  /** 上传前的判断 */
  @Prop({
    type: Function,
    default: undefined
  })
  beforeUploadFn!: () => boolean;

  loading = false;

  $refs!: {
    uploadInput: HTMLInputElement
  }
  
  /** 上传前检验 */
  beforeUpload(){
    if (this.beforeUploadFn && typeof this.beforeUploadFn === "function"){
      return this.beforeUploadFn()
    }
    return true;
  }

  checkUpload(){
    if(!this.beforeUpload()) return
    this.$refs.uploadInput.click();
  }

  /** 上传图片 */
  async onUpload() { 
    if (this.loading) return;
    const accept = this.accept;
    const input = this.$refs.uploadInput;
    const file = input.files![0];
    // console.log("上传图片文件 >>", file);

    // 用完就清空
    input.value = "";

    // 判断文件类型
    if (accept.indexOf(file.type) < 0) {
      this.$message.warning("文件格式只支持：" + accept.toString());
      return;
    }

    // 判断大小
    if (file.size > this.maxSize * 1024 * 1024) {
      this.$message.warning(`上传的文件不能大于 ${this.maxSize}M`);
      return;
    }

    const formData = new FormData();

    formData.append(this.uploadFileName, file);

    this.loading = true;
    this.$emit("load", true);
    const uploadFunction = this.uploadFn || uploadImg;
    const res = await uploadFunction(formData);
    this.loading = false;
    this.$emit("load", false);
    // console.log("上传文件 >>", res);
    if (res.code === 1) {
      const result = res.data.url;
      this.$emit("change", {
        id: this.uploadId,
        result: result,
        response: res
      });
    }
  }

}
</script>
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