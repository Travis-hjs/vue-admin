/** 深层递归所有属性为可选 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

/** 深层递归所有属性为只读 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
}

/** 深层递归所有属性为必选选（貌似不生效） */
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? Required<T[P]> : T[P];
}

/** 运算符号 */
type NumberSymbols = "+" | "-" | "*" | "/";

/**
 * `JavaScript`类型
 * - 这里只枚举一些常见类型，后续根据使用场景自行添加即可
 */
type JavaScriptTypes = "string" | "number" | "array" | "object" | "boolean" | "function" | "null" | "undefined" | "regexp" | "promise" | "formdata";

/** 基础对象 */
interface BaseObj<T = string | number> {
  [key: string]: T
}

interface AjaxParams {
  /** 请求路径 */
  url: string,
  /** 请求方法 */
  method: "GET" | "POST" | "PUT" | "DELETE",
  /**
   * 传参对象
   * 
   * ### `json`传参则为`object`
   * ```js
   * const data = { price: 999, shopName: "商品名称" }
   * ```
   * 
   * ### 上传图片时为`FormData`
   * ```js
   * const data = new FormData(); 
   * data.append("img", file); // `img`是跟后台约定好的`key`字段
   * ```
   * 
   * ### 普通表单传参使用
   * ```js
   * const data = "name=hjs&id=123";
   * ```
   */
  data: object | string | FormData,
  /** 超时毫秒 */
  overtime?: number,
  /** `request`方法请求配置 */
  options?: {
    /** `XMLHttpRequest.header`设置对象 */
    headers?: { [key: string]: string }
    /**
     * 接口数据响应类型
     * - 默认`json`
     */
    responseType?: XMLHttpRequestResponseType
  }
  /** `XMLHttpRequest.header`设置对象 */
  headers?: { [key: string]: string }
  /**
   * 接口数据响应类型
   * - 默认`json`
   */
  responseType: XMLHttpRequestResponseType

  /** 成功回调 */
  success?(
    /** 响应结果 */
    res: any,
    /** 响应原数据结果 */
    response: XMLHttpRequest
  ): void,
  /** 失败回调 */
  fail?(value: XMLHttpRequest): void,
  /** 超时回调 */
  timeout?(value: XMLHttpRequest): void,
  /** 请求进度 */
  progress?(event: ProgressEvent<XMLHttpRequestEventTarget>): void
}

/** 接口请求基础响应数据 */
interface ApiResult<T = any> {
  /** 接口状态`code === 1`为成功 */
  code: number
  /** 接口响应数据 */
  data: T
  /** 接口响应信息 */
  msg: string
}

/** 接口请求列表响应数据 */
interface ApiResultList<T = any> extends PageInfo {
  /** 列表数据 */
  list: Array<T>
}

/** 页码信息 */
interface PageInfo {
  /** 一页多少条 */
  pageSize: number
  /** 当前页，从`1`开始 */
  currentPage: number
  /** 总数 */
  total?: number
}

interface Window {
  /**
   * 当前版本，方便在控制台查看调试用
   * @description 引用的是`package.json`中的`version`
   */
  version: string
}

/** `<base-table-btns>`组件列表对象 */
interface BaseTableBtnsItem<T = BaseObj> {
  /** 按钮文字 */
  text: string | ((row: T) => string)
  /** 
   * 按钮的操作类型，默认`primary`
   * - [element-文档](https://element.eleme.cn/#/zh-CN/component/button)
   */
  type?: "primary" | "success" | "info" | "warning" | "danger" | "text"
  /** 
   * 按钮图标`class`
   * - [element-文档](https://element.eleme.cn/#/zh-CN/component/icon)
   */
  icon?: string | ((row: T) => string)
  /** 是否禁用 */
  disabled?: boolean | ((row: T) => boolean)
  /** 是否加载状态 */
  loading?: boolean | ((row: T) => boolean)
  /** 是否显示该按钮，不设置则显示，功能等价于`v-if` */
  show?: boolean | ((row: T) => boolean)
  /** 点击事件 */
  click?: (row: T) => void
}

/** `<base-table :columns="columns">`组局的`columns`单个对象 */
interface BaseTableColumn {
  /** 表格列标题 */
  label: string
  /**
   * 对应表格数据值的`key`
   * - `"action-right"`为固定右边
   */
  prop: string
  /** 当需要自定义插槽去写表格模板时需要，字段和`prop`一致 */
  slotName?: string
  /** 当需要动态改变列数的时候设置指定`key`来保证显示的位置对应数据列表用 */
  key?: string
  /** 
   * 列宽度
   * - 推荐直接用`number`类型
   */
  width?: string | number
  /**
   * 列最新宽度
   * - 推荐直接用`number`类型
   */
  minWidth?: string | number
  /**
   * 超出...提示
   * - 默认`true`
   */
  tooltip?: boolean
  /** 
   * 固定位置
   * - 当`prop: "action-right"`时，不需要设置该值，固定为靠右
   */
  fixed?: "right" | "left" | "true"
  /**
   * 表格列对齐设置
   * - 默认为`"center"`
   * - 当`prop: "action-right"`时，不需要设置该值，固定为居中状态
   */
  align?: "left" | "center" | "right"
}
