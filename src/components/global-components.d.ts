import type BaseDialog from "./base-dialog";
import type SvgIcon from "../icons";


// ---------------- 声明全局组件标签类型提示 ----------------
// declare module "@vue/runtime-core"
declare module "vue" {
  /**
   * 自定义全局组件获得 Volar 提示
   * - 自定义的全局组件需要在这里声明下才能获得 Volar 类型提示
   */
  export interface GlobalComponents {
    BaseDialog: typeof BaseDialog
    SvgIcon: typeof SvgIcon
  }
}
