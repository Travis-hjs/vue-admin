<template>
  <div class="the-scrollbar" ref="el" @mouseenter="onEnter()" @mouseleave="onLeave()">
    <div ref="wrap" class="the-scrollbar-wrap" :style="wrapStyle">
      <slot></slot>
    </div>
    <transition name="fade">
      <button class="the-scrollbar-thumb" ref="thumbY" title="滚动条-摁住拖拽Y轴" :style="thumbStyle.y" v-show="showThumb"></button>
    </transition>
    <transition name="fade">
      <button class="the-scrollbar-thumb" ref="thumbX" title="滚动条-摁住拖拽X轴" :style="thumbStyle.x" v-show="showThumb"></button>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

/** 滚动条的厚度 */
const scrollbarSize = (function () {
  const el = document.createElement("div");
  el.style.width = "100px";
  el.style.height = "100px";
  el.style.overflow = "scroll";
  document.body.appendChild(el);
  const width = el.offsetWidth - el.clientWidth;
  el.remove();
  return width;
})();

/**
 * 滚动条组件
 */
export default defineComponent({
  name: "Scrollbar"
})
</script>
<script lang="ts" setup>
import { onMounted, ref, reactive, onUnmounted } from "vue";

const props = defineProps({
  /** 滚动条颜色 */
  thumbColor: {
    type: String,
    default: "rgba(147, 147, 153, 0.45)"
  },
  /** 滚动条厚度 */
  thumbSize: {
    type: Number,
    default: 8
  },
  /**
   * 内部有点击事件时，延时更新滚动条的时间，0为不执行，单位毫秒
   * - 使用场景：内部有子节点尺寸变动撑开包裹器的滚动尺寸时，并且带有动画的情况，这时设置的延迟就为动画持续时间
   */
  clickUpdateDelay: {
    type: Number,
    default: 0
  },
});

/** 组件整体节点 */
const el = ref<HTMLElement>();
/** 包围器节点 */
const wrap = ref<HTMLElement>();
/** 滚动条节点X */
const thumbX = ref<HTMLElement>();
/** 滚动条节点Y */
const thumbY = ref<HTMLElement>();
/** 包围器节点样式 */
const wrapStyle = reactive({
  height: "",
  width: ""
});
/** 滚动条节点样式 */
const thumbStyle = reactive({
  x: {
    width: "",
    height: "",
    left: "",
    bottom: "",
    transform: "",
    borderRadius: "",
    backgroundColor: props.thumbColor
  },
  y: {
    width: "",
    height: "",
    top: "",
    right: "",
    transform: "",
    borderRadius: "",
    backgroundColor: props.thumbColor
  }
});

const showThumb = ref(false);

/**
 * 更新包裹容器样式
 * - ！！！注意：如果是动态设置组件父容器的边框时，需要手动执行该方法，
 * 原因是父容器的边框会影响当前设置的包围盒宽度，导致滚动条的高度有所变化，也就是跟`css`中设置
 * `box-sizing: border-box;`的原理一样
 */
function updateWrapStyle() {
  const parent = el.value!.parentElement!;
  parent.style.overflow = "hidden"; // 这里一定要将父元素设置超出隐藏，不然弹性盒子布局时会撑开宽高
  const css = getComputedStyle(parent);
  // console.log("父元素边框尺寸 >>", css.borderLeftWidth, css.borderRightWidth, css.borderTopWidth, css.borderBottomWidth);
  wrapStyle.width = `calc(100% + ${scrollbarSize}px + ${css.borderLeftWidth} + ${css.borderRightWidth})`;
  wrapStyle.height = `calc(100% + ${scrollbarSize}px + ${css.borderTopWidth} + ${css.borderBottomWidth})`;
}

/** 初始化滚动指示器样式 */
function initThumbStyle() {
  thumbStyle.y.right = thumbStyle.y.top = "0px";
  thumbStyle.y.width = props.thumbSize + "px";
  thumbStyle.x.bottom = thumbStyle.x.left = "0px";
  thumbStyle.x.height = props.thumbSize + "px";
  thumbStyle.x.borderRadius = thumbStyle.y.borderRadius = `${props.thumbSize / 2}px`;
}

/**
 * 更新滚动指示器样式
 * - 可以外部主动调用
 */
