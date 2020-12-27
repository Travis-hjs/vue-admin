import config from "../modules/Config";
import { Message } from "element-ui";
import { 
    AjaxParams, 
    ApiResult
} from "./interfaces";

/**
 * `http`请求 [MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
 * @author https://github.com/Hansen-hjs
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
    let payload = null;
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
        // 若后台没设置接收 JSON 则不行 需要跟 GET 一样的解析对象传参
        payload = JSON.stringify(params.data);
    }

    // 监听请求变化
    // XHR.status learn: http://tool.oschina.net/commons?type=5
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

    // XHR.responseType = "json";
    // 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
    // XHR.withCredentials = true;	
    XHR.open(method, url, true);

    // 判断是否上传文件通常用于上传图片，上传图片时不需要设置头信息
    if (params.file) {
        payload = params.file;
        // XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // 默认就是这个，设置不设置都可以
    } else {
        // XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHR.setRequestHeader("Content-Type", "application/json");
    }

    // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
    if (overtime > 0) {
        XHR.timeout = overtime;
        XHR.ontimeout = function () {
            XHR.abort();
            params.timeout && params.timeout(XHR);
        }
    }

    XHR.send(payload);
}

function getResultInfo(result: { statusCode: number, data: any }) {
    const info: ApiResult = { state: -1, msg: "网络出错了", data: null }
    switch (result.statusCode) {
        case config.requestOvertime:
            info.msg = "网络超时了";
            break;
        case 200:
            info.state = 1;
            info.msg = "ok";
            info.data = result.data;
            break;
        case 400:
            info.msg = "接口传参不正确";
        case 403:
            info.msg = "登录已过期";
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
 * @param success 成功回调
 * @param fail 失败回调
 * @param upload 上传图片 FormData
 */
export default function request(
    method: AjaxParams["method"],
    url: string,
    data?: object,
    success?: (res: ApiResult, xhr: XMLHttpRequest) => void,
    fail?: (error: ApiResult) => void,
    upload?: AjaxParams["file"]
) {
    return new Promise<any>(function(resolve, reject) {
        ajax({
            url: config.apiUrl + url,
            method: method,
            data: data || {},
            file: upload,
            overtime: config.requestOvertime,
            success(res, xhr) {
                // console.log("请求成功", res);
                const info = getResultInfo({ statusCode: xhr.status, data: res });
                success && success(info, xhr);
                resolve(info);
            },
            fail(err) {
                const info = getResultInfo({ statusCode: err.status, data: null });
                if (err.response.charAt(0) == "{") {
                    info.data = JSON.parse(err.response);
                }
                // 全局的请求错误提示，不需要可以去掉
                Message.error(info.msg); 
                fail && fail(info);
                resolve(info);
            },
            timeout() {
                console.warn("XMLHttpRequest 请求超时 !!!");
                const info = getResultInfo({ statusCode: config.requestOvertime, data: null });
                // 全局的请求超时提示，不需要可以去掉
                Message.warning(info.msg);
                fail && fail(info);
                resolve(info);
            }
        });
    })
}