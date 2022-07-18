<template>
  <div class="the-scrollbar" @mouseenter="onEnter()" @mouseleave="onLeave()">
    <div ref="wrap" class="the-scrollbar-wrap" :style="wrapStyle">
      <slot></slot>
    </div>
    <transition name="fade">
      <button
        class="the-scrollbar-thumb"
        ref="thumb-y"
        title="滚动条-摁住拖拽Y轴"
        :style="{ ...thumbStyle.y, 'background-color': thumbColor}"
        v-show="showThumb"
      ></button>
    </transition>
    <transition name="fade">
      <button
        class="the-scrollbar-thumb"
        ref="thumb-x"
        title="滚动条-摁住拖拽X轴"
        :style="{ ...thumbStyle.x, 'background-color': thumbColor}"
        v-show="showThumb"
      ></button>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

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

/** 滚动条组件 */
@Component({
  name: "Scrollbar"
})
export default class Scrollbar extends Vue {

  /** 滚动条颜色 */
  @Prop({
    type: String,
    default: "rgba(147, 147, 153, 0.45)"
  })
  thumbColor!: string;

  /** 滚动条厚度 */
  @Prop({
    type: Number,
    default: 8
  })
  thumbSize!: number;

  /**
   * 内部有点击事件时，延时更新滚动条的时间，0为不执行，单位毫秒
   * - 使用场景：内部有子节点尺寸变动撑开包裹器的滚动尺寸时，并且带有动画的情况，这时设置的延迟就为动画持续时间
   */
  @Prop({
    type: Number,
    default: 0
  })
  clickUpdateDelay!: number;

  $refs!: {
    /** 包围器节点 */
    wrap: HTMLElement,
    /** 滚动条`X`节点 */
    "thumb-x": HTMLElement
    /** 滚动条`Y`节点 */
    "thumb-y": HTMLElement
  }

  /** 包围器节点样式 */
  private wrapStyle = {
    height: "",
    // maxHeight: "",
    width: "",
    // maxWidth: "",
  }

  /** 滚动条节点样式 */
  private thumbStyle = {
    x: {
      width: "",
      height: "",
      left: "",
      bottom: "",
      transform: "",
      borderRadius: "",
    },
    y: {
      width: "",
      height: "",
      top: "",
      right: "",
      transform: "",
      borderRadius: "",
    }
  }

  /** 是否显示滚动条 */
  showThumb = false;

  /**
   * 初始化滚动指示器样式
   */
  private initThumbStyle() {
    this.thumbStyle.y.right = this.thumbStyle.y.top = "0px";
    this.thumbStyle.y.width = this.thumbSize + "px";
    this.thumbStyle.x.bottom = this.thumbStyle.x.left = "0px";
    this.thumbStyle.x.height = this.thumbSize + "px";
    this.thumbStyle.x.borderRadius = this.thumbStyle.y.borderRadius = `${this.thumbSize / 2}px`;
  }

  /**
   * 更新包裹容器样式
   * - ！！！注意：如果是动态设置组件父容器的边框时，需要手动执行该方法，
   * 原因是父容器的边框会影响当前设置的包围盒宽度，导致滚动条的高度有所变化，也就是跟`css`中设置
   * `box-sizing: border-box;`的原理一样
   */
  updateWrapStyle() {
    const parent = this.$el.parentElement!;
    parent.style.overflow = "hidden"; // 这里一定要将父元素设置超出隐藏，不然弹性盒子布局时会撑开宽高
    const css = getComputedStyle(parent);
    // console.log("父元素边框尺寸 >>", css.borderLeftWidth, css.borderRightWidth, css.borderTopWidth, css.borderBottomWidth);
    this.wrapStyle.width = `calc(100% + ${scrollbarSize}px + ${css.borderLeftWidth} + ${css.borderRightWidth})`;
    this.wrapStyle.height = `calc(100% + ${scrollbarSize}px + ${css.borderTopWidth} + ${css.borderBottomWidth})`;
    // if (css.maxWidth !== "none") {
    //   this.wrapStyle.maxWidth = css.maxWidth;
    // }
    // if (css.maxHeight !== "none") {
    //   this.wrapStyle.maxHeight = `calc(${css.maxHeight} + ${scrollbarSize}px)`;
    // }
  }

