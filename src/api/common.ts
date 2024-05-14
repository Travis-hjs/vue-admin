import request from "../utils/request";
import store from "../store";
import type { LoginParams, UserInfo } from "../types/user";

/**
 * `blob`或者`file`转读取路径
 * @param target 目标对象 
 */
function blobOrFileToUrl(target: File | Blob) {
  let url = "";
  if (window.URL) {
    url = window.URL.createObjectURL(target);
  } else if (window.webkitURL) {
    url = window.webkitURL.createObjectURL(target);
  }
  return url;
}

/**
 * 上传文件
 * @param formData 图片`FormData`
 */
export function uploadFile(formData: FormData) {
  // 模拟上传
  const file = formData.get("file") as File;
  return new Promise<Api.Result<{ url: string }>>(function (resolve) {
    setTimeout(function () {
      resolve({
        code: 1,
        data: {
          url: blobOrFileToUrl(file)
        },
        msg: "上传成功"
      })
    }, 500);
  });
  // return request("POST", "/uploadFile", formData);
}

/**
 * 获取天气预报数据
 * @param city 城市名
 */
export function getWeather(city: string) {
  return request("GET", "/free/day", {
    appid: "56761788",
    appsecret: "ti3hP8y9",
    city: encodeURIComponent(city)
  },
  {
    headers: {
      // TODO: 天气预报的接口不可以携带 请求头 authorization 字段，所以这里清空
      authorization: ""
    }
  })
}

/**
 * 登录
 * @param params 登录信息
 */
export async function login(params: LoginParams) {
  // 模拟登录
  return new Promise<Api.Result>(function (resolve) {
    const info: UserInfo = {
      id: Math.random().toString(36).substr(10),
      type: "",
      name: "",
      avatar: "",
      token: Math.random().toString(36).substr(2),
      account: params.account,
      password: params.password
    }
    setTimeout(() => {
      switch (params.account) {
        case "admin":
          info.type = 0;
          info.name = "超级管理员";
          info.avatar = "https://p3-passport.byteacctimg.com/img/user-avatar/6332ece850859ade07f7e6a1394f7c34~300x300.image";
          store.user.update(info);
          resolve({ code: 1, msg: "ok", data: info });
          break;

        case "normal":
          info.type = 1;
          info.name = "普通成员";
          store.user.update(info);
          resolve({ code: 1, msg: "ok", data: info });
          break;

        default:
          resolve({ code: -1, msg: "账户不存在", data: null });
          break;
      }
    }, 600);
  })

  // const res = await request("POST", "/login", params)
  // if (res.code === 1) {
  //   // 录成功后缓存用户信息
  //   store.user.update(res.data);
  // }
  // return res;
}

// 示例代码，通过传入泛型可以约束返回`res.data`中的类型
// 注意看调用的类型提示

interface GoodsInfo {
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

// getGoodsById(1).then(res => {
//   res.data.specs
// })

// getGoodsList({
//   keyword: "查询字段",
//   pageSize: 10,
//   currentPage: 1
// }).then(res => {
//   res.data.list[0].specs
// })