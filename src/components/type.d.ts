
/** 通用选项结构 */
interface CommonOption<T = string | number> {
  label: string;
  value: T;
  children?: Array<CommonOption<T>>;
  disabled?: boolean;
}

/** 列表选项结构配置 */
interface OptionSetting {
  /** 显示值，默认`label` */
  label?: string;
  /** 对应值，默认`value` */
  value?: string;
  /** 下级数据字段，默认`children` */
  children?: string;
  /** 禁用值，默认`disabled` */
  disabled?: string;
  /** 唯一key，默认空 */
  key?: string;
}