  /**
   * 更新滚动指示器样式
   * - 可以外部主动调用
   */
  updateThumbStyle() {
    const wrapEl = this.$refs.wrap;
    if (wrapEl) {
      let height = wrapEl.clientHeight / wrapEl.scrollHeight * 100;
      if (height >= 100) {
        height = 0;
      }
      this.thumbStyle.y.height = height + "%";
      this.thumbStyle.y.transform = `translate3d(0, ${wrapEl.scrollTop / wrapEl.scrollHeight * wrapEl.clientHeight}px, 0)`;

      // console.log("scrollWidth >>", wrapEl.scrollWidth);
      // console.log("scrollLeft >>", wrapEl.scrollLeft);
      // console.log("clientWidth >>", wrapEl.clientWidth);
      // console.log("offsetWidth >>", wrapEl.offsetWidth);
      let width = (wrapEl.clientWidth / wrapEl.scrollWidth) * 100;
      if (width >= 100) {
        width = 0;
      }
      this.thumbStyle.x.width = width + "%";
      this.thumbStyle.x.transform = `translate3d(${wrapEl.scrollLeft / wrapEl.scrollWidth * wrapEl.clientWidth}px, 0, 0)`;
      // console.log("------------------------------------");
    }
  }

  /** 是否摁下开始拖拽 */
  private isDrag = false;
  /** 是否垂直模式 */
  private vertical = false;
  /** 摁下滚动条时的偏移量 */
  private deviation = 0;
  /** 更新延时器 */
  private timer!: NodeJS.Timeout;

  private onDragStart(event: MouseEvent) {
    // console.log("摁下 >>", event);
    const thumbX = this.$refs["thumb-x"];
    const thumbY = this.$refs["thumb-y"];
    const target = event.target as HTMLElement;
    if (thumbX.contains(target)) {
      this.isDrag = true;
      this.vertical = false;
      this.deviation = event.clientX - thumbX.getBoundingClientRect().left;
    }
    if (thumbY.contains(target)) {
      this.isDrag = true;
      this.vertical = true;
      this.deviation = event.clientY - thumbY.getBoundingClientRect().top;
    }
  }

  private onDragMove(event: MouseEvent) {
    if (!this.isDrag) return;
    // console.log("拖拽移动 >>", event.offsetY, event.clientY, event);
    const wrapEl = this.$refs.wrap;
    if (this.vertical) {
      const wrapTop = wrapEl.getBoundingClientRect().top;
      const wrapHeight = wrapEl.clientHeight;
      let value = event.clientY - wrapTop;
      wrapEl.scrollTop = (value - this.deviation) / wrapHeight * wrapEl.scrollHeight;
    } else {
      const wrapLeft = wrapEl.getBoundingClientRect().left;
      const wrapWidth = wrapEl.clientWidth;
      let value = event.clientX - wrapLeft;
      wrapEl.scrollLeft = (value - this.deviation) / wrapWidth * wrapEl.scrollWidth;
    }
  }

  private onDragEnd(event: MouseEvent) {
    // console.log("抬起");
    this.isDrag = false;
    if (this.$el.contains(event.target as HTMLElement)) {
      if (this.clickUpdateDelay > 0) {
        // console.log("执行");
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(this.updateThumbStyle, this.clickUpdateDelay);
      }
    } else {
      this.showThumb = false;
    }
  }

  onEnter() {
    this.showThumb = true;
    this.updateThumbStyle();
  }

  onLeave() {
    if (!this.isDrag) {
      this.showThumb = false;
    }
  }

  mounted() {
    this.updateWrapStyle();
    this.initThumbStyle();
    this.$refs.wrap && this.$refs.wrap.addEventListener("scroll", this.updateThumbStyle);
    document.addEventListener("mousedown", this.onDragStart);
    document.addEventListener("mousemove", this.onDragMove);
    document.addEventListener("mouseup", this.onDragEnd);
  }

  beforeDestroy() {
    this.$refs.wrap && this.$refs.wrap.removeEventListener("scroll", this.updateThumbStyle);
    document.removeEventListener("mousedown", this.onDragStart);
    document.removeEventListener("mousemove", this.onDragMove);
    document.removeEventListener("mouseup", this.onDragEnd);
    this.timer && clearTimeout(this.timer);
  }

}
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