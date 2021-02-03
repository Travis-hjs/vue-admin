<template>
    <!-- @wheel.native.prevent -->
    <el-scrollbar class="scroll-container" ref="scrollContainer" :vertical="false" @wheel.prevent="onScroll">
        <slot />
    </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
const tagSpacing = 4;

export default defineComponent({
    name: "ScrollPane",
    setup(props, context) {
        /** 滚动容器节点 */
        const scrollContainer: any = ref(null);

        function onScroll(e: WheelEvent) {
            const eventDelta = (e as any).wheelDelta || -e.deltaY * 40;
            const scrollWrapper = scrollContainer.value.$refs.wrap as HTMLElement;
            scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4;
        }

        // onMounted(function() {
        //     console.log("scrollContainer >>", scrollContainer);
        // })

        return {
            onScroll,
            scrollContainer
        }
    }
})
</script>

<style lang="scss">
.scroll-container {
    white-space: nowrap;
    // position: relative;
    // overflow: hidden;
    width: 100%;
    .el-scrollbar__bar {
        bottom: 0px;
    }

    .el-scrollbar__wrap {
        height: 49px;
    }
}
</style>
