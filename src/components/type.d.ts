// =================== src/components 组件全局类型 ===================

/** 上传组件`change`事件参数 */
interface UploadChange<T = number | string> {
  /** 组件绑定的 uploadId，多个上传组件的时候用来区分用 */
  id: T;
  /** 返回图片路径 */
  src: string;
  /** 上传接口返回原始数据 */
  result?: {
    fileName: string;
    fileUrl: string;
    size: number;
  };
}

/** `<base-table :columns="columns">`组局的`columns`单个对象 */
interface BaseTableColumn <T = any> {
  /** 表格列标题 */
  label: string;
  /**
   * 对应表格数据值的`key`
   * - `"action-right"`为固定右边
   */
  prop: string;
  /** 当需要自定义插槽去写表格模板时需要，建议字段和`prop`一致 */
  slot?: string;
  /**
   * 自定义表头插槽名
   * - 注意不要和`slot`重名！！！
   * - 在curd界面操作配置生成时，规则为`header-${prop}`
   */
  slotHead?: string;
  /** 当需要动态改变列数的时候设置指定`key`来保证显示的位置对应数据列表用 */
  key?: string;
  /** 
   * 列宽度
   * - 推荐直接用`number`类型
   */
  width?: string | number;
  /**
   * 列最新宽度
   * - 推荐直接用`number`类型
   */
  minWidth?: string | number;
  /**
   * 超出...提示
   * - 默认`true`
   */
  tooltip?: boolean;
  /** 
   * 固定位置
   * - 当`prop: "action-right"`时，不需要设置该值，固定为靠右
   */
  fixed?: "right" | "left" | boolean;
  /**
   * 表格列对齐设置
   * - 当`prop: "action-right"`时，不需要设置该值，固定为居中状态
   */
  align?: "left" | "center" | "right";
  /**
   * 格式化当前值
   * - 在不使用插槽的情况下快速给内容做格式化，比如添加单位，格式化时间等
   * 函数会传递三个参数 function (row, cellValue, column)
   * 第一个参数是行信息，第一个参数的当前值，第三个参数是列信息
   * @param row 表格项数据
   * @param cellValue 表格值
   * @param column 表格列配置
   */
  formatter?: (row: T, cellValue: any, column: any) => string;
  /**
   * 类似`formatter()`功能，作用是可以返回接收`html`
   * - 为什么不直接修改`formatter()`的实现方式？因为在一些特殊场景会使用到，而且缺点是渲染性能没有`formatter()`好
   * @param cellValue 表格值
   * @param row 表格项数据
   */
  rawContent?: (cellValue: any, row: T) => string;
}

/** 表格操作列列表对象 */
interface BaseTableAction<T = BaseObj> {
  /** 按钮文字 */
  text: string | ((row: T) => string);
  /** 
   * 按钮图标`class`
   * - [el-element icon地址](https://element.eleme.cn/#/zh-CN/component/icon)
   */
  icon?: string | ((row: T) => string);
  /**
   * 是否禁用
   * - 可以在`<Curd />`组件中配置运行代码，这个时候是`string`类型，并解析运行对应的代码片段
   */
  disabled?: boolean | ((row: T) => boolean) | string;
  /** 是否加载状态 */
  loading?: boolean | ((row: T) => boolean);
  /**
   * 显示按钮的条件，不传则显示，和`v-if`一样的作用
   * - 可以在`<Curd />`组件中配置运行代码，这个时候是`string`类型，并解析运行对应的代码片段
   */
  show?: boolean | ((row: T) => boolean) | string;
  /**
   * 按钮类型，默认`"primary"`
   * - [element-plus button](http://element-plus.org/zh-CN/component/button.html)
   * - 当按钮类型处于【更多】下拉选项中则无效
   */
  type?: "primary" | "success" | "info" | "warning" | "danger";
  /**
   * 点击事件
   * - 可以在`<Curd />`组件中配置运行代码，这个时候是`string`类型，并解析运行对应的代码片段
   */
  click?: ((row: T, index?: number) => void) | string;
}

/** 分页器 change 事件参数 */
interface PaginationChange {
  type: "pageSize" | "currentPage";
  /** 当前修改的值 */
  value: number;
  /** 修改之前的完整对象 */
  before: PageInfo;
}
