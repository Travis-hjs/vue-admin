import { ElMessage } from "element-plus";
// import { IMessageOptions } from "element-plus/lib/el-message/src/types";

/**
 * `element-ui`功能模块
 * 
 * [文档地址](https://element-plus.org/#/zh-CN/component)
 */
export default class ModuleElementUI {
    /**
     * @param value 设置统一提示过渡时间
     */
    constructor(value?: number) {
        if (value) {
            this.duration = value;
        }
    }
    
    /** 持续时间 */
    private duration = 2000;

    /**
     * `element-ui`提示方法
     * @param options 传参对象 或 提示内容
     */
    readonly showMessage = ElMessage;

    /**
     * `element-ui`提示方法`ElMessage.success`
     * @param value 提示内容
     */
    showSuccess(value: string) {
        return ElMessage({
            type: "success",
            message: value,
            duration: this.duration
        });
    }
    
    /**
     * `element-ui`提示方法`ElMessage.warning`
     * @param value 提示内容
     */
    showWarning(value: string) {
        return ElMessage({
            type: "warning",
            message: value,
            duration: this.duration
        });
    }

    /**
     * `element-ui`提示方法`ElMessage.error`
     * @param value 提示内容
     */
    showError(value: string) {
        return ElMessage({
            type: "error",
            message: value,
            duration: this.duration
        });
    }

    /**
     * `element-ui`提示方法`ElMessage.info`
     * @param value 提示内容
     */
    showInfo(value: string) {
        return ElMessage({
            type: "info",
            message: value,
            duration: this.duration
        });
    }

}