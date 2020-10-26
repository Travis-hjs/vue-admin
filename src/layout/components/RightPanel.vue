<template>
    <div ref="elRightPanel" class="rightPanel-container">
        <transition name="el-fade-in-linear">
            <div class="rightPanel-background" v-show="show" @click="switchShow(true)"></div>
        </transition>
        <div :class="['rightPanel', show ? 'rightPanel-show' : null]">
            <div class="handle-button" :style="{'top': buttonTop + 'px','background-color': pageState.theme}" @click="switchShow(false)">
                <i :class="[show ? 'el-icon-close' : 'el-icon-setting']" />
            </div>
            <div class="rightPanel-items">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import store from "../../store";

const body = document.body;

@Component({})
export default class RightPanel extends Vue {
    @Prop({ default: false }) private clickNotClose!: boolean;
    @Prop({ default: 250 }) private buttonTop!: number;

    readonly pageState = store.layoutState;

    private show = false;

    @Watch("show")
    private onShowChange(value: boolean) {
        if (value) {
            body.classList.add("showRightPanel");
        } else {
            body.classList.remove("showRightPanel");
        }
    }

    /** 插入到body的顶层节点中，保证层级在最上面 */
    private insertToBody() {
        const elx = this.$refs.elRightPanel as HTMLElement;
        body.insertBefore(elx, body.firstChild);
    }

    /**
     * 切换显示
     * @param isMask 是否为遮罩层点击
     */
    private switchShow(isMask = false) {
        if (isMask && this.clickNotClose) return; 
        this.show = !this.show;
    }

    mounted() {
        this.insertToBody();
    }

    beforeDestroy() {
        const elx = this.$refs.elRightPanel as HTMLElement;
        elx.remove();
    }

}
</script>

<style lang="scss">
// 添加到body节点上面去的class
.showRightPanel {
    overflow: hidden;
    position: relative;
    width: calc(100% - 15px);
}

.rightPanel-container{
    
    .rightPanel-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1010;
        background: rgba(0, 0, 0, 0.45);
    }

    .rightPanel {
        width: 100%;
        max-width: 260px;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
        transition: all 0.25s ease;
        transform: translate(100%);
        background: #fff;
        z-index: 1011;
    }

    .rightPanel-show {
        transform: translate(0);
    }

    .handle-button {
        width: 48px;
        height: 48px;
        position: absolute;
        left: -48px;
        text-align: center;
        font-size: 24px;
        border-radius: 6px 0 0 6px !important;
        z-index: 0;
        cursor: pointer;
        pointer-events: auto;
        color: #fff;
        line-height: 48px;

        i {
            font-size: 24px;
            line-height: 48px;
        }
    }
}

</style>
