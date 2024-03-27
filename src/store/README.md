# 状态模块目录

> 因为是类文件，所以统一大写开头命名文件名

*使用示例*

新建一个状态模块`/store/Order.ts`
```ts
import { reactive } from "vue";
import { jsonParse, modifyData } from "@/utils";

interface OrderInfo {
  id: number | ""
  /** 超时判断的时间 */
  time: string | number
  /** 商品属性对象 */
  goods: {
    id: number | ""
    name: string
    /**
     * 商品价格
     * - 前端展示时需要除以`100`
     */
    price: number
  }
  /**
   * 生成订单时间
   * - 当`new Date(time).getTime() > new Date(createTime).getTime()`时，当前订单则为超时，执行清空操作
   */
  createTime: string | number
}

function useOrderInfo(): DeepReadonly<OrderInfo> {
  return {
    id: "",
    time: "",
    goods: {
      id: "",
      name: "",
      price: 0
    },
    createTime: ""
  }
}

const key = "ModuleOrder";

export default class ModuleOrder {
  constructor() {
    this.init();
  }
  
  /** 订单信息 */
  readonly info = reactive(useOrderInfo())

  /** 初始化缓存信息 */
  private init() {
    const value = jsonParse(sessionStorage.getItem(key));
    modifyData(this.info, value);
  }

  /**
   * 更新 & 设置状态数据
   * @param value 
   */
  update(value: DeepPartial<OrderInfo>) {
    modifyData(this.info, value);
    sessionStorage.setItem(key, JSON.stringify(this.info));
  }

  /** 重置 */
  reset() {
    modifyData(this.info, useOrderInfo());
    sessionStorage.removeItem(key);
  }

}
```

导入到整体store模块下 `/store/index.ts`
```ts
import ModuleUser from "./User"; // 与 Order 一样的操作文件
import ModuleOrder from "./Order";

class ModuleStore {
  
  /** 用户状态模块 */
  readonly user = new ModuleUser();

  /** 订单状态 */
  readonly order = new ModuleOrder();

}

const store = new ModuleStore();

export default store;
```

页面应用 `/views/demo.vue`
```html
<template>
  <div>
    <div>{{ userInfo.name }}</div>
    <span class="the-tag cyan">商品名称：{{ orderInfo.goods.name }}</span>
    <span class="the-tag red">${{ orderInfo.goods.price / 100 }}</span>
    <button @click="onEditPrice()">修改价格</button>
    <button @click="onSubmit()">发起支付</button>
  </div>
</template>
<script lang="ts" setup>
import store from "@/store";

const userInfo = store.user.info;

const orderInfo = store.order.info;

function onEditPrice() {
  store.order.update({
    goods: {
      price: 2199
    }
  })
}

function onSubmit() {
  if (new Date(orderInfo.time).getTime() > new Date(orderInfo.createTime).getTime()) {
    alert(`当前用户【${userInfo.name}】未在${orderInfo.time}之前下单，请重新操作`);
    store.order.reset();
    return;
  }
}
</script>
```