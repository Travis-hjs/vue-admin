import { message } from "@/utils/message";
import type { UploadType } from "./src/types";

export { default as UploadImage } from "./src/Image.vue";
export { default as UploadWrap } from "./src/Wrap.vue";
// export { default as UploadVideo } from "./Video.vue";

export type { UploadType } from "./src/types";

/**
 * 指令式上传文件
 * @param params
 */
export function onUploadFile(params: UploadType.Command) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = params.accept || "*";
  input.multiple = !!params.multiple;
  const max = params.maxSize;
  input.onchange = function () {
    const files = input.files!;
    if (input.multiple) {
      const list = Array.from(files);
      if (max) {
        for (let i = 0; i < list.length; i++) {
          const file = list[i];
          if (file.size > max * 1024 * 1024) {
            input.remove();
            return message.warning(`上传的文件：【${file.name}】不能大于 ${max}M`);
          }
        }
      }
      params.change(list);
    }
    else {
      const file = files[0];
      if (max && file.size > max * 1024 * 1024) {
        input.remove();
        return message.warning(`上传的文件：【${file.name}】不能大于 ${max}M`);
      }
      params.change(file);
    }
    input.remove();
  };
  input.style.cssText = "position: fixed; top: -200%; left: -200%";
  document.body.appendChild(input);
  input.click();
}
