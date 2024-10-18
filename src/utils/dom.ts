// ------------------- dom 操作相关 -------------------
/**
 * 设置元素抖动
 * @param el
 */
export function setElementShake(el: HTMLElement | null) {
  if (!el) return;
  el.classList.add("apply-shake");
  function remove() {
    el!.removeEventListener("animationend", remove);
    el!.removeEventListener("click", remove);
    el!.classList.remove("apply-shake");
  }
  el.addEventListener("animationend", remove);
  el.addEventListener("click", remove);
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
      input = item.querySelector(classNames[i]);
      if (input) break;
    }
    setElementShake(input);
  }, 1000 / 60);
}
