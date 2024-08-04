<template>
  <section class="drawer">
    <transition name="fade">
      <div class="wrap" :style="{ 'zIndex': Number(zIndex) || currentZIndex }" v-show="show">
        <div class="f1" @click="onClose()"></div>
        <transition name="drawer-slide">
          <div class="drawer-slide-box" :style="{ 'width': size }" v-show="show">
            <div class="drawer-header f-vertical">
              <div class="f1" v-if="$slots.header">
                <slot name="header"></slot>
              </div>
              <div class="f1" v-else>{{ title }}</div>
              <button class="close-btn" @click="onClose()"><i class="el-icon-close"></i></button>
            </div>
            <el-scrollbar class="drawer-body f1" :style="{ 'background-color': backgroundColor }">
              <div class="content">
                <slot></slot>
              </div>
            </el-scrollbar>
            <div class="drawer-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
/**
 * 自定义抽屉组件
 * - `<el-drawer>`组件内部做了阻止事件冒泡处理，导致其他用户操作点击事件的异常情况，这里重写一个功能类似的组件
 */
export default defineComponent({
  name: "Drawer"
})
</script>
<script lang="ts" setup>
import { usezIndex } from "@/hooks";

defineProps({
  /** 外部传入的定位层级 */
  zIndex: {
    type: [Number, String],
    default: 0
  },
  /**
   * 尺寸，css单位
   * - 目前只支持宽度
   */
  size: {
    type: String,
    default: "30%"
  },
  show: {
    type: Boolean,
    default: false
  },
  /**
   * 抽屉标题，设置`<template #header>`会覆盖当前值
   */
  title: {
    type: String,
    default: ""
  },
  /** 内容背景颜色 */
  backgroundColor: {
    type: String,
    default: ""
  }
});

const emit = defineEmits<{
  (event: "update:show", val: boolean): void
  (event: "close"): void
}>();

const currentZIndex = usezIndex();

function onClose() {
  emit("close");
  emit("update:show", false);
}

</script>
<style lang="scss" scoped>

.drawer {
  width: 100%;
  .wrap {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
  }
  .drawer-slide-box {
    background-color: #fff;
    box-shadow: var(--el-box-shadow-dark);
    display: flex;
    flex-direction: column;
  }
  .drawer-header {
    padding: 10px 7px 10px 15px;
    color: #333;
    min-height: 50px;
    font-size: 18px;
    border-bottom: solid 1px var(--el-border-color);
    .close-btn {
      padding: 4px 8px;
      background-color: transparent;
      border: none;
      outline: none;
      line-height: 1;
      i {
        font-size: 18px;
        color: #555;
      }
    }
  }
  .content {
    padding: 15px;
  }
  .drawer-footer {
    border-top: solid 1px var(--el-border-color);
    padding: 15px;
    text-align: right;
  }
}

.drawer-slide-enter-active, .drawer-slide-leave-active {
  transition: var(--transition);
}

.drawer-slide-enter-from, .drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>