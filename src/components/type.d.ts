// =================== src/components 组件全局类型 ===================

/** 上传组件`change`事件参数 */
interface UploadChange<T = number | string> {
  /** 组件绑定的 uploadId，多个上传组件的时候用来区分用 */
  id: T
  /** 返回图片路径 */
  src: string
  /** 上传接口返回原始数据 */
  result?: {
    fileName: string
    fileUrl: string
    size: number
  }
}

/** `<base-table :columns="columns">`组局的`columns`单个对象 */
interface BaseTableColumn <T = any> {
  /** 表格列标题 */
  label: string
  /**
   * 对应表格数据值的`key`
   * - `"action-right"`为固定右边
   */
  prop: string
  /** 当需要自定义插槽去写表格模板时需要，字段和`prop`一致 */
  slotName?: string
  /** 当需要动态改变列数的时候设置指定`key`来保证显示的位置对应数据列表用 */
  key?: string
  /** 
   * 列宽度
   * - 推荐直接用`number`类型
   */
  width?: string | number
  /**
   * 列最新宽度
   * - 推荐直接用`number`类型
   */
  minWidth?: string | number
  /**
   * 超出...提示
   * - 默认`true`
   */
  tooltip?: boolean
  /** 
   * 固定位置
   * - 当`prop: "action-right"`时，不需要设置该值，固定为靠右
   */
  fixed?: "right" | "left" | "true"
  /**
   * 表格列对齐设置
   * - 当`prop: "action-right"`时，不需要设置该值，固定为居中状态
   */
  align?: "left" | "center" | "right"
  /** 
   * 格式化当前值
   * 在不使用插槽的情况下快速给内容做格式化，比如添加单位，格式化时间等
   * 函数会传递三个参数 function (row, cellValue, column)
   * 第一个参数是行信息，第一个参数的当前值，第三个参数是列信息
   */
  formatter?: (row: T, cellValue: any, column: any) => string
}

/** 表格操作列列表对象 */
interface BaseTableOptionItem<T = BaseObj> {
  /** 按钮文字 */
  text: string | ((row: T) => string)
  /** 
   * 按钮图标`class`
   * - [el-element icon地址](https://element.eleme.cn/#/zh-CN/component/icon)
   */
  icon?: string | ((row: T) => string)
  /** 是否禁用 */
  disabled?: boolean | ((row: T) => boolean)
  /** 是否加载状态 */
  loading?: boolean | ((row: T) => boolean)
  /** 显示按钮的条件，不传则显示，和`v-if`一样的作用 */
  show?: boolean | ((row: T) => boolean)
  /**
   * 按钮类型，默认`"primary"`
   * - [element-plus button](http://element-plus.org/zh-CN/component/button.html)
   * - 当按钮类型处于【更多】下拉选项中则无效
   */
  type?: "primary" | "success" | "info" | "warning" | "danger"
  /** 点击事件 */
  click?: (row: T, index?: number) => void
}

/** 分页器 change 事件参数 */
interface PaginationChange {
  type: "pageSize" | "currentPage",
  value: number
}

/** 通用树型结构列表item数据 */
interface ArrayItemSetting {
  /** 显示值，默认`label` */
  label?: string
  /** 对应值，默认`value` */
  value?: string
  /** 下级数据字段，默认`children` */
  children?: string
  /** 禁用值，默认`disabled` */
  disabled?: string
  /** 唯一key，默认空 */
  key?: string
}

/** 多级树节点对象 */
interface TreeItem<T = any> {
  /** 字段名 */
  label: string
  /** 对应的值 */
  value: string
  /** 下级数据 */
  children: Array<TreeItem>
  /** 唯一`key` */
  key: string
  /** 索引，多层用`-`串联 */
  indexs: string
  /** 是否展开下级 */
  open: boolean
  /** 是否选中 */
  checked: boolean
  /** 是否禁用 */
  disabled: boolean
  /** 组件展开收起高度，默认`30` */
  height: number
  /** 原始数据 */
  original: T
}
