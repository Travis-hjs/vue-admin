import type { LayoutType } from "@/store/types";
import { useRoute, useRouter } from "vue-router";

type ActiveItem = Partial<Pick<LayoutType.Tag, "path">> & {
  query?: any;
  params?: any;
};

export function useLayoutRoute() {
  const route = useRoute();
  const router = useRouter();

  function toString<T>(value: T) {
    return JSON.stringify(value || {});
  }

  /**
   * 目标路由是否处于激活状态
   * @param target
   * @param useStrict 是否严格匹配路由
   */
  function isActive<T extends ActiveItem>(target: T, useStrict?: boolean) {
    if (useStrict) {
      return (
        target.path === route.path &&
        toString(target.query) === toString(route.query) &&
        toString(target.params) === toString(route.params)
      );
    }
    return target.path === route.path;
  }

  /**
   * 查找某个菜单项下面或自身是否有处于路由激活状态
   * @param target 
   * @param useStrict 是否严格匹配路由
   */
  function hasActive(target: LayoutType.Menu, useStrict?: boolean) {
    if (isActive(target, useStrict)) {
      return true;
    }
    if (target.children && target.children.length) {
      for (let i = 0; i < target.children.length; i++) {
        const sub = target.children[i];
        if (hasActive(sub, useStrict)) {
          return true;
        }
      }
    }
    return false;
  }

  return {
    route,
    router,
    isActive,
    hasActive,
  }
}

/** 一直累加的`id` */
let countId = 0;

export function getMenuId() {
  countId++;
  return `menu-${countId}`;
}

/**
 * 高度折叠
 * @param duration 过渡毫秒
 */
export function useCollapseHeight(duration = 300) {
  const transitionStyle = `${duration}ms height`;

  /**
   * 在元素被插入到 DOM 之前被调用，用这个来设置元素的 "enter-from" 状态
   * @param el
   */
  function onBeforeEnter(el: any) {
    // console.log("beforeEnter >>", el);
    el.style.transition = transitionStyle;
    el.style.height = "0px";
  }

  /**
   * 在元素被插入到 DOM 之后的下一帧被调用，用这个来开始进入动画
   * @param el
   * @param done
   */
  function onEnter(el: any) {
    // console.log("enter >>", el);
    if (el.scrollHeight !== 0) {
      el.style.height = `${el.scrollHeight}px`;
    } else {
      el.style.height = "";
    }
    el.style.overflow = "hidden";
  }

  /**
   * 当进入过渡完成时调用。
   * @param el
   */
  function onAfterEnter(el: any) {
    // console.log("afterEnter >>", el);
    el.style.transition = el.style.height = "";
  }

  /**
   * 在 leave 钩子之前调用，大多数时候，你应该只会用到 leave 钩子
   * @param el
   */
  function onBeforeLeave(el: any) {
    // console.log("beforeLeave >>", el);
    el.style.display = "block";
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
  }

  /**
   * 在离开过渡开始时调用，用这个来开始离开动画
   * @param el
   * @param done 如果与 CSS 结合使用，则这个回调是可选参数
   */
  function onLeave(el: any) {
    // console.log("leave >>", el);
    if (el.scrollHeight !== 0) {
      el.style.transition = transitionStyle;
      el.style.height = "0px";
    }
  }

  /**
   * 在离开过渡完成、且元素已从 DOM 中移除时调用
   * @param el
   */
  function onAfterLeave(el: any) {
    // console.log("afterLeave >>", el);
    el.style.transition = el.style.height = "";
  }

  return {
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
  }
}
