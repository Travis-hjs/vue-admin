import { customRef } from "vue";

let zIndex = 1000;

/**
 * 各个弹层组件应用的定位层级
 * - 该方法调用一次之后，就会累加一次层级
 * - 保证所有弹层按照书写顺序去排列定位层级
 */
export function usezIndex() {
  const val = zIndex;
  zIndex++;
  return val;
}

/**
 * 页码数据
 * @param size 条数（默认10条）
 */
export function usePageInfo(size = 10): PageInfo {
  return {
    pageSize: size,
    currentPage: 1,
    total: 0
  }
}

/**
 * [自定义防抖`ref`](https://cn.vuejs.org/api/reactivity-advanced.html#customref)
 * @param value 
 * @param delay 防抖延迟
 * @param callback 防抖延迟结束回调函数
 */
export function debounceRef<T>(value: T, delay = 1000, callback?: (res: T) => void) {
  let timer: NodeJS.Timeout;
  return customRef(function(track, trigger) {
    return {
      get() {
        track();
        return value;
      },
      set(val) {
        if (callback) {
          value = val;
          trigger();
        }
        timer && clearTimeout(timer);
        timer = setTimeout(function() {
          if (callback) {
            callback(val);
          } else {
            value = val;
            trigger();
          }
        }, delay);
      }
    }
  });
}

/**
 * 表单验证加强
 * @param formName 表单`id`或`class-name`
 */
export function validateEX(formName: string, valid?: boolean) {
  if (valid) return;
  setTimeout(function() {
    const item = document.querySelector(`${formName} .is-error`);
    if (!item) return;
    item.scrollIntoView && item.scrollIntoView({
      behavior: "smooth"
    });
    const classNames = [".el-input", ".el-textarea", ".el-select"];
    let input: HTMLElement | null = null;
    for (let i = 0; i < classNames.length; i++) {
      input = item.querySelector(classNames[i]) as HTMLElement;
      if (input) break;
    }
    if (!input) return;
    input.classList.add("apply-shake");
    function remove() {
      input!.removeEventListener("animationend", remove);
      input!.removeEventListener("click", remove);
      input!.classList.remove("apply-shake");
    }
    input.addEventListener("animationend", remove);
    input.addEventListener("click", remove);
  }, 1000 / 60);
}
