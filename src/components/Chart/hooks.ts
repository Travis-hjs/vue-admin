interface ElementResizeOptions {
  /** 监听的节点 */
  el: HTMLElement
  /** 当前实例 */
  vue: any
  /** 尺寸变动回调 */
  callback: (entries: Array<ResizeObserverEntry>) => void
  /** `Vue.beforeDestroy` */
  destroy?: () => void
}

/**
 * `new ResizeObserver`监听节点变动
 * @param option 配置项
 */
export function onElementResize(option: ElementResizeOptions) {
  const resize = new ResizeObserver(entries => {
    // console.log("尺寸变动 >>", entries);
    option.callback(entries);
  });

  resize.observe(option.el);

  option.vue.$once("hook:beforeDestroy", function () {
    // console.log("组件销毁");
    option.destroy && option.destroy();
    resize.disconnect();
  });
}
