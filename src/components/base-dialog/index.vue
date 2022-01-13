<template>
    <transition name="fade">
        <div
            class="base-dialog flex fvertical fcenter"
            :style="{ 'z-index': zIndex }"
            v-show="value"
            @click="onClose"
        >
            <div
                :class="['base-dialog-content', { 'moving': contentMove }, { 'opened': contentShow }]"
                :style="{ 'width': width, 'transform': `translate3d(${contentX}, ${contentY}, 0) scale(0)` }"
            >   
                <div class="base-dialog-title flex fbetween fvertical">
                    <h2>{{ title }}</h2>
                    <i ref="close-btn" @click="onClose"></i>
                </div>
                <div class="base-dialog-body">
                    <slot></slot>
                </div>
                <div class="base-dialog-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/** 全局定位层级，每使用一个组件累加一次 */
let zIndex = 1000;

/** 基础弹出框组件 */
@Component({
    name: "base-dialog"
})
export default class BaseDialog extends Vue {

    zIndex = zIndex;

    /** 双向绑定显示隐藏值 */
    @Prop({
        type: Boolean,
        default: false
    })
    value!: boolean;

    /** 弹出层内容区域宽度 */
    @Prop({
        type: String,
        default: "50%"
    })
    width!: string;

    @Prop({
        type: String,
        default: "提示"
    })
    title!: string;

    /** 是否可以通过点击遮罩层关闭`Dialog` */
    @Prop({
        type: Boolean,
        default: true
    })
    closeByMask!: boolean

    /** `Dialog`自身是否插入至`body`元素上。嵌套的`Dialog`必须指定该属性并赋值为`true` */
    @Prop({
        type: Boolean,
        default: false
    })
    appendToBody!: boolean;

    $refs!: {
        "close-btn": HTMLElement
    }

    onClose(e: MouseEvent) {
        // console.log("onClose >>", e.target);
        if ((e && e.target === this.$el && this.closeByMask) || (e && e.target === this.$refs["close-btn"])) {
            this.$emit("input", false);
            this.$emit("close");
        }
    }

    /** 内容盒子`x`轴偏移位置 */
    private contentX = "0";

    /** 内容盒子`y`轴偏移位置 */
    private contentY = "0";
    
    /** 因为需要动态设置偏移位置，所以设置完位置之后单独控制该节点切换动画 */
    private contentShow = false;

    /** 内容盒子过渡动画 */
    private contentMove = false;

    @Watch("value")
    onValue(val: boolean) {
        if (!val) {
            this.contentShow = false;
        }
    }

    /**  
     * 设置内容区域位置
     * @param e 鼠标事件
     */
    private setContentPosition(e: MouseEvent) {
        // console.log("x: ", e.pageX, "y: ", e.pageY);
        // console.log(this.value, this.$el.contains(e.target as HTMLElement));
        // 只有在外部点击，且关闭的情况下才会记录左边
        if (!this.value || this.$el.contains(e.target as HTMLElement)) return;
        this.contentMove = false;
        const { clientWidth, clientHeight } = this.$el;
        const centerX = clientWidth / 2;
        const centerY = clientHeight / 2;
        const pageY = e.pageY - centerY;
        const pageX = e.pageX - centerX;
        // this.contentX = `${pageX}px`;
        // this.contentY = `${pageY}px`;
        this.contentX = `${pageX / clientWidth * 100}vw`;
        this.contentY = `${pageY / clientHeight * 100}vh`;
        // this.contentShow = true;
        setTimeout(() => {
            this.contentMove = true;
            this.contentShow = true;
        })
    }

    created() {
        zIndex++;
    }

    mounted() {
        if (this.appendToBody) {
            // 节点初始化之后移动至<body>处
            this.$el.remove();
            document.body.appendChild(this.$el);
        }
        document.addEventListener("click", this.setContentPosition);
    }

    beforeDestroy() {
        // console.log("beforeDestroy >> BaseDialog");
        document.removeEventListener("click", this.setContentPosition);
        this.appendToBody && this.$el.remove(); // 插入至body处的节点要单独移除
    }
}
</script>
<style lang="scss">
@import "@/styles/variables.scss";

.base-dialog {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
}
.base-dialog-content {
    border-radius: 2px; 
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12); 
    background-color: #fff;
    overflow: hidden;
}
.base-dialog-content.opened {
    transform: translate3d(0,0,0) scale(1) !important;
}
.base-dialog-content.moving {
    transition: 0.28s all;
}
.base-dialog-title {
    padding: 12px 14px;
    border-bottom: solid 1px #eee;
    h2 {
        font-size: 22px;
        color: #303133;
        font-weight: normal;
    }
    i {
        display: inline-block;
        width: 28px;
        height: 28px;
        cursor: pointer;
        @include closeIcon(#666, 16px);
    }
}
.base-dialog-body {
    padding: 12px 14px;
    overflow: auto;
    min-height: 0px;
    max-height: 80vh;
    overflow: auto;
}
.base-dialog-footer {
    text-align: right;
    border-top: solid 1px #eee;
    padding: 10px 14px;
}
</style>