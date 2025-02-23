import type { RouteRecordRaw } from "vue-router";

export interface RouteMeta {
  /** 侧边栏菜单名、document.title */
  title: string;
  /** 外链地址，优先级会比`path`高 */
  link?: string;
  /** `svg`名 */
  icon?: string;
  /** 是否在侧边菜单栏不显示该路由 */
  hidden?: boolean;
  /**
   * 路由是否需要缓存
   * - 当设置该值为`true`时，路由必须要设置`name`，页面组件中的`name`也是，不然路由缓存不生效
   */
  keepAlive?: boolean;
  /**
   * 可以访问该权限的用户类型数组，与`userInfo.type`对应；
   * 传空数组或者不写该字段代表可以全部用户访问
   * 
   * | number | 用户类型 |
   * | --- | --- |
   * | 0 | 超级管理员 |
   * | 1 | 普通用户 |
   */
  auth?: Array<number>;
}

/** 自定义的路由类型-继承`RouteRecordRaw` */
export type RouteItem = {
  /**
   * 路由名，类似唯一`key`
   * - 路由第一层必须要设置，因为动态路由删除时需要用到，且唯一
   * - 当设置`meta.keepAlive`为`true`时，该值必填，且唯一，另外组件中的`name`也需要对应的同步设置，不然路由缓存不生效
   */
  name?: string;
  /** 子级路由 */
  children?: Array<RouteItem>;
  /** 标头 */
  meta: RouteMeta;
} & RouteRecordRaw;
