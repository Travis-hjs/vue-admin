/**
 * 水波纹节点对象池
 */
const ripplePool: Array<HTMLElement> = [];

/**
 * 点击水波纹
 * [参考](https://juejin.cn/post/7047782205002612773)
 * @param event 点击事件
 * @param target 点击目标
 */
export default function ripple(event: TouchEvent | MouseEvent, target: HTMLElement) {
  /**
   * 水波纹动画节点
   */
  let node: HTMLElement;

  // 从对象池里面拿取节点
  if (ripplePool.length > 1) {
    node = ripplePool.shift()!;
  } else {
    node = document.createElement("div");
    node.className = "ripple";
  }

  /** 点击目标矩阵尺寸 */
  const rect = target.getBoundingClientRect();
  /** 当前自定义颜色值 */
  const color = target.getAttribute("color");
  /** 波纹大小 */
  let size = Math.max(rect.width, rect.height);
  // 设置最大范围
  if (size > 200) size = 200;
  // 设置大小
  node.style.height = node.style.width = size + "px";
  // 默认是白色透明
  node.style.backgroundColor = color || "rgba(255, 255, 255, .45)";
  // 这里必须输出节点后再设置位置，不然会有问题
  target.appendChild(node);
  const touches = (event as TouchEvent).touches;
  const y = touches ? touches[0].clientY : (event as MouseEvent).clientY;
  const x = touches ? touches[0].clientX : (event as MouseEvent).clientX;
  const top = y - rect.top - (node.offsetHeight / 2);
  const left = x - rect.left - (node.offsetWidth / 2);
  // console.log(top, left);
  node.style.top = top + "px";
  node.style.left = left + "px";

  function end() {
    node.removeEventListener("animationend", end);
    // console.log("动画结束", node);
    target.removeChild(node);
    ripplePool.push(node);
  }
  node.addEventListener("animationend", end);
}
