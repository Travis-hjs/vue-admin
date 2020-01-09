import { AjaxType, requestFail } from './types';

/**
 * `http`请求
 * @author https://github.com/Hansen-hjs
 * @description learn: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 */
function ajax(param: AjaxType) {
    /** XMLHttpRequest */
    const XHR = new XMLHttpRequest();
    /** 请求方法 */
    const method = param.method;
    /** 超时检测 */
    const overtime = param.overtime || 0;
    /** 请求链接 */
    let url = param.url;
    /** POST请求传参 */
    let dataPost = null;
    /** GET请求传参 */
    let dataGet = '';

    // 传参处理
    switch (method) {
        case 'POST':
            // 若后台没设置接收 JSON 则不行 需要跟 GET 一样的解析对象传参
            dataPost = JSON.stringify(param.data);
            break;

        case 'GET':
            // 解析对象传参
            for (const key in param.data) {
                dataGet += '&' + key + '=' + param.data[key];
            }
            if (dataGet) {
                dataGet = '?' + dataGet.slice(1);
                url += dataGet;
            }
            break;
    }

    // 监听请求变化
    // XHR.status learn: http://tool.oschina.net/commons?type=5
    XHR.onreadystatechange = function () {
        if (XHR.readyState !== 4) return;
        if (XHR.status === 200 || XHR.status === 304) {
            if (param.success) param.success(JSON.parse(XHR.response));
        } else {
            if (param.fail) param.fail(XHR);
        }
    }

    // 判断请求进度
    if (param.progress) {
        XHR.addEventListener('progress', param.progress, false);
    }

    // XHR.responseType = 'json';
    // 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
    // XHR.withCredentials = true;	
    XHR.open(method, url, true);

    // 判断是否上传文件通常用于上传图片，上传图片时不需要设置头信息
    if (param.file) {
        dataPost = param.file;
    } else {
        /**
         * @example 
         * XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
         * XHR.setRequestHeader('Content-Type', 'application/json')
         */
        XHR.setRequestHeader('Content-Type', 'application/json');
    }

    // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
    if (overtime > 0) {
        XHR.timeout = overtime;
        XHR.ontimeout = function () {
            XHR.abort();
            if (param.timeout) param.timeout(XHR);
        }
    }

    XHR.send(dataPost);
}

/** 接口域名 */
const webUrl = '';

/**
 * 基础请求
 * @param method 请求方式
 * @param url 请求接口
 * @param data 请求数据 
 * @param success 成功回调
 * @param fail 失败回调
 * @param upload 上传图片 FormData
 */
export default function baseRequest(method: AjaxType['method'], url: string, data: object, success?: (res: any) => void, fail?: (error: requestFail) => void, upload?: AjaxType['file']) {
    ajax({
        url: webUrl + url,
        method: method,
        data: data,
        file: upload,
        overtime: 8000,
        success(res) {
            // console.log('请求成功', res);
            if (success) success(res);
        },
        fail(err) {
            // console.log('请求失败', err);
            let error = {
                message: '接口报错',
                data: null
            };
            if (err.response.charAt(0) == '{') {
                error.data = JSON.parse(err.response);
            }
            if (fail) fail(error);
        },
        timeout() {
            console.warn('XMLHttpRequest 请求超时 !!!');
            let error = {
                message: '请求超时',
                data: null
            }
            if (fail) fail(error);
        }
    });
}