import { reactive } from "vue";
import { jsonParse, modifyData } from "@/utils";

export namespace Goods {
  export interface Form {
    id: number
    /** 商品名称 */
    name: string
    /** 价格（展示时要除以`100`） */
    price: number
    /** 商品规格 */
    specs: Specs
  }
  export interface Specs {
    /** 尺码 */
    size: "xs" | "s" | "m" | "l" | "xl" | "2xl"
    /** 宽（厘米） */
    width: string
    /** 高（厘米） */
    height: string
  }
}

const cacheName = "ModuleGoods";

export function useGoodsInfo(): Goods.Form {
  return {
    id: 0,
    name: "",
    price: 0,
    specs: {
      size: "xs",
      width: "",
      height: ""
    }
  }
}

/** 商品状态模块 */
export default class ModuleGoods {
  constructor() {
    const value = sessionStorage.getItem(cacheName);
    if (value) {
      const info = jsonParse<Goods.Form>(value);
      modifyData(this.info, info);
    }
  }

  readonly info = reactive<DeepReadonly<Goods.Form>>(useGoodsInfo())

  update(value: DeepPartial<Goods.Form>) {
    modifyData(this.info, value);
    sessionStorage.setItem(cacheName, JSON.stringify(this.info));
  }

  reset() {
    modifyData(this.info, useGoodsInfo());
    sessionStorage.removeItem(cacheName);
  }
}
