import request from "../utils/request";
import { 
    ApiResult 
} from "../utils/interfaces";
import utils from "../utils";


class ModuleApi {
    /**
     * 上传图片
     * @param fromData 图片`FromData` 这里我模拟上传，所以类型是`File`，接口上传时才是`FromData`
     */
    uploadImg(fromData: File) {
        // 模拟上传
        return new Promise<ApiResult>(function(resolve) {
            const reader = new FileReader();
            reader.onload = function() {
                setTimeout(function() {
                    resolve({
                        code: 1,
                        data: { img: reader.result },
                        msg: "上传成功"
                    })
                }, 500);
            }
            reader.onerror = function() {
                resolve({
                    code: -1,
                    data: null,
                    msg: "上传失败"
                })
            }
            reader.readAsDataURL(fromData);
        })
        
        // return request("POST", "/uploadImg", {}, fromData);
    }

    /**
     * 获取天气预报数据
     * @param city 城市名
     */
    getWeather(city: string) {
        return request("GET", "/weather_mini", {
            city: encodeURIComponent(city)
        })
    }

    /**
     * 提交表单数据
     * @param params 
     */
    submitForm(params: { id: number, name: string, age: number }) {
        return request("POST", "/submitForm", {}, utils.jsonToFormData(params))
    }
}

const api = new ModuleApi();

export default api;