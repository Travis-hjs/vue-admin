import { RouteConfig } from "vue-router";

export interface HistoryViewsItem {
  path: string
  query: object
  params: object
  /** 路由名 */
  name?: string
  /** 标头 */
  meta: RouteMeta
  /** 子级路由 */
  children?: Array<HistoryViewsItem>
}

/** `layout`状态类型 */
export interface LayoutInfo {
  /** 显示历史记录列表 */
  showTagsView: boolean
  /** 侧边栏展开 */
  sidebarOpen: boolean
  /** 显示侧边栏`logo` */
  showSidebarLogo: boolean
  /** 历史记录列表 */
  historyViews: Array<HistoryViewsItem>
  /** 系统信息 */
  device?: "desktop" | "mobile"
  /** 主题颜色 */
  theme?: string
}

/** `layout`菜单列表数据 */
export interface LayoutMenuItem extends RouteMeta {
  /** 当前下级菜单是否展开 */
  isOpen: boolean
  /** 当前菜单是否处于激活状态 */
  isActive: boolean
  /** 当前有子菜单路由的同时，是否有子菜单的某个处于激活状态 */
  hasActive: boolean
  /** 唯一索引`key`，层数用`-`隔开 */
  key: string
  /** 菜单子路由 */
  children?: Array<LayoutMenuItem>
  /** 路由路径 */
  path: string
  /** 外链地址，优先级会比`path`高 */
  link?: string
}

export interface RouteMeta {
  /** 侧边栏菜单名、document.title */
  title: string,
  /** `svg`名 */
  icon?: string
  /** 是否在侧边菜单栏不显示该路由 */
  hidden?: boolean
  /**
   * 路由是否需要缓存
   * - 当设置该值为`true`时，路由必须要设置`name`，页面组件中的`name`也是，不然路由缓存不生效
   */
  keepAlive?: boolean
}

/** 自定义的路由类型-继承`RouteConfig` */
export interface RouteItem extends RouteConfig {
  /**
   * 路由名，类似唯一`key`
   */
  name?: string
  /** 外链地址，优先级会比`path`高 */
  link?: string
  /**
   * 可以访问该权限的用户类型数组，与`userInfo.type`对应；
   * 传空数组或者不写该字段代表可以全部用户访问
   * 
   * | number | 用户类型 |
   * | --- | --- |
   * | 0 | 超级管理员 |
   * | 1 | 普通用户 |
   */
  auth?: Array<number>
  /** 标头 */
  meta: RouteMeta
  /** 子级路由 */
  children?: Array<RouteItem>
}
