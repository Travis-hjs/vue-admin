import { usezIndex } from "@/hooks";

export namespace Message {
  export interface Option {
    /** 持续时间（毫秒），默认`3000` */
    duration?: number
  }

  /** 消息类型 */
  export type Type = "info" | "success" | "warning" | "error"
}

/**
 * 消息提醒功能
 * @param params 
 */
function useMessage(params: Message.Option = {}) {
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
  function show(content: string, type: Message.Type = "info", duration?: number) {
    const el = doc.createElement("div");
    el.className = `${className.box} ${type}`;
    el.style.top = `${getItemTop()}px`;
    el.style.zIndex = zIndex.message;
    el.innerHTML = `
    <span class="${className.icon}"></span>
    <span class="${className.text}">${content}</span>
    `;
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

namespace Dialog {
  export interface Show {
    /** 弹框标题，传`""`则不显示标题，默认为`"提示"`（可传html） */
    title?: string
    /** 提示内容（可传html） */
    content: string
    /** 确认回调 */
    confirm?: () => void
    /** 确认按钮文字，默认为`"确认"` */
    confirmText?: string
    /** 取消回调 */
    cancel?: () => void
    /** 取消按钮文字，不传则没有取消操作 */
    cancelText?: string
  }
}

/** 对话框控件 */
function useDialog() {
  const doc = document;
  const cssModule = `__${Math.random().toString(36).slice(2, 7)}`;
  const className = {
    mask: `dialog-mask${cssModule}`,
    popup: `dialog-popup${cssModule}`,
    title: `dialog-title${cssModule}`,
    content: `dialog-content${cssModule}`,
    footer: `dialog-footer${cssModule}`,
    confirm: `confirm${cssModule}`,
    fade: `fade${cssModule}`,
    show: `show${cssModule}`,
    hide: `hide${cssModule}`
  }
  const cssText = `
  .${className.mask} {
    --time: .3s;
    --transition: .3s all;
    --black: #333;
    --text-color: #555;
    --confirm-bg: #2ec1cb;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    animation: ${className.fade} var(--time);
  }
  .${className.mask} * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .${className.popup} {
    width: 74%;
    max-width: 375px;
    border-radius: var(--border-radius);
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
    background-color: #fff;
    transition: var(--transition);
    animation: ${className.show} var(--time);
  }
  .${className.title} {
    font-size: 18px;
    padding: 12px 15px;
    border-bottom: solid 1px #eee;
    font-weight: normal;
    color: var(--black);
    text-align: left;
  }
  .${className.content} {
    padding: 16px 15px;
    font-size: 15px;
    color: var(--text-color);
    text-align: left;
  }
  .${className.footer} {
    width: 100%;
    text-align: right;
    border-top: solid 1px #eee;
    padding: 12px 15px;
  }
  @keyframes ${className.fade} {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes ${className.show} {
    0% { transform: translate3d(var(--x), var(--y), 0) scale(0); }
    100% { transform: translate3d(0, 0, 0) scale(1); }
  }
  .${className.mask}.${className.hide} {
    opacity: 0;
  }
  .${className.mask}.${className.hide} .${className.popup} {
    transform: translate3d(var(--x), var(--y), 0) scale(0);
  }
  `;
  const style = doc.createElement("style");
  style.textContent = cssText.replace(/(\n|\t|\s)*/ig, "$1").replace(/\n|\t|\s(\{|\}|\,|\:|\;)/ig, "$1").replace(/(\{|\}|\,|\:|\;)\s/ig, "$1");
  doc.head.appendChild(style);
  /** 点击记录坐标 */
  const clickSize = {
    x: "0vw",
    y: "0vh"
  }
  // 添加点击事件，并记录每次点击坐标
  doc.addEventListener("click", function(e) {
    const { innerWidth, innerHeight } = window;
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;
    const pageY = e.clientY - centerY;
    const pageX = e.clientX - centerX;
    clickSize.x = `${pageX / innerWidth * 100}vw`;
    clickSize.y = `${pageY / innerHeight * 100}vh`;
  }, true);
  /**
   * 输出节点
   * @param option
   */
  function show(option: Dialog.Show) {
    const el = doc.createElement("section");
    el.className = className.mask;
    el.style.zIndex = zIndex.dialog
    // 设置起始偏移位置
    el.style.setProperty("--x", clickSize.x);
    el.style.setProperty("--y", clickSize.y);
    // 设置完之后还原坐标位置
    clickSize.x = "0vw";
    clickSize.y = "0vh";
    const cancelBtn = option.cancelText ? `<button class="the-btn">${option.cancelText}</button>` : "";
    el.innerHTML = `
    <div class="${className.popup}">
      <h2 class="${className.title}">${ typeof option.title === "string" ? option.title : "提示"}</h2>
      <div class="${className.content}">${option.content}</div>
      <div class="${className.footer}">
        ${cancelBtn}
        <button class="${className.confirm} the-btn blue">${option.confirmText || "确认"}</button>
      </div>
    </div>
    `;
    doc.body.appendChild(el);
    el.addEventListener("transitionend", function(e) {
      e.target === el && el.classList.contains(className.hide) && el.remove();
    });
    function hide() {
      el.classList.add(className.hide);
    }
    if (option.cancelText) {
      (el.querySelector(`.${className.footer} button`) as HTMLButtonElement).onclick = function() {
        hide();
        option.cancel && option.cancel();
      }
    }
    (el.querySelector(`.${className.confirm}`) as HTMLButtonElement).onclick = function() {
      hide();
      option.confirm && option.confirm();
    }
  }

  return {
    show
  }
}

const zIndex = {
  get message() {
    return (usezIndex() + 20).toString();
  },
  get dialog() {
    return (usezIndex() + 10).toString();
  }
}

/** 顶部消息提醒控件 */
export const message = useMessage({
  duration: 3600
});

const dialog = useDialog();

/** 对话弹框控件 */
export const messageBox = dialog.show;
