# 接口模块目录

> 使用方式如下：

## 接口调用

```ts
import { getData } from "@/api/common";

// 接口获取后始终以`res.code === 1`为成功，无需在内部用 try + catch 去包一层
// 因为 request 方法中已经做了始终执行 Promise.resolve 去作为正确和错误的响应
async function getPageData() {
  const res = await getData({ pageSize: 10, currentPage: 1 })
  if (res.code === 1) {
    // do some...
  }
}
```

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
