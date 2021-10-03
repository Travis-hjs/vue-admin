<template>
    <div class="the-scrollbar" ref="el" @mouseenter="updateThumbStyle()" @mouseleave="onLeave()">
        <div :class="[vertical ? 'the-scroll-y' : 'the-scroll-x']" :style="wrapStyle" ref="wrap">
            <slot></slot>
        </div>
        <button class="the-scroll-thumb" ref="thumb" :style="thumbStyle" title="滚动条"></button>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref, reactive, onUnmounted } from "vue";

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

/**
 * 滚动条组件
 */
export default defineComponent({
    name: "Scrollbar",
    props: {
        /** 是否垂直模式 */
        vertical: {
            type: Boolean,
            default: false
        },
        /** 滚动条厚度 */
        thumbSize: {
            type: Number,
            default: 8
        },
        /** 内部有点击事件时，延时更新滚动条的时间，0为不执行，单位毫秒 */
        clickUpdateDelay: {
            type: Number,
            default: 0
        }
    },
    setup(props, context) {
        const el = ref<HTMLElement>();
        const wrap = ref<HTMLElement>();
        const thumb = ref<HTMLElement>();
        const wrapStyle = reactive({
            height: "",
            width: ""
        });
        const thumbStyle = reactive({
            width: "",
            height: "",
            top: "",
            left: "",
            right: "",
            bottom: "",
            transform: "",
            borderRadius: "",
            display: "none"
        })

        function updateWrapStyle() {
            const parent = el.value!;
            if (props.vertical) {
                wrapStyle.width = `${parent.clientWidth + scrollbarSize}px`;
            } else {
                wrapStyle.height = `${parent.clientHeight + scrollbarSize}px`;
            }
        }

        function initThumbStyle() {
            if (props.vertical) {
                thumbStyle.right = thumbStyle.top = "0px";
                thumbStyle.width = props.thumbSize + "px";
            } else {
                thumbStyle.bottom = thumbStyle.left = "0px";
                thumbStyle.height = props.thumbSize + "px";
            }
            thumbStyle.borderRadius = `${props.thumbSize / 2}px`;
        }

        function updateThumbStyle() {
            const wrapEl = wrap.value!;
            if (props.vertical) {
                let height = wrapEl.clientHeight / wrapEl.scrollHeight * 100;
                if (height >= 100) {
                    height = 0;
                }
                thumbStyle.height = height + "%";
                thumbStyle.transform = `translate3d(0, ${wrapEl.scrollTop / wrapEl.scrollHeight * wrapEl.clientHeight}px, 0)`;
            } else {
                // console.log("scrollWidth >>", wrapEl.scrollWidth);
                // console.log("scrollLeft >>", wrapEl.scrollLeft);
                // console.log("clientWidth >>", wrapEl.clientWidth);
                // console.log("offsetWidth >>", wrapEl.offsetWidth);
                let width = (wrapEl.clientWidth / wrapEl.scrollWidth) * 100;
                if (width >= 100) {
                    width = 0;
                }
                thumbStyle.width = width + "%";
                thumbStyle.transform = `translate3d(${wrapEl.scrollLeft / wrapEl.scrollWidth * wrapEl.clientWidth}px, 0, 0)`;
                // console.log("------------------------------------");
            }
            thumbStyle.display = "";
        }

        let isDrag = false;
        let distance = 0;
        let startPosition = 0;
        let timer: NodeJS.Timeout;

        function onDragStart(event: MouseEvent) {
            if (event.target !== thumb.value) return;
            // console.log("摁下");
            const wrapEl = wrap.value!;
            isDrag = true;
            distance = props.vertical ? event.clientY : event.clientX;
            startPosition = props.vertical ? wrapEl.scrollTop : wrapEl.scrollLeft;
        }

        function onDragMove(event: MouseEvent) {
            if (!isDrag) return;
            const wrapEl = wrap.value!;
            if (props.vertical) {
                wrapEl.scrollTop = event.clientY - distance + startPosition;
            } else {
                wrapEl.scrollLeft = event.clientX - distance + startPosition;
            }
        }

        function onDragEnd(event: MouseEvent) {
            // console.log("抬起");
            isDrag = false;
            if (!el.value!.contains(event.target as HTMLElement)) {
                thumbStyle.display = "none";
            } else if (props.clickUpdateDelay > 0) {
                // console.log("执行");
                timer && clearTimeout(timer);
                timer = setTimeout(updateThumbStyle, props.clickUpdateDelay);
            }
        }

        function onLeave() {
            if (!isDrag) {
                thumbStyle.display = "none";
            }
        }

        onMounted(function() {
            // console.log("onMounted >>", el.value!.clientHeight);
            // console.log("scrollbarSize >>", scrollbarSize);
            updateWrapStyle();
            initThumbStyle();
            wrap.value && wrap.value.addEventListener("scroll", updateThumbStyle);
            document.addEventListener("mousedown", onDragStart);
            document.addEventListener("mousemove", onDragMove);
            document.addEventListener("mouseup", onDragEnd);
        })

        onUpdated(function() {
            // console.log("onUpdated >>", el.value!.clientHeight);
            updateWrapStyle();
        })

        onUnmounted(function() {
            wrap.value && wrap.value.removeEventListener("scroll", updateThumbStyle);
            document.removeEventListener("mousedown", onDragStart);
            document.removeEventListener("mousemove", onDragMove);
            document.removeEventListener("mouseup", onDragEnd);
            timer && props.clickUpdateDelay > 0 && clearTimeout(timer);
        })

        return {
            el,
            wrap,
            thumb,
            wrapStyle,
            thumbStyle,
            updateThumbStyle,
            onLeave
        }
    }
})
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
    }
    .the-scroll-y {
        height: 100%;
        overflow-y: scroll;
    }
    .the-scroll-thumb {
        outline: none;
        border: none;
        position: absolute;
        background-color: rgba(147, 147, 153, 0.4);
        z-index: 10;
    }
}
</style>