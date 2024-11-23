
/** 通用选项结构 */
interface CommonOption<T = string | number> {
  label: string;
  value: T;
  children?: Array<CommonOption<T>>;
  disabled?: boolean;
}
