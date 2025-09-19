import type { UploadType } from "./src/types";
import { message } from "@/utils/message";

export { default as UploadImage } from "./src/Image.vue";
export { default as UploadWrap } from "./src/Wrap.vue";

export type { UploadType } from "./src/types";

/**
 * 函数式调用上传文件
 * @param params
 */
export function onUploadFile(params: UploadType.Command) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = params.accept || "*";
  input.multiple = !!params.multiple;
  const max = params.maxSize;
  const showTips = (f: File) => message.warning(`上传的文件：【${f.name}】不能大于 ${max}MB`);
  input.onchange = function () {
    const files = input.files!;
    if (input.multiple) {
      const list = Array.from(files);
      if (max) {
        for (const file of list) {
          if (file.size > max * 1024 * 1024) {
            input.remove();
            return showTips(file);
          }
        }
      }
      params.change(list);
    } else {
      const file = files[0];
      if (max && file.size > max * 1024 * 1024) {
        input.remove();
        return showTips(file);
      }
      params.change(file);
    }
    input.remove();
  };
  input.style.cssText = "position: fixed; top: -200%; left: -200%";
  document.body.appendChild(input);
  input.click();
}
