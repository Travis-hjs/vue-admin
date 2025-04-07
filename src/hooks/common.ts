
let zIndex = 1000;

/**
 * 各个弹层组件应用的定位层级
 * - 该方法调用一次之后，就会累加一次层级
 * - 保证所有弹层按照书写顺序去排列定位层级
 */
export function useZIndex() {
  const val = zIndex;
  zIndex++;
  return val;
}

let countId = 0;

/**
 * 每调用一次就自动累加的`id`
 * - 用于唯一值
 * @param prefix 添加标识前缀，在归类唯一值时非常有用
 */
export function getCountId(prefix?: string) {
  countId++;
  prefix = prefix ? `${prefix}-` : "";
  return `${prefix}${Math.random().toString(36).slice(2)}-${Date.now()}-${countId}`;
}

/**
 * 页码数据
 * @param size 条数（默认10条）
 */
export function getPageInfo(size = 10): PageInfo {
  return {
    pageSize: size,
    currentPage: 1,
    total: 0
  }
}
