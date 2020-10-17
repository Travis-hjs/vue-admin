import request from "../modules/request";
import { 
    RequestFail 
} from "../modules/interface";

class ModuleApi {
    /**
     * 上传图片
     * @param fromData 图片`FromData` 这里我模拟上传，所以类型是`File`，接口上传时才是`FromData`
     * @param success 成功回调
     * @param fail 失败回调
     */
    uploadImg(fromData: File, success?: (res: any) => void, fail?: (error: RequestFail) => void) {
        /** 模拟上传 */
        function testUpload() {
            const reader = new FileReader();
            reader.onload = function() {
                setTimeout(() => {
                    success && success(reader.result);
                }, 500);
            }
            reader.readAsDataURL(fromData);
        }
        testUpload();
        
        // request("POST", "/uploadImg", {}, res => {
        //     success && success(res);
        // }, err => {
        //     fail && fail(err);
        // }, fromData);
    }
}

const api = new ModuleApi();

export default api;