import Cookies from "js-cookie";

/**
 * 获取`cookie`
 * @param key 目标对象`key`值
 */
export function getCookie(key: string) {
  return Cookies.get(key) || "";
}

/**
 * 设置`cookie`
 * @param key 目标对象`key`值
 * @param value 对应键值
 * @param options 配置项
 */
export function setCookie(key: string, value: string, options?: Cookies.CookieAttributes) {
  if (options) {
    Cookies.set(key, value, options);
  } else {
    Cookies.set(key, value);
  }
}

/**
 * 移除指定`cookie`
 * @param key 目标对象`key`值
 * @param options 
 */
export function removeCookie(key: string, options?: Cookies.CookieAttributes) {
  if (options) {
    Cookies.remove(key, options);
  } else {
    Cookies.remove(key);
  }
}
