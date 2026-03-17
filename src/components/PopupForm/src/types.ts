import type { FormItemRule } from "element-plus";
import type { Arrayable } from "element-plus/es/utils/typescript.mjs";
import type { FieldType } from "@/components/Fields";
import type { DialogProps } from "@/components/base-dialog";

export interface PopupFormProp<T extends BaseObj<any>> extends /* @vue-ignore */ Pick<DialogProps, "width" | "full"> {
  /** 展示弹框 */
  show: boolean;
  /** 弹框标题 */
  title: string;
  /**
   * 表单`label`宽度
   * - 默认`120px`
   */
  labelWidth?: string;
  /**
   * 表单`label`位置
   * - 默认`left`
   */
  labelPosition?: "top" | "left" | "right";
  /** 回显表单数据 */
  form?: T;
  /** 表单校验规则 */
  rules?: Record<string, Arrayable<FormItemRule>>;
  /** 表单配置项 */
  fields: Array<FieldType.Member<T>>;
  /**
   * 取消文字
   * - 设置之后，将显示取消按钮
   */
  cancelText?: string;
  /** 点击取消事件 */
  onCancel?: () => void;
  /**
   * 确定文字
   * - 默认为 "确定"
   */
  confirmText?: string;
  /**
   * 确认事件
   * @param form 校验成功的表单数据
   * @param callback 回调，`close`为是否关闭弹框
   */
  onConfirm: (form: T, callback: (close: boolean) => void) => void;
}
