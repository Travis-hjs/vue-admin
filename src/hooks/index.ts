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
 * 表单验证加强
 * @param formName 表单`id`或`calss-name`
 */
export function validateEX(formName: string, valid?: boolean) {
  if (valid) return;
  setTimeout(function() {
    const item = document.querySelector(`${formName} .is-error`);
    if (!item) return;
    item.scrollIntoView && item.scrollIntoView({
      behavior: 'smooth'
    });
    const input = (item.querySelector('.el-input') || item.querySelector('.el-textarea')) as HTMLInputElement;
    if (!input) return;
    input.classList.add('apply-shake');
    function remve() {
      input.removeEventListener('animationend', remve);
      input.removeEventListener('click', remve);
      input.classList.remove('apply-shake');
    }
    input.addEventListener('animationend', remve);
    input.addEventListener('click', remve);
  }, 1000 / 60);
}
