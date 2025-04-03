# 滚动条组件

[详细介绍](https://juejin.cn/post/7068617486186479653)

`<Scrollbar>`根据外部节点自动撑满宽高，尺寸只需要设置父节点即可。

## 使用示例

```html
<script lang="ts" setup>
import { Scrollbar } from "@/components/Scrollbar";

const list = new Array(10).fill(0).map((_, index) => index);
</script>
<template>
  <div class="example-page">
    <p class="tips">横向滚动</p>
    <div class="list-x">
      <Scrollbar thumbColor="#42b983">
        <div class="item" v-for="(item) in list" :key="item"></div>
      </Scrollbar>
    </div>
    <p class="tips">垂直滚动</p>
    <div class="list-y">
      <Scrollbar thumbColor="#42b983">
        <div class="item" v-for="(item) in list" :key="item"></div>
      </Scrollbar>
    </div>
    <p class="tips">宽高超出滚动</p>
    <div style="width: 300px; height: 140px;" class="mb-[30px]">
      <Scrollbar>
        <div style="width: 500px; height: 300px; background-color: yellow; color: #555; line-height: 28px">
          <p>内容内容内容内容内容内容内容</p>
          <p>内容内容内容内容内容内容内容内容内容</p>
          <p>内容内容内容内容内容内容内容</p>
        </div>
      </Scrollbar>
    </div>
  </div>
</template>
<style lang="scss">
.example-page {
  width: 100%;
  .tips {
    font-size: 16px;
    color: #555;
    padding: 8px 0;
  }
  .list-x {
    width: 300px;
    height: 88px;
    .item {
      display: inline-block;
      width: 120px;
      height: 100%;
      background-color: tomato;
    }
    .item + .item {
      margin-left: 14px;
    }
  }
  .list-y {
    width: 120px;
    height: 400px;
    .item {
      width: 100%;
      height: 88px;
      margin-bottom: 14px;
      background-color: tomato;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
```

## 参数说明

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- |
| thumbColor | string | 否 | 滚动条颜色 |
| thumbSize | string | 否 | 滚动条厚度 |
| maxHeight | string | 否 | 超出最大高度滚动（css原理） |
| maxWidth | string | 否 | 超出最大宽度滚动（css原理） |

## 事件说明

- 用于特殊场景需要手动更新界面用。

| 事件名 | 说明 |
| --- | --- |
| updateThumbStyle | 更新滚动指示器样式 |

例如：

```ts
import { ref } from "vue";
import { Scrollbar } from "@/components/Scrollbar";

const barRef = ref<InstanceType<typeof Scrollbar>>();

function onUpdate() {
  barRef.value?.updateThumbStyle();
}
```

## 旧实现方式

```html
<script lang="ts">
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
  wrap.value && wrap.value.addEventListener("scroll", updateThumbStyle);
  observer = new ResizeObserver(function() {
    updateThumbStyle();
  });
  view.value && observer.observe(view.value);
});

onUnmounted(function () {
  document.removeEventListener("mousedown", onDragStart);
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup", onDragEnd);
  wrap.value && wrap.value.removeEventListener("scroll", updateThumbStyle);
  observer.disconnect();
});

defineExpose({
  updateWrapStyle,
  updateThumbStyle
});
</script>
<template>
  <div class="the-scrollbar" ref="el" @mouseenter="onEnter()" @mouseleave="onLeave()">
    <div ref="wrap" class="the-scrollbar-wrap" :style="wrapStyle">
      <div ref="view">
        <slot></slot>
      </div>
    </div>
    <transition name="fade">
      <button class="the-scrollbar-thumb" ref="thumbY" title="滚动条-摁住拖拽Y轴" :style="thumbStyle.y" v-show="showThumb"></button>
    </transition>
    <transition name="fade">
      <button class="the-scrollbar-thumb" ref="thumbX" title="滚动条-摁住拖拽X轴" :style="thumbStyle.x" v-show="showThumb"></button>
    </transition>
  </div>
</template>
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
```
