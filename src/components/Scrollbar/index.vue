<template>
  <div class="the-scrollbar" ref="el" @mouseenter="onEnter()" @mouseleave="onLeave()">
    <div
      ref="wrap"
      class="the-scrollbar-wrap"
      :style="{ 'max-height': maxHeight, 'max-width': maxWidth }"
      @scroll="updateThumbStyle()"
    >
      <div ref="view">
        <slot></slot>
      </div>
    </div>
    <transition name="fade">
      <button
        class="the-scrollbar-thumb"
        ref="thumbY"
        title="滚动条-摁住拖拽Y轴"
        :style="thumbStyle.y"
        v-show="showThumb"
      ></button>
    </transition>
    <transition name="fade">
      <button
        class="the-scrollbar-thumb"
        ref="thumbX"
        title="滚动条-摁住拖拽X轴"
        :style="thumbStyle.x"
        v-show="showThumb"
      ></button>
    </transition>
  </div>
</template>
<script lang="ts">
/**
 * 滚动条组件
 */
export default {
  name: "Scrollbar"
}
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
  /** 超出最大高度滚动 */
  maxHeight: {
    type: String
  },
  /** 超出最大宽度滚动 */
  maxWidth: {
    type: String
  }
});

/** 组件整体节点 */
const el = ref<HTMLElement>();
/** 包围器节点 */
const wrap = ref<HTMLElement>();
/** 滚动条节点X */
const thumbX = ref<HTMLElement>();
/** 滚动条节点Y */
const thumbY = ref<HTMLElement>();
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

/** 更新包裹容器样式 */
function updateWrapStyle() {
  const parent = el.value!.parentElement!;
  parent.style.overflow = "hidden"; // 这里一定要将父元素设置超出隐藏，不然弹性盒子布局时会撑开宽高
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
  if (!el.value!.contains(event.target as HTMLElement)) {
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

let observer: ResizeObserver;

const view = ref<HTMLElement>();

onMounted(function () {
  // console.log("onMounted >>", el.value!.clientHeight);
  // console.log("scrollbarSize >>", scrollbarSize);
  updateWrapStyle();
  initThumbStyle();
  document.addEventListener("mousedown", onDragStart);
  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", onDragEnd);
  observer = new ResizeObserver(function() {
    updateThumbStyle();
  });
  view.value && observer.observe(view.value);
});

onUnmounted(function () {
  document.removeEventListener("mousedown", onDragStart);
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup", onDragEnd);
  observer.disconnect();
});

defineExpose({
  updateThumbStyle
});
</script>
<style lang="scss">
.the-scrollbar {
  // width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  .the-scrollbar-wrap {
    // width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .the-scrollbar-thumb {
    position: absolute;
    z-index: 10;
    outline: none;
    border: none;
  }
}
</style>