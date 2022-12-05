interface MessageParams {
  /** 持续时间（毫秒），默认`3000` */
  duration?: number
  /** 起始定位层级，默认`1000` */
  zIndex?: number
}

/**
 * 消息提醒功能
 * @param params 
 */
function useMessage(params: MessageParams = {}) {
  const doc = document;
  const cssModule = `__${Math.random().toString(36).slice(2, 7)}`;
  const className = {
    box: `msg-box${cssModule}`,
    hide: `hide${cssModule}`,
    text: `msg-text${cssModule}`,
    icon: `msg-icon${cssModule}`
  }
  const style = doc.createElement("style");
  style.textContent = `
  .${className.box}, .${className.icon}, .${className.text} {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .${className.box} {
    position: fixed;
    top: 0;
    left: 50%;
    display: flex;
    padding: 12px 16px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12);
    white-space: nowrap;
    animation: ${className.box}-move .4s;
    transition: .4s all;
    transform: translate3d(-50%, 0%, 0);
    opacity: 1;
    overflow: hidden;
  }
  .${className.box}::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
  }
  @keyframes ${className.box}-move {
    0% {
      opacity: 0;
      transform: translate3d(-50%, -100%, 0);
    }
    100% {
      opacity: 1;
      transform: translate3d(-50%, 0%, 0);
    }
  }
  .${className.box}.${className.hide} {
    opacity: 0;
    /* transform: translate3d(-50%, -100%, 0); */
    transform: translate3d(-50%, -100%, 0) scale(0);
  }
  .${className.icon} {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 6px;
    position: relative;
  }
  .${className.text} {
    font-size: 14px;
    line-height: 18px;
    color: #555;
  }
  .${className.icon}::after,
  .${className.icon}::before {
    position: absolute;
    content: "";
    background-color: #fff;
  }
  .${className.box}.info .${className.icon}, .${className.box}.info::after {
    background-color: #1890ff;
  }
  .${className.box}.success .${className.icon}, .${className.box}.success::after {
    background-color: #52c41a;
  }
  .${className.box}.warning .${className.icon}, .${className.box}.warning::after {
    background-color: #faad14;
  }
  .${className.box}.error .${className.icon}, .${className.box}.error::after {
    background-color: #ff4d4f;
  }
  .${className.box}.info .${className.icon}::after,
  .${className.box}.warning .${className.icon}::after {
    top: 15%;
    left: 50%;
    margin-left: -1px;
    width: 2px;
    height: 2px;
    border-radius: 50%;
  }
  .${className.box}.info .${className.icon}::before,
  .${className.box}.warning .${className.icon}::before {
    top: calc(15% + 4px);
    left: 50%;
    margin-left: -1px;
    width: 2px;
    height: 40%;
  }
  .${className.box}.error .${className.icon}::after, 
  .${className.box}.error .${className.icon}::before {
    top: 20%;
    left: 50%;
    width: 2px;
    height: 60%;
    margin-left: -1px;
    border-radius: 1px;
  }
  .${className.box}.error .${className.icon}::after {
    transform: rotate(-45deg);
  }
  .${className.box}.error .${className.icon}::before {
    transform: rotate(45deg);
  }
  .${className.box}.success .${className.icon}::after {
    box-sizing: content-box;
    background-color: transparent;
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 50%;
    left: 35%;
    top: 13%;
    transform: rotate(45deg);
    width: 20%;
    transform-origin: center;
  }
  `.replace(/(\n|\t|\s)*/ig, "$1").replace(/\n|\t|\s(\{|\}|\,|\:|\;)/ig, "$1").replace(/(\{|\}|\,|\:|\;)\s/ig, "$1");
  doc.head.appendChild(style);
  /** 一直累加的定位层级 */
  let zIndex = params.zIndex || 1000;
  /** 消息队列 */
  const messageList: Array<HTMLElement> = [];

  /**
   * 获取指定`item`的定位`top`
   * @param el 
   */
  function getItemTop(el?: HTMLElement) {
    let top = 10;
    for (let i = 0; i < messageList.length; i++) {
      const item = messageList[i];
      if (el && el === item) {
        break;
      }
      top += item.clientHeight + 20;
    }
    return top;
  }

  /**
   * 删除指定列表项
   * @param el 
   */
  function removeItem(el: HTMLElement) {
    for (let i = 0; i < messageList.length; i++) {
      const item = messageList[i];
      if (item === el) {
        messageList.splice(i, 1);
        break;
      }
    }
    el.classList.add(className.hide);
    messageList.forEach(function(item) {
      item.style.top = `${getItemTop(item)}px`;
    });
  }

  /**
   * 显示一条消息
   * @param content 内容
   * @param type 消息类型
   * @param duration 持续时间，优先级比默认值高
   */
  function show(content: string, type: "info"|"success"|"warning"|"error" = "info", duration?: number) {
    const el = doc.createElement("div");
    el.className = `${className.box} ${type}`;
    el.style.top = `${getItemTop()}px`;
    el.style.zIndex = zIndex.toString();
    el.innerHTML = `
    <span class="${className.icon}"></span>
    <span class="${className.text}">${content}</span>
    `;
    zIndex++;
    messageList.push(el);
    doc.body.appendChild(el);
    // 添加动画监听事件
    function animationEnd() {
      el.removeEventListener("animationend", animationEnd);
      setTimeout(removeItem, duration || params.duration || 3000, el);
    }
    el.addEventListener("animationend", animationEnd);
    function transitionEnd() {
      if (getComputedStyle(el).opacity !== "0") return;
      el.removeEventListener("transitionend", transitionEnd);
      el.remove();
    }
    el.addEventListener("transitionend", transitionEnd);
  }
  
  return {
    show,
    /** 普通描述提示 */
    info(msg: string) {
      show(msg, "info");
    },
    /** 成功提示 */
    success(msg: string) {
      show(msg, "success");
    },
    /** 警告提示 */
    warning(msg: string) {
      show(msg, "warning");
    },
    /** 错误提示 */
    error(msg: string) {
      show(msg, "error");
    }
  }
}

/** 顶部消息提醒控件 */
const message = useMessage({
  duration: 3600
});

export default message;
