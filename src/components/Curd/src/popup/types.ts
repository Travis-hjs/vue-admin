import type { CurdType } from "../types";

export interface Common {
  /** 页面唯一标识 */
  pageId: string;
}

export namespace TableActionType {
  export interface Props extends Common {
    show: boolean;
    /** 操作列按钮列表 */
    actions: Array<CurdType.Table.Action>;
    /** 列宽 */
    columnWidth?: number;
    /** 最大限制几个按钮出现，超过则用【更多】代替 */
    actionMax?: number;
  }

  export interface Config extends Omit<Props, "show"> {
    /**
     * 本次修改提交更改
     * @param actions 操作列按钮列表
     * @param width 列宽
     * @param max 最大限制几个按钮出现，超过则用【更多】代替
     */
    onSubmit: (actions: Array<CurdType.Table.Action>, width: number, max: number) => void;
    /**
     * 打开配置表单
     * @param target 修改的目标对象
     */
    onForm: (target: CurdType.Table.Action) => void;
  }
}

export namespace TableBatchType {
  export interface Props extends Common {
    show: boolean;
    /** 选择`key` */
    selectKey?: string;
    /** 按钮列表 */
    list?: Array<CurdType.Table.Batch>;
  }

  export interface Config extends Omit<Props, "show"> {
    /**
     * 本次修改提交更改
     * @param key 操作列按钮列表
     * @param list 按钮列表
     */
    onSubmit: (key: string, list: Array<CurdType.Table.Batch>) => void;
    /**
     * 打开配置表单
     * @param target 修改的目标对象
     */
    onForm: (target: CurdType.Table.Batch) => void;
  }
}

export namespace TableColumnType {
  export interface Props extends Common {
    show: boolean;
    /** 弹框标题 */
    title: string;
    /** 操作类型 */
    type: "add" | "edit" | "copy";
    /** 键值列表 */
    keys: Array<string>;
    /** 表格列数据 */
    column?: CurdType.Table.Column;
    /** 
     * 是否为嵌套子表格列
     * - 暂未实现
     */
    isChildren?: boolean;
  }

  export interface Config extends Omit<Props, "show"> {
    /**
     * 本次修改提交更改
     * @param column 表格列配置
     */
    onSubmit: (column: CurdType.Table.Column) => void;
  }
}

export namespace TableOperationType {
  export interface Props extends Common {
    show: boolean;
    /** 操作列按钮列表 */
    operations: Array<CurdType.Table.Operation>;
  }

  export interface Config extends Omit<Props, "show"> {
    /**
     * 本次修改提交更改
     * @param operations 操作列按钮列表
     */
    onSubmit: (operations: Array<CurdType.Table.Operation>) => void;
    /**
     * 打开配置表
     * 单
     * @param target 修改的目标对象
     */
    onForm: (target: CurdType.Table.Operation) => void;
  }
}

export namespace TableFormType {
  export interface Props extends Common {
    show: boolean;
    /** 操作类型 */
    type: "add" | "edit" | "other";
    /** 表单配置 */
    config?: CurdType.Table.From;
  }

  export interface Config extends Omit<Props, "show"> {
    /**
     * 本次修改提交更改
     * @param config 表单配置
     * @param sync 是否为同步操作
     */
    onSubmit: (config?: CurdType.Table.From, sync?: boolean) => void;
  }
}

export namespace FieldEditorType {
  export interface Props {
    show: boolean;
    /** 编辑类型 */
    type: CurdConfig.Type;
    /** 编辑操作类型 */
    action: "add" | "edit" | "copy";
    /** 
     * 编辑的索引
     */
    index: number;
    /**
     * 正在编辑的表单
     * - 注意该值在赋值时不能克隆，不然里面无法进行数据修改处理
     */
    form?: CurdType.Table.From;
    /**
     * 筛选列表
     */
    searches?: Array<CurdType.Field>;
  }

  export interface Submit {
    setting: CurdType.Select["optionSetting"];
    option: CurdType.Select["options"];
    default: CurdType.Select["defaultValue"];
  }

  export interface Config extends Omit<Props, "show"> {}
}

/** `curd`弹框配置 */
export namespace CurdConfig {
  /** 编辑类型 */
  export type Type = "search" | "table";

  /** `curd`弹框功能状态 */
  export interface Props extends Common {
    show: boolean;
    /** 弹框标题 */
    title: string;
    /** 传入需要修改的`curd`配置 */
    config: CurdType.Config;
    /** 编辑配置类型 */
    type: Type;
    /**
     * 保存回调
     * @param newConfig 修改后新的配置
     */
    onSubmit(newConfig: CurdType.Config): void;
  }
}
