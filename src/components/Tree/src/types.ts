/** 树形组件类型 */
export namespace TreeType {
  /**
   * 数据结构配置类型
   */
  export interface Setting<T extends object = Record<string, string>> {
    /**
     * 唯一值标识
     * - 不传则使用`value`的值作为唯一值
     */
    key?: keyof T;
    /**
     * 展示字段
     * - 默认`"label"`
     *
     */
    label?: keyof T;
    /**
     * 值字段
     * - 默认`"value"`
     */
    value?: keyof T;
    /**
     * 下级字段
     * - 默认`"children"`
     */
    children?: keyof T;
  }

  export interface EventMap {
    /** 节点复选框选择 */
    itemCheck: string;
    /** 节点展开收起 */
    itemOpen: string;
  }

  export interface ItemCheckParams {
    /** `item`当前对应的 key */
    key: number | string;
    /** `item`当前对应的值 */
    value: number | string;
    /**
     * 直属关联`key`列表
     * - 用于处理或查找树状结构用
     */
    parentKeys: Array<number | string>;
    /**
     * 直属关联`value`列表
     * - 用于处理或查找树状结构用
     */
    parentValues: Array<number | string>;
    // /** 下级树状数据列表 */
    // subList: Array<any>;
    /** 是否有下级列表 */
    hasSub: boolean;
  }
}
