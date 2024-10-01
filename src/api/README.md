# 接口模块目录

这里我使用的是原生`XMLHttpRequest`封装的请求方法 [ajax](https://github.com/Travis-hjs/my-note/blob/master/example/pages/request/js/index.js)，理由是：

- 代码少，功能足以覆盖常用的大部分场景。
- 在`ts`中可以更友好的声明接口返回类型。

在适配后端接口返回数据时，需要在 [getResultInfo 方法](../utils/request.ts) 中设置好要使用的字段，在使用时，`request`函数始终返回`Promise.resolve`，所以在调用时只需要判断`res.code`即可，不需要在外部再包多一层`try catch`，这样的好处在`Promise.all([ ... ])`的使用场景时非常明显。

```ts
// 下面这个代码片段，无论哪个请求出现异常，都不会阻止后面的代码正常运行，因为始终会返回结果
const [user, goods, order] = Promise.all([getUserInfo(), getGoodsById(12), getOrderById(21)]);

if (user.code === 1) {
  // do some...
}

if (goods.code === 1) {
  // do some...
}

if (order.code === 1) {
  // do some...
}
```

下面列举了大部分场景的调用方式 ↓↓↓

## 接口调用

```ts
import { getData } from "@/api/common";

// 接口获取后始终以`res.code === 1`为成功，无需在外部用 try + catch 去包一层
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

/**
 * 获取超大数据量
 * - 可以为单个接口设置超时时间
 * @param params
 */
export function getMaxData(params: PageInfo) {
  request("GET", "/getMaxList", params, {
    timeout: 20000
  })
}
```

指定响应对象，通常用于文件下载时，获取`blob`对象使用

```ts
/**
 * 获取`excel`文件
 * @param id 
 */
export function getExcel(id: string | number) {
  return request("GET", "/getOrderExcel", { id }, {
    responseType: "blob"
  })
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

- 有些后端接受的参数是`id=1&type=2`这种方式的就要用到`jsonToPath`去做处理

```js
import { jsonToPath } from "@/utils";

/**
 * `post`表单请求
 * @param params
 */
export function saveUserInfo(params: { account: string | number, password: string }) {
  return request("POST", "/saveUserInfo", jsonToPath(params), {
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
 * formData.append("img", file);
 * uploadImg(formData).then(res => console.log(res))
 * ```
 */
export function uploadImg(formData: FormData) {
  return request("POST", "/uploadImg", formData);
}
```

## 接口返回数据泛型约束

示例代码，通过传入泛型可以约束返回`res.data`中的类型

```ts
export interface GoodsInfo {
  id: number
  name: string
  /**
   * 价格
   * - 单位为分
   * - 前端展示需要除以`100`展示
   */
  price: number
  /**
   * 商品规格
   */
  specs: "xs"|"s"|"m"|"l"|"xl"|"2xl"|"3xl"
  /** 商品主图 */
  banner: string
  /** 商品详情图列表 */
  picList: Array<{ id: number, url: string }>
}

/**
 * 获取商品列表
 * @param params 
 * @returns 
 */
export function getGoodsList(params: { keyword: string } & PageInfo) {
  return request<Api.List<GoodsInfo>>("GET", "/order/goodsList", params)
}

/**
 * 获取商品信息
 * @param goodsId 
 * @returns 
 */
export function getGoodsById(goodsId: number | string) {
  return request<GoodsInfo>("GET", "/order/goodsDetails", { id: goodsId })
}

```

注意看调用的响应数据`res.data.xxx`类型提示

```ts
getGoodsById(1).then(res => {
  res.data.specs
})

getGoodsList({
  keyword: "查询字段",
  pageSize: 10,
  currentPage: 1
}).then(res => {
  res.data.list[0].specs
})

```
