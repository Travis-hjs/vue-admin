<template>
    <div ref="elRightPanel" class="right_panel_content">
        <transition name="el-fade-in-linear">
            <div class="right_panel_background" v-show="show" @click="switchShow(true)"></div>
        </transition>
        <div :class="['right_panel', show ? 'right_panel_show' : null]">
            <div
                :class="['right_button', { 'right_button_hide': !show }]"
                :style="{'top': buttonTop, 'background-color': layoutState.theme}"
                @click="switchShow(false)"
            >
                <i :class="[show ? 'el-icon-close' : 'el-icon-arrow-left']" />
            </div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "../../store";

const body = document.body;

@Component({})
export default class RightPanel extends Vue {
    @Prop({
        type: Boolean,
        default: false
    })
    clickNotClose!: boolean;

    @Prop({ 
        type: String,
        default: "250px",
    })
    buttonTop!: number;

    readonly layoutState = store.layout.state;

    show = false;

    /** 插入到`body`节点中，保证层级在最上面 */
    insertToBody() {
        const elx = this.$refs.elRightPanel as HTMLElement;
        body.appendChild(elx);
    }

    /**
     * 切换显示
     * @param isMask 是否为遮罩层点击
     */
    switchShow(isMask = false) {
        if (isMask && this.clickNotClose) return; 
        this.show = !this.show;
        if (this.show) {
            body.classList.add("show_right_panel");
        } else {
            body.classList.remove("show_right_panel");
        }
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
.show_right_panel {
    overflow: hidden;
    position: relative;
    width: calc(100% - 15px);
}
.right_panel_content{
    .right_panel_background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1010;
        background: rgba(0, 0, 0, 0.45);
    }
    .right_panel {
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
    .right_panel_show {
        transform: translate(0);
    }
    .right_button {
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
        transition: 0.24s all;
        i {
            font-size: 24px;
            line-height: 48px;
        }
    }
    .right_button_hide {
        width: 30px;
        left: -30px;
    }
}
</style>