function updateThumbStyle() {
  const wrapEl = wrap.value;
  if (wrapEl) {
    let height = wrapEl.clientHeight / wrapEl.scrollHeight * 100;
    if (height >= 100) {
      height = 0;
    }
    thumbStyle.y.height = height + "%";
    thumbStyle.y.transform = `translate3d(0, ${wrapEl.scrollTop / wrapEl.scrollHeight * wrapEl.clientHeight}px, 0)`;

    // console.log("scrollWidth >>", wrapEl.scrollWidth);
    // console.log("scrollLeft >>", wrapEl.scrollLeft);
    // console.log("clientWidth >>", wrapEl.clientWidth);
    // console.log("offsetWidth >>", wrapEl.offsetWidth);
    let width = (wrapEl.clientWidth / wrapEl.scrollWidth) * 100;
    if (width >= 100) {
      width = 0;
    }
    thumbStyle.x.width = width + "%";
    thumbStyle.x.transform = `translate3d(${wrapEl.scrollLeft / wrapEl.scrollWidth * wrapEl.clientWidth}px, 0, 0)`;
    // console.log("------------------------------------");
  }
}

/** 是否摁下开始拖拽 */
let isDrag = false;
/** 是否垂直模式 */
let vertical = false;
/** 摁下滚动条时的偏移量 */
let deviation = 0;
/** 更新延时器 */
let timer: NodeJS.Timeout;

function onDragStart(event: MouseEvent) {
  // console.log("摁下 >>", event);
  const _thumbX = thumbX.value!;
  const _thumbY = thumbY.value!;
  const target = event.target as HTMLElement;
  if (_thumbX.contains(target)) {
    isDrag = true;
    vertical = false;
    deviation = event.clientX - _thumbX.getBoundingClientRect().left;
  }
  if (_thumbY.contains(target)) {
    isDrag = true;
    vertical = true;
    deviation = event.clientY - _thumbY.getBoundingClientRect().top;
  }
}

function onDragMove(event: MouseEvent) {
  if (!isDrag) return;
  // console.log("拖拽移动 >>", event.offsetY, event.clientY, event);
  const wrapEl = wrap.value!;
  if (vertical) {
    const wrapTop = wrapEl.getBoundingClientRect().top;
    const wrapHeight = wrapEl.clientHeight;
    let value = event.clientY - wrapTop;
    wrapEl.scrollTop = (value - deviation) / wrapHeight * wrapEl.scrollHeight;
  } else {
    const wrapLeft = wrapEl.getBoundingClientRect().left;
    const wrapWidth = wrapEl.clientWidth;
    let value = event.clientX - wrapLeft;
    wrapEl.scrollLeft = (value - deviation) / wrapWidth * wrapEl.scrollWidth;
  }
}

function onDragEnd(event: MouseEvent) {
  // console.log("抬起");
  isDrag = false;
  if (el.value!.contains(event.target as HTMLElement)) {
    if (props.clickUpdateDelay > 0) {
      // console.log("执行");
      timer && clearTimeout(timer);
      timer = setTimeout(updateThumbStyle, props.clickUpdateDelay);
    }
  } else {
    showThumb.value = false;
  }
}

function onEnter() {
  showThumb.value = true;
  updateThumbStyle();
}

function onLeave() {
  if (!isDrag) {
    showThumb.value = false;
  }
}

onMounted(function () {
  // console.log("onMounted >>", el.value!.clientHeight);
  // console.log("scrollbarSize >>", scrollbarSize);
  updateWrapStyle();
  initThumbStyle();
  wrap.value && wrap.value.addEventListener("scroll", updateThumbStyle);
  document.addEventListener("mousedown", onDragStart);
  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", onDragEnd);
});

onUnmounted(function () {
  wrap.value && wrap.value.removeEventListener("scroll", updateThumbStyle);
  document.removeEventListener("mousedown", onDragStart);
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup", onDragEnd);
  timer && clearTimeout(timer);
});

defineExpose({
  updateWrapStyle,
  updateThumbStyle
})

</script>
<style lang="scss">
.the-scrollbar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .the-scrollbar-wrap {
    overflow: scroll;
  }
  .the-scrollbar-thumb {
    position: absolute;
    z-index: 10;
    outline: none;
    border: none;
  }
}
</style>