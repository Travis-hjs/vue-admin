# 接口模块目录

## GET 请求

```js
/**
 * @param {object} params
 * @param {number} params.pageSize
 * @param {number} params.currentPage
 */
function getData(params) {
    return request("GET", "/getList", params)
}
```

## POST 请求

正常`POST`json

```js
/**
 * 普通`post`json请求
 * @param {object} params 
 * @param {string} params.img banner图片
 * @param {string} params.date 日期
 * @param {number} params.sort 排序
 */
function saveBannerInfo(params) {
  return request("POST", "/saveBannerInfo", params)
}
```

`POST`表单

```js
import { jsonToFormData } from "@/utils";

/**
 * `post`表单请求
 * @param {object} params
 * @param {string|number} params.account 账号
 * @param {string} params.password 密码
 */
export function saveUserInfo(params) {
    return request("POST", "/saveUserInfo", {}, jsonToFormData(params), {
        "Content-Type": "application/x-www-form-urlencoded"
    })
}
```

`POST`图片

```js
/**
 * 上传图片
 * [参考](https://juejin.cn/post/6844904066418491406#heading-4)
 * @param formData 图片`FormData`
 * @example
 * ```js
 * const formData = new FormData();
 * formData.append('img', file);
 * uploadImg(formData).then(res => console.log(res))
 * ```
 */
export function uploadImg(formData) {
    return request("POST", "/uploadImg", {}, formData);
}
```
