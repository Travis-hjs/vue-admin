import type { LocationQueryRaw, RouteParamsRaw } from "vue-router";
import type { RouteMeta } from "@/router/types";

export namespace LayoutType {
  export interface Tag {
    path: string
    /** 路由查询对象 */
    query: LocationQueryRaw
    /** 路由参数对象 */
    params: RouteParamsRaw
    /** 路由名 */
    name?: string
    /** 标头 */
    meta: RouteMeta
    /** 子级路由 */
    children?: Array<Tag>
  }

  export interface Info {
    /** 显示历史记录列表 */
    showTagList: boolean;
    /** 侧边栏展开 */
    showSidebar: boolean;
    /** 显示侧边栏`logo` */
    showSidebarLogo: boolean;
    /** 历史记录列表 */
    tagList: Array<Tag>;
    /** 
     * 布局模式
     * 
     * | 字段 | 描述 |
     * | --- | ----|
     * | "" | 默认 |
     * | full-header | 顶部撑满  |
     */
    layoutMode: "" | "full-header";
    /** 检索菜单关键字 */
    keyword: string;
  }

  export interface Menu extends RouteMeta {
    /** 唯一标识 */
    menuId: string;
    /** 当前下级菜单是否展开 */
    isOpen: boolean;
    /** 路由路径 */
    path: string;
    /** 菜单子路由 */
    children?: Array<Menu>;
  }
}

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户`id` */
  id: number | string
  /** 用户名 */
  name: string
  /** 登录接口中返回的`token`字段 */
  token: string
  /**
   * 用户类型
   * 
   * | number | 用户类型 |
   * | --- | --- |
   * | 0 | 超级管理员 |
   * | 1 | 普通用户 |
   */
  type: number | ""
  /** 用户账户 */
  account?: string | number
  /** 用户密码 */
  password?: string
  /** 用户头像 */
  avatar: string
}
