import utils from "../modules/utils";

export class ModuleModifyObject {

    /**
     * 修改属性值
     * @param {object} target 修改的目标
     * @param {object} value 修改的内容
     */
    modify<T>(target: T, value: T) {
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                target[key] = value[key];
                // 需要的话，深层逐个赋值
                // if (utils.checkType(target[key]) === "object") {
                //     this.modify(target[key], value[key])
                // } else {
                //     target[key] = value[key];
                // }
            }
        }
    }

}

const modifyObject = new ModuleModifyObject();

// 这里 export default 是作为单例用
export default modifyObject;