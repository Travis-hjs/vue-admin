import config from "./config";
import { 
    AjaxParams, ApiResult,
} from "../types";

/**
 * `http`请求
 * @author https://github.com/Hansen-hjs
 * - [MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
 * - [掘金](https://juejin.cn/post/6844904066418491406/#heading-1)
 */
function ajax(params: AjaxParams) {
    /** XMLHttpRequest */
    const XHR = new XMLHttpRequest();
    /** 请求方法 */
    const method = params.method;
    /** 超时检测 */
    const overtime = params.overtime || 0;
    /** 请求链接 */
    let url = params.url;
    /** 非`GET`请求传参 */
    let body = null;
    /** `GET`请求传参 */
    let query = "";

    // 传参处理
    if (method === "GET") {
        // 解析对象传参
        for (const key in params.data) {
            query += "&" + key + "=" + params.data[key];
        }
        if (query) {
            query = "?" + query.slice(1);
            url += query;
        }
    } else {
        body = JSON.stringify(params.data); // 若后台没设置接收 JSON 则不行，需要使用`params.formData`方式传参
    }

    // 监听请求变化；XHR.status learn: http://tool.oschina.net/commons?type=5
    XHR.onreadystatechange = function () {
        if (XHR.readyState !== 4) return;
        if (XHR.status === 200 || XHR.status === 304) {
            params.success && params.success(JSON.parse(XHR.response), XHR);
        } else {
            params.fail && params.fail(XHR);
        }
    }

    // 判断请求进度
    if (params.progress) {
        XHR.addEventListener("progress", params.progress);
    }

    // XHR.responseType = "json"; // 设置响应结果为`json`这个一般由后台返回指定格式，前端无配置
    // XHR.withCredentials = true;	// 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
    XHR.open(method, url, true);

    // 判断传参类型，`json`或者`form`表单
    if (params.formData) {
        body = params.formData;
    } else {
        // 设置一个默认 json 传参的头配置
        XHR.setRequestHeader("Content-Type", "application/json");
    }

    // 判断设置配置头信息
    if (params.headers) {
        for (const key in params.headers) {
            const value = params.headers[key];
            XHR.setRequestHeader(key, value);
        }
    }

    // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
    if (overtime > 0) {
        XHR.timeout = overtime;
        XHR.ontimeout = function () {
            XHR.abort();
            params.timeout && params.timeout(XHR);
        }
    }

    XHR.send(body);
}

function getResultInfo(result: { statusCode: number, data: any }) {
    const info: ApiResult = { code: -1, msg: "网络出错了", data: null }
    switch (result.statusCode) {
        case config.requestOvertime:
            info.msg = "网络超时了";
            break;
        case 200:
            info.code = result.data.code;
            info.msg = result.data.message || "ok";
            info.data = result.data;
            break;
        case 400:
            info.msg = "接口传参不正确";
            break;
        case 401:
            info.msg = "登录已过期";
            break;
        case 403:
            info.msg = "暂无权限";
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
 * @param formData 表单式传参
 * @param headers 请求头信息
 */
export default function request(
    method: AjaxParams["method"],
    url: string,
    data?: object,
    formData?: AjaxParams["formData"],
    headers?: AjaxParams["headers"]
) {
    return new Promise<ApiResult>(function(resolve, reject) {
        ajax({
            url: config.apiUrl + url,
            method: method,
            headers: headers,
            data: data || {},
            formData: formData,
            overtime: config.requestOvertime,
            success(res, xhr) {
                // console.log("请求成功", res);
                const info = getResultInfo({ statusCode: xhr.status, data: res });
                resolve(info);
            },
            fail(err) {
                const info = getResultInfo({ statusCode: err.status, data: null });
                if (err.response.charAt(0) == "{") {
                    info.data = JSON.parse(err.response);
                }
                // 全局的请求错误提示可以写在这里
                // do some ...
                resolve(info);
            },
            timeout() {
                console.warn("XMLHttpRequest 请求超时 !!!");
                const info = getResultInfo({ statusCode: config.requestOvertime, data: null });
                // 全局的请求超时提示可以写在这里
                // do some ...
                resolve(info);
            }
        });
    })
}