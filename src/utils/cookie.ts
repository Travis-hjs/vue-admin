interface CookieOption {
  /** 过期日期 */
  expires?: Date;
  /** 指定域名 */
  domain?: string;
}

/**
 * 获取`cookie`
 * @param key 目标对象`key`值
 */
export function getCookie(key: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift();
  return "";
}

/**
 * 设置`cookie`
 * @param key 目标对象`key`值
 * @param value 对应键值
 * @param option 配置项
 */
export function setCookie(key: string, value: string, option?: CookieOption) {
  let cookieString = `${key}=${value}; path=/`; // 默认路径为根路径

  if (option) {
    if (option.expires) {
      cookieString += `; expires=${option.expires.toUTCString()}`;
    }
    if (option.domain) {
      cookieString += `; domain=${option.domain}`;
    }
  }

  document.cookie = cookieString;
}

/**
 * 移除指定`cookie`
 * @param key 目标对象`key`值
 * @param options 配置项
 */
export function removeCookie(key: string, options?: Pick<CookieOption, "domain">) {
  const time = `expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  if (options && options.domain) {
    document.cookie = `${key}=; domain=${options.domain}; path=/; ${time}`;
  } else {
    document.cookie = `${key}=; path=/; ${time}`;
  }
}
