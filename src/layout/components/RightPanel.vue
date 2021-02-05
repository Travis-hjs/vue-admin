<template>
    <div ref="elRightPanel" class="rightPanel-container">
        <transition name="el-fade-in-linear">
            <div class="rightPanel-background" v-show="show" @click="switchShow(true)"></div>
        </transition>
        <div :class="['rightPanel', show ? 'rightPanel-show' : null]">
            <div class="handle-button" :style="{'top': buttonTop + 'px','background-color': layoutState.theme}" @click="switchShow(false)">
                <i :class="[show ? 'el-icon-close' : 'el-icon-setting']" />
            </div>
            <div class="rightPanel-items">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import store from "../../store";

export default defineComponent({
    name: "RightPanel",
    props: {
        clickNotClose: {
            type: Boolean,
            default: false
        },
        buttonTop: {
            type: Number,
            default: 250
        }
    },
    setup(props, context) {
        const body = document.body;
        const layoutState = store.layoutState;
        const elRightPanel = ref<HTMLElement>(null as any);
        let show = ref(false);

        /**
         * 切换显示
         * @param isMask 是否为遮罩层点击
         */
        function switchShow(isMask = false) {
            if (isMask && props.clickNotClose) return; 
            show.value = !show.value;
            if (show.value) {
                body.classList.add("showRightPanel");
            } else {
                body.classList.remove("showRightPanel");
            }
        }

        onMounted(function() {
            body.appendChild(elRightPanel.value);
        })

        onBeforeUnmount(function() {
            const el = elRightPanel.value;
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        })

        return {
            elRightPanel,
            layoutState,
            show,
            switchShow
        }
    }
})
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
