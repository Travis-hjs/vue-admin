// import type { Directive, DirectiveBinding } from "vue";

export { default } from "./index.vue";

/**
 * 元素出现
 * @param el 
 * @returns 
 */
export function show(el: HTMLElement) {
  if (!el) return;
  el.style.display = "";
  el.style.height = "";
  // console.log(el.clientHeight, el.offsetHeight);
  const height = el.clientHeight;
  el.style.height = "0px";
  el.offsetHeight; // 回流
  el.style.height = `${height}px`;
}

/**
 * 元素隐藏
 * @param el 
 */
export function hide(el: HTMLElement) {
  if (!el) return;
  const height = el.clientHeight;
  el.style.height = `${height}px`;
  el.offsetHeight; // 回流
  el.style.height = "0px";
}

// TODO: 展开时有问题
// /**
//  * 高度折叠指令
//  * - 与`<CollapseHeight>`一样的功能
//  */
// export const vCollapseHeight: Directive = {
//   mounted(el: HTMLElement, binding) {
//     el.style.transition = ".3s height";
//     el.style.overflow = "hidden";
//     el.dataset.show = binding.value;
//     el.addEventListener("transitionend", function() {
//       const show = el.dataset.show;
//       console.log(show);
//       if (show === "true") {
//         el.style.height = "";
//       } else {
//         el.style.display = "none";
//       }
//     });
//     (binding.value === true && el.clientHeight > 0) && show(el);
//   },
//   updated(el: HTMLElement, binding) {
//     el.dataset.show = binding.value;
//     if (binding.value === true) {
//       show(el);
//     } else if (binding.value === false) {
//       hide(el);
//     }
//   }
// }
