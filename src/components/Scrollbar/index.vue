<template>
    <div class="the-scrollbar" ref="el" @mouseenter="updateThumbStyle()" @mouseleave="onLeave()">
        <div :class="[vertical ? 'the-scroll-y' : 'the-scroll-x']" :style="wrapStyle" ref="wrap">
            <slot></slot>
        </div>
        <transition name="fade">
            <button class="the-scroll-thumb" title="滚动条-摁住拖拽" ref="thumb" v-show="showThumb" :style="thumbStyle"></button>
        </transition>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/** 滚动条的厚度 */
const scrollbarSize = (function() {
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
    /** 是否垂直模式 */
    @Prop({
        type: Boolean,
        default: false
    })
    vertical!: boolean;

    /** 滚动条厚度 */
    @Prop({
        type: Number,
        default: 8
    })
    thumbSize!: number;

    /** 内部有点击事件时，延时更新滚动条的时间，0为不执行，单位毫秒 */
    @Prop({
        type: Number,
        default: 0
    })
    clickUpdateDelay!: number;

    /** 滚动条颜色 */
    @Prop({
        type: String,
        default: "rgba(147, 147, 153, 0.4)"
    })
    thumbColor!: string;
    
    $refs!: {
        /** 组件整体节点 */
        el: HTMLElement,
        /** 包围器节点 */
        wrap: HTMLElement,
        /** 滚动条节点 */
        thumb: HTMLElement
    }

    /** 包围器节点样式 */
    private wrapStyle = {
        height: "",
        width: ""
    }

    /** 滚动条节点样式 */
    private thumbStyle = {
        width: "",
        height: "",
        top: "",
        left: "",
        right: "",
        bottom: "",
        transform: "",
        borderRadius: "",
        backgroundColor: ""
    }

    /** 是否显示滚动条 */
    showThumb = false;

    private updateWrapStyle() {
        const parent = this.$refs.el;
        if (this.vertical) {
            this.wrapStyle.width = `${parent.clientWidth + scrollbarSize}px`;
        } else {
            this.wrapStyle.height = `${parent.clientHeight + scrollbarSize}px`;
        }
    }

    private initThumbStyle() {
        if (this.vertical) {
            this.thumbStyle.right = this.thumbStyle.top = "0px";
            this.thumbStyle.width = this.thumbSize + "px";
        } else {
            this.thumbStyle.bottom = this.thumbStyle.left = "0px";
            this.thumbStyle.height = this.thumbSize + "px";
        }
        this.thumbStyle.borderRadius = `${this.thumbSize / 2}px`;
    }

    updateThumbStyle() {
        const wrapEl = this.$refs.wrap;
        if (wrapEl) {
            if (this.vertical) {
                let height = wrapEl.clientHeight / wrapEl.scrollHeight * 100;
                if (height >= 100) {
                    height = 0;
                }
                this.thumbStyle.height = height + "%";
                this.thumbStyle.transform = `translate3d(0, ${wrapEl.scrollTop / wrapEl.scrollHeight * wrapEl.clientHeight}px, 0)`;
            } else {
                // console.log("scrollWidth >>", wrapEl.scrollWidth);
                // console.log("scrollLeft >>", wrapEl.scrollLeft);
                // console.log("clientWidth >>", wrapEl.clientWidth);
                // console.log("offsetWidth >>", wrapEl.offsetWidth);
                let width = (wrapEl.clientWidth / wrapEl.scrollWidth) * 100;
                if (width >= 100) {
                    width = 0;
                }
                this.thumbStyle.width = width + "%";
                this.thumbStyle.transform = `translate3d(${wrapEl.scrollLeft / wrapEl.scrollWidth * wrapEl.clientWidth}px, 0, 0)`;
                // console.log("------------------------------------");
            }
        } 
        this.showThumb = true;
    }

    /** 是否摁下开始拖拽 */
    private isDrag = false;
    /** 摁下滚动条时的偏移量 */
    private deviation = 0;
    /** 更新延时器 */
    private timer!: NodeJS.Timeout;

    private onDragStart(event: MouseEvent) {
        const thumbEl = this.$refs.thumb;
        if (event.target !== thumbEl) return;
        // console.log("摁下 >>", event);
        this.isDrag = true;
        if (this.vertical) {
            this.deviation = event.clientY - thumbEl.getBoundingClientRect().top;
        } else {
            this.deviation = event.clientX - thumbEl.getBoundingClientRect().left;
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
        if (!this.$refs.el.contains(event.target as HTMLElement)) {
            this.showThumb = false;
        } else if (this.clickUpdateDelay > 0) {
            // console.log("执行");
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(this.updateThumbStyle, this.clickUpdateDelay);
        }
    }

    onLeave() {
        if (!this.isDrag) {
            this.showThumb = false;
        }
    }

    // updated() {
    //     this.updateWrapStyle();
    // }

    created() {
        this.thumbStyle.backgroundColor = this.thumbColor;
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
        this.timer && this.clickUpdateDelay > 0 && clearTimeout(this.timer);
    }

}
</script>
<style lang="scss">
.the-scrollbar {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .the-scroll-x {
        flex-wrap: nowrap;
        white-space: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    .the-scroll-y {
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .the-scroll-thumb {
        outline: none;
        border: none;
        position: absolute;
        z-index: 10;
    }
}
</style>