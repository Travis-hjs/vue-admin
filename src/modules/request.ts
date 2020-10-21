import config from "../config";
import { Message } from "element-ui";
import { 
    AjaxParams, 
    RequestFail 
} from "./interfaces";

/**
 * `http`请求 [MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
 * @author https://github.com/Hansen-hjs
 */
function ajax(param: AjaxParams) {
    /** XMLHttpRequest */
    const XHR = new XMLHttpRequest();
    /** 请求方法 */
    const method = param.method;
    /** 超时检测 */
    const overtime = param.overtime || 0;
    /** 请求链接 */
    let url = param.url;
    /** 非`GET`请求传参 */
    let payload = null;
    /** `GET`请求传参 */
    let query = "";

    // 传参处理
    if (method === "GET") {
        // 解析对象传参
        for (const key in param.data) {
            query += "&" + key + "=" + param.data[key];
        }
        if (query) {
            query = "?" + query.slice(1);
            url += query;
        }
    } else {
        // 若后台没设置接收 JSON 则不行 需要跟 GET 一样的解析对象传参
        payload = JSON.stringify(param.data);
    }

    // 监听请求变化
    // XHR.status learn: http://tool.oschina.net/commons?type=5
    XHR.onreadystatechange = function () {
        if (XHR.readyState !== 4) return;
        if (XHR.status === 200 || XHR.status === 304) {
            param.success && param.success(JSON.parse(XHR.response));
        } else {
            param.fail && param.fail(XHR);
        }
    }

    // 判断请求进度
    if (param.progress) {
        XHR.addEventListener("progress", param.progress, false);
    }

    // XHR.responseType = "json";
    // 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
    // XHR.withCredentials = true;	
    XHR.open(method, url, true);

    // 判断是否上传文件通常用于上传图片，上传图片时不需要设置头信息
    if (param.file) {
        payload = param.file;
    } else {
        /**
         * @example 
         * XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
         * XHR.setRequestHeader("Content-Type", "application/json")
         */
        XHR.setRequestHeader("Content-Type", "application/json");
    }

    // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
    if (overtime > 0) {
        XHR.timeout = overtime;
        XHR.ontimeout = function () {
            XHR.abort();
            param.timeout && param.timeout(XHR);
        }
    }

    XHR.send(payload);
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
export default function request(method: AjaxParams["method"], url: string, data?: object, success?: (res: any) => void, fail?: (error: RequestFail) => void, upload?: AjaxParams["file"]) {
    return new Promise<any>(function(resolve, reject) {
        ajax({
            url: config.getDomain() + url,
            method: method,
            data: data || {},
            file: upload,
            overtime: 8000,
            success(res) {
                // console.log("请求成功", res);
                success && success(res);
                resolve(res);
            },
            fail(err) {
                // console.log("请求失败", err);
                let error = {
                    message: "接口报错",
                    data: null
                };
                if (err.response.charAt(0) == "{") {
                    error.data = JSON.parse(err.response);
                }
                // 全局的请求错误提示，不需要可以去掉
                Message.error(error.message); 
                fail && fail(error);
                reject(error);
            },
            timeout() {
                console.warn("XMLHttpRequest 请求超时 !!!");
                let error = {
                    message: "请求超时",
                    data: null
                }
                // 全局的请求超时提示，不需要可以去掉
                Message.warning(error.message);
                fail && fail(error);
                reject(error);
            }
        });
    })
}