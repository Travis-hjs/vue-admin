# 路由文件目录

路由的结构遵从以下

```ts
import type { RouteRecordRaw } from "vue-router";

export interface RouteMeta {
  /** 侧边栏菜单名、document.title */
  title: string
  /** 外链地址，优先级会比`path`高 */
  link?: string
  /** 
   * `svg`名
   * - 目前使用的是`el-icon`，需要使用其他svg则要在`src/layout/Menu.vue`中修改
   */
  icon?: string
  /** 是否在侧边菜单栏不显示该路由 */
  hidden?: boolean
  /**
   * 路由是否需要缓存
   * - 当设置该值为`true`时，路由必须要设置`name`，页面组件中的`name`也是，不然路由缓存不生效
   */
  keepAlive?: boolean
}

/** 自定义的路由类型-继承`RouteRecordRaw` */
export type RouteItem = {
  /**
   * 路由名，类似唯一`key`
   * - 路由第一层必须要设置，因为动态路由删除时需要用到，且唯一
   * - 当设置`meta.keepAlive`为`true`时，该值必填，且唯一，另外组件中的`name`也需要对应的同步设置，不然路由缓存不生效
   */
  name?: string
  /** 子级路由 */
  children?: Array<RouteItem>
  /** 标头 */
  meta: RouteMeta
  // /**
  //  * 组件
  //  * - 当动态路由，从后端获取数据时，该字段为`string`类型，需要通过`import(`@/views/${component}.vue`)`
  //  * - 当静态路由时，才是传统函数
  //  */
  // component: any
} & RouteRecordRaw
```

## 当前路由配置分两种

- **静态路由**

参考`src/router/dynamic.ts`

```ts
const list: Array<RouteItem> = [
  // ... 传统路由写法
];
```

然后在`src/router/permission.ts`中，修改`getDynamic`方法即可

```ts
import list from "./addRouter.ts";

async function getDynamic() {
  return list;
}
```

- **动态路由**

依然是在`getDynamic`中进行，当获取到后端返回的列表之后，组装成`Array<RouteItem>`返回即可；如果后端返回的数据格式和当前路由列表一致，则无需理会；注意，动态路由列表中，`component`字段为空时是`Layout`，其他字段则是`src/views/${string}.vue`中的`string`，在做菜单管理的时候需要约定好使用情况。

当前`getDynamic`方法中注释的便是动态路由的代码实现，这里不就展开代码赘述了。
