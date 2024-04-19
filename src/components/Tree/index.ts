export { default } from "./index.vue";

/** `<Level>`组件相同字段 */
export function useLevelProps() {
  return {
    /** 选择父节点时，是否也选中所有其子节点 */
    checkChild: {
      type: Boolean,
      default: false
    },
    /** 是否需要选择功能 */
    checkbox: {
      type: Boolean,
      default: false
    },
  }
}
