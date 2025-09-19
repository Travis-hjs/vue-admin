/** 上传组件类型 */
export namespace UploadType {
  /** 上传图片值类型 */
  export interface Image<T = string | number> {
    /** 对应组件`uploadId` */
    id: T;
    /** 图片地址 */
    url: string;
    /** 上传接口返回原始数据 */
    apiData?: any;
  }

  /** 上传文件列表`item`类型 */
  export interface ListItem {
    /** 唯一标识 */
    key?: string;
    /** 文件名 */
    name?: string;
    /** 上传文件路径 */
    url: string;
  }

  export interface Command {
    /**
     * 指定文件类型
     * - 图片: `image/jpg,image/png,image/jpeg,.pdf,.gif`
     * - excel: `.xls,.xlsx`
     */
    accept?: string;
    /** 是否多选 */
    multiple?: boolean;
    /**
     * 上传图片最大体积`MB`
     * - 传`0`或不传则不限制
     */
    maxSize?: number;
    /**
     * 上传回调
     * - `<input onchange="change" />`
     * @param file 文件对象，由`multiple`指定是单个还是列表
     */
    change(file: File | Array<File>): void;
  }
}
