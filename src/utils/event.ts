/**
 * 自定义事件
 * - 事件监听、解绑、派发
 */
function moduleEvent() {
  /** 事件集合对象 */
  const eventMap: {[key: string]: Array<(...params: any) => void>} = {};

  return {
    /**
     * 添加事件
     * @param name 事件名
     * @param fn 事件执行的函数
     */
    on(name: string, fn: (...params: any) => void) {
      if (!eventMap.hasOwnProperty(name)) {
        eventMap[name] = [];
      }
      if (!eventMap[name].some(item => item === fn)) {
        eventMap[name].push(fn);
      }
    },

    /**
     * 解绑事件
     * @param name 事件名
     * @param fn 事件绑定的函数
     */
    off(name: string, fn: Function) {
      const fns = eventMap[name];
      if (fns && fns.length > 0 && fn) {
        for (let i = 0; i < fns.length; i++) {
          const item = fns[i];
          if (item === fn) {
            fns.splice(i, 1);
            break;
          }
        }
      } else {
        console.log("[moduleEvent] => 没有要解绑的事件");
      }
    },

    /**
     * 调用事件
     * @param name 事件名
     * @param params 事件参数
     */
    dispatch<T = any>(name: string, params?: T) {
      const fns = eventMap[name];
      if (fns && fns.length > 0) {
        for (let i = 0; i < fns.length; i++) {
          const fn = fns[i];
          fn(params);
        }
      } else {
        console.log("[moduleEvent] => 没有要执行的事件");
      }
    }
  }
}

/**
 * 自定义全局事件单例
 * - 事件监听、解绑、派发
 */
const globalEvent = moduleEvent();

export default globalEvent;
