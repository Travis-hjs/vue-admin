import store from "@/store";
import { isType } from "@/utils";
import { onMounted, onUnmounted, watch } from "vue";

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

interface LayoutContentSize {
  /** 
   * 容器节点
   * - string: `.class`、`#id`
   * - HTMLElement: 元素节点对象
   */
  el: string | HTMLElement;
  /**
   * 尺寸变化回调
   * 
   */
  callback: (size: { width: number, height: number }) => void;
}

/**
 * 监听指定`Layout`组件下的内容节点宽高变化
 * @param params 
 */
export function useLayoutContentSize(params: LayoutContentSize) {
  let el!: HTMLElement;
  let timer = 0;

  function update() {
    if (!el) return;
    // console.log("update >>", el);
    // el.offsetHeight;
    params.callback({ width: el.clientWidth, height: el.clientHeight });
  }

  const layout = store.layout

  watch(() => layout.info.showSidebar, function() {
    timer && clearTimeout(timer);
    timer = setTimeout(update, 300); // 300 是`--transition`的过渡时间
  })

  onMounted(function() {
    el = isType(params.el, "string") ? document.querySelector(params.el)! : params.el;
    window.addEventListener("resize", update);
    update();
  })

  onUnmounted(function() {
    timer && clearTimeout(timer);
    window.removeEventListener("resize", update);
  })
}

interface ListDragOption<T> {
  /** 返回列表函数 */
  list(): Array<T>;
  /** 数组项唯一值 */
  key: keyof T;
  /**
   * 向上查找节点的最大层数，默认`3`
   * - 目的是为了找到`:data-key`的值
   */
  findLevel?: number;
  /**
   * 默认`"key"`，则元素绑定`<element data-key="xxx">`
   * - 当有多种拖拽列表处于同一场景时，设置该值作为区分用
   */
  dataKey?: string;
}

/**
 * [列表拖拽](https://juejin.cn/post/7354039500811845670)
 * - `item`节点一定要绑定`<element :data-key="唯一值">`
 * @param option 
 */
export function useListDrag<T extends object>(option: ListDragOption<T>) {
  const maxLevel = option.findLevel || 3;
  const dataKey = option.dataKey || "key";
  const current = {
    index: -1
  }

  const target = {
    key: ""
  }

  function findDataKey(el: HTMLElement, level = 1) {
    const key = el.dataset[dataKey];
    if (key) return key;
    if (level < maxLevel && el.parentElement) {
      return findDataKey(el.parentElement, level + 1);
    }
    // console.warn(`找不到<element :data-${dataKey}="xxx">绑定值，请检查是否在元素中设置绑定值或调整 findLevel`);
    return undefined;
  }

  /**
   * 获取排序对比对象
   * @param list 
   */
  function getSortMap(list: Array<T[keyof T]>) {
    const indexMap: BaseObj<number> = {};
    list.forEach((item, index) => (indexMap[item as string] = index));
    return indexMap;
  } 

  function onDragStart(index: number) {
    current.index = index;
  }

  function onDropEnd() {
    current.index = -1;
  }

  function onDragMove(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    if (current.index < 0) return;
    const targetKey = findDataKey(event.target as HTMLElement);
    if (!targetKey || targetKey === target.key) return;
    target.key = targetKey;
    const optionList = option.list();
    const before = optionList.map(item => item[option.key]);
    // 记录原始数据字符串，下面做对比用
    const beforeStr = JSON.stringify(before);
    // 拷贝原来数组
    const next: typeof before = JSON.parse(beforeStr);
    // 交替数组位置
    [next[current.index], next[targetIndex]] = [next[targetIndex], next[current.index]];
    // 上一次修改如果和当前数组一致则不作处理
    if (beforeStr === JSON.stringify(next)) return;
    // 最后设置排序
    const indexMap = getSortMap(next);
    optionList.sort((a, b) => {
      const key = option.key;
      const valueA = indexMap[a[key] as string];
      const valueB = indexMap[b[key] as string];
      return valueA - valueB;
    });
    // 更新当前索引，必须！！！
    current.index = targetIndex;
  }

  return {
    onDragStart,
    onDragMove,
    onDropEnd
  }
}
