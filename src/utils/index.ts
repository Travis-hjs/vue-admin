/**
 * 检测类型
 * @param target 检测的目标
 */
export function checkType(target: any) {
  const value: string = Object.prototype.toString.call(target);
  const result = (value.match(/\[object (\S*)\]/) as RegExpMatchArray)[1];
  return result.toLocaleLowerCase() as JavaScriptTypes;
}

/**
 * 判断任意值的类型，作用与`checkType`一致，外加一个辅助功能：当函数返回值为`true`时，可以传入泛型来确定`target`的类型（类型收窄）
 * @param target 判断目标
 * @param type 判断的类型
 * - 当要判断的类型为`object`时，需要传一个泛型去确定它的类型，因为在`ts`中`object`是一个特殊类型无法确定
 * @example
 * ```ts
 * type User = {
 *   id: number
 *   name: string
 * }
 * 
 * function setData(params: string | User | Array<User>) {
 *   if (isType<User>(params, "object")) {
 *     params.name = "xxx";
 *   }
 *   if (isType(params, "array")) {
 *     params.push({ id: 1, name: "add" });
 *   }
 *   // ...do some
 * }
 * ```
 */
export function isType<T>(target: any, type: T extends "object" ? T : JavaScriptTypes): target is T extends JavaScriptTypes ? JavaScriptType[T] : T {
  return checkType(target) === type;
}
// export function isType<T>(target: any, type: JavaScriptTypes): target is T {
//   return checkType(target) === type;
// }

/**
 * 修改属性值-只修改之前存在的值
 * @param target 修改的目标
 * @param value 修改的内容
 */
export function modifyData<T extends object>(target: T, value: DeepPartial<T>) {
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const item = value[key] as any;
      const _target = target[key];
      // 深层逐个赋值
      if (isType(_target, "object")) {
        modifyData(_target, item);
      } else {
        target[key] = item;
      }
    }
  }
}

/**
 * 设置属性值-之前不存在的值也根据传入的`value`值去设置
 * @param target 设置的目标
 * @param value 设置的内容
 */
export function setData<T extends object>(target: T, value: T) {
  for (const key in value) {
    target[key] = value[key];
  }
}

/**
 * 格式化日期
 * @param value 指定日期
 * @param format 格式化的规则
 * @example
 * ```js
 * formatDate();
 * formatDate(1603264465956);
 * formatDate(1603264465956, "h:m:s");
 * formatDate(1603264465956, "Y年M月D日");
 * ```
 */
export function formatDate(value: string | number | Date = Date.now(), format = "Y-M-D h:m:s") {
  if (["null", null, "undefined", undefined, ""].includes(value as any)) return "";
  // ios 和 mac 系统中，带横杆的字符串日期是格式不了的，这里做一下判断处理
  if (typeof value === "string" && new Date(value).toString() === "Invalid Date") {
    value = value.replace(/-/g, "/");
  }
  const formatNumber = (n: number) => `0${n}`.slice(-2);
  const date = new Date(value);
  const formatList = ["Y", "M", "D", "h", "m", "s"];
  const resultList = [
    date.getFullYear().toString(),
    formatNumber(date.getMonth() + 1),
    formatNumber(date.getDate()),
    formatNumber(date.getHours()),
    formatNumber(date.getMinutes()),
    formatNumber(date.getSeconds())
  ];
  for (let i = 0; i < resultList.length; i++) {
    format = format.replace(formatList[i], resultList[i]);
  }
  return format;
}

/**
 * 点击复制
 * @param text 复制的内容
 * @param success 成功回调
 * @param fail 出错回调
 */
export function copyText(text: string, success?: () => void, fail?: (res: string) => void) {
  text = text.replace(/(^\s*)|(\s*$)/g, "");
  if (!text) {
    fail && fail("复制的内容不能为空！");
    return;
  }
  const id = "the-clipboard";
  let clipboard = (document.getElementById(id) as HTMLTextAreaElement);
  if (!clipboard) {
    clipboard = document.createElement("textarea");
    clipboard.id = id;
    clipboard.readOnly = true;
    clipboard.style.cssText = "font-size: 15px; position: fixed; top: -1000%; left: -1000%;";
    document.body.appendChild(clipboard);
  }
  clipboard.value = text;
  clipboard.select();
  clipboard.setSelectionRange(0, clipboard.value.length);
  const state = document.execCommand("copy");
  if (state) {
    success && success();
  } else {
    fail && fail("复制失败");
  }
}

/**
 * 输入只能是数字
 * @param value 
 * @param decimal 是否要保留小数
 * @param negative 是否可以为负数
 */
export function inputOnlyNumber(value: string | number, decimal?: boolean, negative?: boolean) {
  let result = value.toString().trim();
  if (result.length === 0) return "";
  const minus = (negative && result[0] == "-") ? "-" : "";
  if (decimal) {
    result = result.replace(/[^0-9.]+/ig, "");
    let array = result.split(".");
    if (array.length > 1) {
      result = array[0] + "." + array[1];
    }
  } else {
    result = result.replace(/[^0-9]+/ig, "");
  }
  return minus + result;
}

/**
 * 深度克隆对象或数组
 * @param target 
 */
export function deepClone<T>(target: T) {
  const cache = new Map();
  function clone(value: any): T {
    // 处理空和非对象类型
    if (!value || typeof value !== "object") return value;
    // 处理其他特殊类型
    if (value instanceof Date) {
      return new Date(value) as any;
    }
    if (value instanceof RegExp) {
      return new RegExp(value) as any;
    }
    if (value instanceof Map) {
      return new Map(Array.from(value, ([key, val]) => [clone(key), clone(val)])) as any;
    }
    if (value instanceof Set) {
      return new Set(Array.from(value, val => clone(val))) as any;
    }
    // 处理循环引用
    if (cache.has(value)) {
      return cache.get(value);
    }
    // 最后才到基础类型
    const result: any = Array.isArray(value) ? [] : {};
    cache.set(value, result);
    for (const key in value) {
      result[key] = clone(value[key]);
    }
    return result;
  }
  return clone(target);
}

/**
 * 判断是否外部链接
 * @param path 路径
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * `JSON`转路径传参
 * @param params `JSON`对象
 * @example 
 * ```js
 * const info = { name: "hjs", id: 123 };
 * const val = jsonToPath(info);
 * console.log(val); // "name=hjs&id=123"
 * ```
 */
export function jsonToPath(params: { [key: string]: number | string | boolean }) {
  let result = "";
  for (const key in params) {
    result += `&${key}=${params[key]}`;
  }
  return result.slice(1);
}

/**
 * `JSON`格式化对象，内置错误捕捉处理，错误时返回默认值
 * - 默认返回空对象: `{}`
 * @param target 要格式化的目标对象
 * @param defaultValue 默认返回值
 */
export function jsonParse<T = any>(target: any, defaultValue: any = {}) {
  let result: T = defaultValue;
  if (isType(target, "string")) {
    try {
      result = JSON.parse(target);
    } catch (error) {
      console.warn("JSON格式化对象错误 >>", error);
    }
  }
  return result;
}

/** 检查是否移动端 */
export function isMobile() {
  const pattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i;
  return pattern.test(navigator.userAgent);
}
