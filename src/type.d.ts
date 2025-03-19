// 类型引用
/// <reference path="./components/type.d.ts" />
// 全局组件类型声明引用
/// <reference path="./components/global-components.d.ts" />

/** 作用与`readonly`相反的泛型工具 */
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

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

/**
 * 与`keyof`对应的工具类型
 * @example
 * ```ts
 * const size = {
 *   small: "S",
 *   medium: "M",
 *   max: "XL",
 * } as const
 * 
 * function test(val: ValueOf<typeof size>) {
 *   // val => "S" | "M" | "XL"
 * }
 * ```
 */
type ValueOf<T> = T[keyof T];

// /**
//  * 获取嵌套属性的键
//  * - 辅助类型，用于生成嵌套属性的字符串拼写
//  * - 这里`(string | number)`是为了兼容数组下标，在深层嵌套时也能正确拼写
//  */
// type NestedKeyOf<T extends object> = {
//   [K in keyof T & (string | number)]: T[K] extends object
//     ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
//     : `${K}`;
// }[keyof T & (string | number)];

/**
 * 获取嵌套属性的键
 * - 辅助类型，用于生成嵌套属性的字符串拼写
 * - 这里`(string | number)`是为了兼容数组下标，在深层嵌套时也能正确拼写
 */
type NestedKeyOf<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends Array<any>
    ? never // 排除数组类型
    : T[K] extends object
      ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
      : `${K}`;
}[keyof T & (string | number)];

/** 运算符号 */
type NumberSymbols = "+" | "-" | "*" | "/";

/**
 * `JavaScript`类型映射表
 * - 这里只枚举一些常见类型，后续根据使用场景自行添加即可
 */
interface JavaScriptType {
  string: string
  number: number
  boolean: boolean
  null: null
  undefined: undefined
  array: Array<any>
  object: object
  regexp: RegExp
  function: Function
  promise: Promise<any>
  formdata: FormData
}

/** `JavaScript`类型 */
type JavaScriptTypes = keyof JavaScriptType;


/** 基础对象 */
interface BaseObj<T = string | number> {
  [key: string]: T
}

interface AjaxParams {
  /** 请求路径 */
  url: string
  /** 请求方法 */
  method: "GET" | "POST" | "PUT" | "DELETE"
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
  data: object | string | FormData
  /** 超时毫秒 */
  timeout?: number
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
  ): void
  /** 失败回调 */
  fail?(value: XMLHttpRequest): void
  /** 超时回调 */
  onTimeout?(value: XMLHttpRequest): void
  /** 请求进度（上传文件） */
  onProgress?(event: ProgressEvent<XMLHttpRequestEventTarget>): void
}

/** 接口请求类型集合 */
declare namespace Api {
  /** `request`方法请求配置 */
  interface Options extends Pick<AjaxParams, "responseType" | "onProgress"> {
    /** `XMLHttpRequest.header`设置对象 */
    headers: { [key: string]: string };
    /** 单独为当前接口设置超时毫秒 */
    timeout: number;
    /**
     * 请求域名
     * - 会覆盖默认的请求域名
     */
    domain: string;
  }

  /** 接口请求基础响应数据 */
  interface Result<T = any> {
    /** 接口状态`code === 1`为成功 */
    code: number
    /** 接口响应数据 */
    data: T
    /** 接口响应信息 */
    msg: string
  }

  interface List<T = any> extends PageInfo {
    /** 列表数据 */
    list: Array<T>
  }
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

