import config from "./config";
import { checkType, jsonParse } from "./index";
import store from "@/store";
import { message } from "@/utils/message";

/**
 * `http`请求
 * @author https://github.com/Travis-hjs
 * - [MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
 * - [掘金](https://juejin.cn/post/6844904066418491406/#heading-1)
 */
function ajax(params: AjaxParams) {
  /** XMLHttpRequest */
  const XHR = new XMLHttpRequest();
  /** 请求方法 */
  const method = params.method;
  /** 超时检测 */
  const timeout = params.timeout || 0;
  /** 请求链接 */
  let url = params.url;
  /** 非`GET`请求传参 */
  let body: string | FormData = "";
  /** `GET`请求传参 */
  let query = "";
  /** 传参数据类型 */
  const dataType = checkType(params.data);

  // 传参处理
  if (method === "GET") {
    // 解析对象传参
    if (dataType === "object") {
      for (const key in (params.data as any)) {
        query += "&" + key + "=" + (params.data as any)[key];
      }
    } else {
      console.warn("ajax 传参处理 GET 传参有误，需要的请求参数应为 object 类型");
    }
    if (query) {
      query = "?" + query.slice(1);
      url += query;
    }
  } else {
    body = ["object", "array"].includes(dataType) ? JSON.stringify(params.data) : params.data as FormData;
  }

  // 监听请求变化；XHR.status learn: http://tool.oschina.net/commons?type=5
  XHR.onreadystatechange = function () {
    if (XHR.readyState !== 4) return;
    if (XHR.status === 200 || XHR.status === 304) {
      params.success && params.success(XHR.response, XHR);
    } else {
      params.fail && params.fail(XHR);
    }
  }

  // 判断请求进度
  if (params.onProgress) {
    XHR.upload.addEventListener("progress", params.onProgress);
  }

  // XHR.responseType = "json"; // 设置响应结果为`json`这个一般由后台返回指定格式，前端无配置
  // XHR.withCredentials = true;	// 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
  XHR.responseType = params.responseType;
  XHR.open(method, url, true);

  // 设置对应的传参请求头，GET 方法不需要
  if (params.method !== "GET") {
    switch (dataType) {
      case "object":
      case "array":
        XHR.setRequestHeader("Content-Type", "application/json"); // `json`请求
        break;

      case "string":
        XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 表单请求，`id=1&type=2` 非`new FormData()`
        break;

      default:
        break;
    }
  }

  // 判断设置配置头信息
  if (params.headers) {
    for (const key in params.headers) {
      const value = params.headers[key];
      value && XHR.setRequestHeader(key, value);
    }
  }

  // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
  if (timeout > 0) {
    XHR.timeout = timeout;
    XHR.ontimeout = function () {
      XHR.abort();
      params.onTimeout && params.onTimeout(XHR);
    }
  }

  XHR.send(body);
}

/**
 * 获取响应结果并处理对应状态
 * @param result 
 * @param responseType 接口请求成功时，响应类型
 */
function getResultInfo(result: { statusCode: number, data: any }, responseType?: XMLHttpRequestResponseType) {
  const info: Api.Result = { code: result.statusCode, msg: "网络出错了", data: null }
  switch (result.statusCode) {
    case config.requestTimeout:
      info.msg = "网络超时了";
      break;
    case 200:
      info.code = checkType(result.data.code) === "number" ? result.data.code : 1;
      info.msg = result.data.message || "ok";
      info.data = result.data;
      // do some ... 这里可以做一些类型响应数据结构组装处理，有些时候后端返回的接口不一样
      // if (responseType === "blob") {}
      break;
    case 400:
      info.msg = "接口传参不正确";
      break;
    case 401:
      info.msg = "登录已过期";
      // TODO: 这里可以做确认弹框交互处理
      break;
    case 404:
      info.msg = "接口不存在";
      break;
    default:
      break;
  }
  if (result.statusCode >= 500) {
    info.msg = "服务器闹脾气了";
  }
  return info;
}

/**
 * 基础请求
 * @param method 请求方式
 * @param url 请求接口
 * @param data 请求数据
 * @param options 请求配置
 */
export default function request<T = any>(
  method: AjaxParams["method"],
  url: string,
  data?: AjaxParams["data"],
  options: Partial<Api.Options> = {}
) {
  const { headers = {}, responseType = "json", timeout, onProgress, domain } = options;
  return new Promise<Api.Result<T>>(function (resolve) {
    ajax({
      url: (domain || config.apiUrl) + url,
      method: method,
      headers: {
        "authorization": store.user.info.token, // TODO: 每次请求时带上 token
        ...headers
      },
      responseType: responseType,
      data: data || {},
      timeout: timeout || config.requestTimeout,
      success(res, xhr) {
        // console.log("请求成功", res);
        const info = getResultInfo({ statusCode: xhr.status, data: res });
        resolve(info);
      },
      fail(err) {
        const res = checkType(err.response) === "string" ? jsonParse(err.response) : err.response;
        const info = getResultInfo({ statusCode: err.status, data: res });
        // 全局的请求错误提示可以写在这里
        info.code !== 1 && message.error(info.msg);
        // do some ...
        resolve(info);
      },
      onTimeout() {
        console.warn("XMLHttpRequest 请求超时 !!!");
        const info = getResultInfo({ statusCode: config.requestTimeout, data: {} });
        // 全局的请求超时提示可以写在这里
        message.warning(info.msg);
        // do some ...
        resolve(info);
      },
      onProgress
    });
  })
}
