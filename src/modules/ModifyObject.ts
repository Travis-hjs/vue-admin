import utils from "../utils";

export class ModuleModifyObject {

    /**
     * 修改属性值-只修改之前存在的值
     * @param target 修改的目标
     * @param value 修改的内容
     */
    modifyData<T>(target: T, value: T) {
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                // target[key] = value[key];
                // 需要的话，深层逐个赋值
                if (utils.checkType(target[key]) === "object") {
                    this.modifyData(target[key], value[key])
                } else {
                    target[key] = value[key];
                }
            }
        }
    }

    /**
     * 设置属性值-之前不存在的值也根据传入的`value`值去设置
     * @param target 设置的目标
     * @param value 设置的内容
     */
    setData<T>(target: T, value: T) {
        for (const key in value) {
            if (!Object.prototype.hasOwnProperty.call(target, key)) {
                target[key] = {} as any;
            }
            if (utils.checkType(target[key]) === "object") {
                this.setData(target[key], value[key])
            } else {
                target[key] = value[key];
            }
        }
    }
}

const modifyObject = new ModuleModifyObject();

// 这里 export default 是作为单例用
export default modifyObject;