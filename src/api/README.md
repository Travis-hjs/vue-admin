# 接口模块目录

## GET 请求

```ts
/**
 * @param params
 */
export function getData(params: PageInfo) {
  return request("GET", "/getList", params)
}
```

## POST 请求

正常`POST`json

```ts
/**
 * 普通`post`json请求
 * @param params 
 */
export function saveBannerInfo(params: { img: string, date: string, sort: number }) {
  return request("POST", "/saveBannerInfo", params)
}
```

`POST`表单

```js
import { jsonToFormData } from "@/utils";

/**
 * `post`表单请求
 * @param params
 */
export function saveUserInfo(params: { account: string | number, password: string }) {
  return request("POST", "/saveUserInfo", jsonToFormData(params), {
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded" // 可以不用传，`ajax()`函数内部做了类型判断处理
    // }
  })
}
```

`POST`图片

```ts
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
export function uploadImg(formData: FormData) {
  return request("POST", "/uploadImg", formData);
}
```
