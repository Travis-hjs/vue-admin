import store from "@/store";
import { deepClone, isType } from "@/utils";
import { onMounted, onUnmounted, watch } from "vue";
import { customRef } from "vue";

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

  watch(() => layout.info.sidebarOpen, function() {
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
  /**
   * 触发更新列表函数
   * @param newList 更新后的新数组
   */
  update(newList: Array<T>): void;
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
  /**
   * 是否采用克隆函数去处理数据
   * - 数据量大时会有性能开销，默认使用`JSON.parse` + `JSON.stringify`去处理
   */
  clone?: boolean;
}

/**
 * 列表拖拽
 * - `item`节点一定要绑定`<element :data-key="唯一值">`
 * @param option 
 */
export function useListDrag<T>(option: ListDragOption<T>) {
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
    const list = option.list();
    // 记录原始数据字符串，下面做对比用
    const str = JSON.stringify(list);
    // 拷贝响应数据
    const ls: Array<T> = option.clone ? deepClone(list) : JSON.parse(str);
    // 交替数组位置
    [ls[current.index], ls[targetIndex]] = [ls[targetIndex], ls[current.index]];
    // 上一次修改如果和当前数组一致则不重新赋值
    if (str === JSON.stringify(ls)) return;
    // 最终赋值给响应数据
    option.update(ls);
    // 更新当前索引，必须！！！
    current.index = targetIndex;
  }
  return {
    onDragStart,
    onDragMove,
    onDropEnd
  }
}
