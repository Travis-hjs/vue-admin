export { default as UploadImage } from "./Image.vue";
export { default as UploadWrap } from "./Wrap.vue";
// export { default as UploadVideo } from "./Video.vue";

/** 上传组件`change`回调类型 */
export interface UploadChange<T = string | number> {
  /** 和当前上传组件绑定的`id` */
  id: T
  /** 图片路径 */
  src: string
  /** 上传接口返回原始数据 */
  result?: {
    fileName: string;
    fileUrl: string;
    size: number;
  };
}
