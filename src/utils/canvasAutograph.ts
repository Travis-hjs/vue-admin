/** `canvas`签名工具-配置参数 */
export interface CanvasAutographOption {
  /** 挂载的节点元素 */
  el: HTMLElement
  /** 画笔线条的厚度：像素 */
  lineSize?: number
  /** 画笔线条的颜色 */
  lineColor?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 缩放比率 */
  ratio?: number
}

/** 绘画坐标 */
interface DrawSize {
  x: number
  y: number
}

/** `canvas`签名工具返回调用对象 */
export interface Autograph {
  /** 当前画板`canvas`节点 */
  canvas: HTMLCanvasElement
  /** 重置签名版 */
  reset(): void
  /**
   * 生成图片
   * @param imageType 图片类型，默认`"image/jpeg"`
   */
  getBase64(imageType?: string): string
}

/**
 * `canvas`签名工具
 * @param option 配置参数
 */
export default function canvasAutograph(option: CanvasAutographOption): Autograph {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const ratio = option.ratio || window.devicePixelRatio;

  /** 更新`canvas`尺寸 */
  function updateSize() {
    canvas.width = option.el.clientWidth * ratio;
    canvas.height = option.el.clientHeight * ratio;
  }

  /** 设置画布样式 */
  function setStyle() {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.fillStyle = option.backgroundColor || "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  let startX = 0, startY = 0;

  // 这里不用变量存储起来是为了在外部可以动态修改指定值，内部实时使用最新的，类似响应式
  const getLineWidth = () => option.lineSize || 4;
  const getLineColor = () => option.lineColor || "#000000";

  /**
   * 绘画开始
   * @param size 坐标点
   */
  function drawStart(size: DrawSize) {
    const x = size.x * ratio, y = size.y * ratio;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y);
    context.strokeStyle = getLineColor();
    context.lineWidth = getLineWidth() * ratio;
    context.stroke();
    context.closePath();
    startY = y;
    startX = x;
  }

  /**
   * 绘画拖拽
   * @param size 坐标点
   */
  function drawMove(size: DrawSize) {
    const x = size.x * ratio, y = size.y * ratio;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(x, y);
    context.strokeStyle = getLineColor();
    context.lineWidth = getLineWidth() * ratio;
    context.stroke();
    context.closePath();
    startY = y;
    startX = x;
  }

  /**
   * 绘画结束
   * @param size 坐标点
   */
  function drawEnd(size: DrawSize) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(size.x * ratio, size.y * ratio);
    context.stroke();
    context.closePath();
  }

  /** 是否有绘画过 */
  let hasDraw = false;
  /** 是否正在绘画中 */
  let isDrawing = false;
  
  function onMouseDown(e: MouseEvent) {
    e.preventDefault();
    isDrawing = true;
    hasDraw = true;
    drawStart({
      x: e.offsetX,
      y: e.offsetY
    })
  }

  function onMouseMove(e: MouseEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    drawMove({
      x: e.offsetX,
      y: e.offsetY
    })
  }

  function onMouseUp(e: MouseEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    drawEnd({
      x: e.offsetX,
      y: e.offsetY
    })
    isDrawing = false;
  }

  function onTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 1) {
      isDrawing = true;
      hasDraw = true;
      const size = e.touches[0];
      const box = canvas.getBoundingClientRect();
      drawStart({
        x: size.clientX - box.left,
        y: size.clientY - box.top
      })
    }
  }

  function onTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    if (e.touches.length === 1) {
      const size = e.touches[0];
      const box = canvas.getBoundingClientRect();
      drawMove({
        x: size.clientX - box.left,
        y: size.clientY - box.top
      })
    }
  }

  function onTouchEnd(e: TouchEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    if (e.touches.length === 1) {
      const size = e.touches[0];
      const box = canvas.getBoundingClientRect();
      drawEnd({
        x: size.clientX - box.left,
        y: size.clientY - box.top
      })
    }
  }

  /** 整个文档抬起事件 */
  function documentUp() {
    isDrawing = false;
    // 如果节点被销毁了，那就取消`document`的绑定事件
    if (!document.body.contains(canvas)) {
      document.removeEventListener("mouseup", documentUp);
      document.removeEventListener("touchend", documentUp);
    }
  }

  // 输出节点
  option.el.appendChild(canvas);
  // 先更新一次
  updateSize();
  setStyle();
  // 添加事件
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("touchstart", onTouchStart);
  canvas.addEventListener("touchmove", onTouchMove);
  canvas.addEventListener("touchend", onTouchEnd);
  document.addEventListener("mouseup", documentUp);
  document.addEventListener("touchend", documentUp);

  return {
    canvas,
    reset() {
      hasDraw = false;
      context.clearRect(0, 0, canvas.width, canvas.height);
      setStyle();
    },
    getBase64(imageType = "image/jpeg") {
      return hasDraw ? canvas.toDataURL(imageType) : "";
    }
  }
}