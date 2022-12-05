/**
 * 上传组件`change`回调类型
 */
interface UploadChange<T = string | number> {
  /** 和当前上传组件绑定的`id` */
  id: T
  /** 图片路径 */
  src: string
}
