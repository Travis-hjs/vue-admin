<script lang="ts">
/** 基础弹出框组件 */
export default {
  name: "base-dialog"
}
</script>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useZIndex } from "@/hooks/common";
import { Scrollbar } from "../Scrollbar";

const props = defineProps({
  title: {
    type: String,
    default: "提示"
  },
  /** 是否显示 */
  show: {
    type: Boolean,
    default: false
  },
  /** 弹出层内容区域宽度 */
  width: {
    type: String,
    default: "50%"
  },
  /** 是否可以通过点击遮罩层关闭`Dialog` */
  closeByMask: {
    type: Boolean,
    default: false
  },
  /** `Dialog`自身是否插入至`body`元素上。嵌套的`Dialog`必须指定该属性 */
  appendToBody: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits<{
  (event: "close"): void;
  (event: "update:show", show: boolean): void;
  (event: "afterLeave"): void;
  (event: "afterEnd"): void;
}>();

const currentZIndex = useZIndex();

/** 当前组件节点 */
const el = ref<HTMLElement>();
/** 关闭按钮节点 */
const closeBtn = ref<HTMLElement>();
/** 弹出框内容节点 */
const contentBox = ref<HTMLElement>();
/**
 * 是否显示弹框中间内容
 * - 因为需要动态设置偏移位置，所以设置完位置之后单独控制该节点切换动画
 */
const contentShow = ref(false);

watch(() => props.show, function (val) {
  if (val) {
    // TODO: 等设置完偏移变量值之后，再开始缩放动画
    // 这里不能用 nextTick 代替
    setTimeout(() => {
      contentShow.value = true;
    }, 0);
  } else {
    contentShow.value = false;
  }
}, {
  immediate: true
});

/**  
 * 设置内容区域位置
 * @param e 鼠标事件
 */
function setContentPosition(e: MouseEvent) {
  // console.log("setContentPosition >>", e);
  // 只有在外部点击，且关闭的情况下才会记录坐标
  if (!props.show || contentShow.value || el.value!.contains(e.target as HTMLElement)) return;
  const { clientWidth, clientHeight } = el.value!;
  const centerX = clientWidth / 2;
  const centerY = clientHeight / 2;
  const pageY = e.clientY - centerY;
  const pageX = e.clientX - centerX;
  const x = `${pageX / clientWidth * 100}vw`;
  const y = `${pageY / clientHeight * 100}vh`;
  setVariable(x, y);
}

/**
 * 设置内容节点偏移位置变量
 * @param x
 * @param y
 */
function setVariable(x: string, y: string) {
  const el = contentBox.value;
  if (el) {
    el.style.setProperty("--content-x", x);
    el.style.setProperty("--content-y", y);
  }
}

function onClose(e: MouseEvent) {
  // console.log("onClose >>", e.target);
  if ((e && e.target === el.value && props.closeByMask) || (e && e.target === closeBtn.value)) {
    emit("update:show", false);
    emit("close");
  }
}

function onAfterLeave() {
  contentShow.value && setVariable("0", "0");
  emit("afterLeave");
}

function onAfterEnter() {
  emit("afterEnd");
}

onMounted(function () {
  document.addEventListener("click", setContentPosition);
});

onUnmounted(function () {
  document.removeEventListener("click", setContentPosition);
});
</script>
<template>
  <section>
    <teleport to="body" :disabled="!props.appendToBody">
      <transition name="fade">
        <div ref="el" class="base-dialog fvc" :style="{ 'zIndex': currentZIndex }" v-show="props.show" @click="onClose">
          <transition name="dialog-move" @after-leave="onAfterLeave" @after-enter="onAfterEnter">
            <div
              ref="contentBox"
              class="base-dialog-content flex"
              :style="{ 'width': props.width }"
              v-show="contentShow"
            >
              <div class="base-dialog-title f-between f-vertical">
                <h2 class="base-dialog-text" v-if="!$slots.header">{{ title }}</h2>
                <slot name="header"></slot>
                <i class="base-dialog-icon" ref="closeBtn" @click="onClose"></i>
              </div>
              <div class="base-dialog-body">
                <Scrollbar maxHeight="76vh">
                  <slot></slot>
                </Scrollbar>
              </div>
              <div class="base-dialog-footer" v-if="$slots.footer">
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
  </section>
</template>
<style lang="scss">
@import "@/styles/mixins.scss";

.base-dialog {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.base-dialog-content {
  border-radius: var(--border-radius);
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  overflow: hidden;
  flex-direction: column;
  // max-height: 90vh;
}

.dialog-move-enter-active, .dialog-move-leave-active {
  transition: var(--transition);
}

.dialog-move-enter-from, .dialog-move-leave-to {
  transform: translate3d(var(--content-x), var(--content-y), 0) scale(0);
}

.base-dialog-title {
  padding: 12px 14px;
  border-bottom: solid 1px #eee;

  .base-dialog-text {
    font-size: 18px;
    color: #303133;
    font-weight: normal;
  }

  .base-dialog-icon {
    display: inline-block;
    width: 28px;
    height: 28px;
    cursor: pointer;
    transform: rotate(0);
    @include close-icon(#666, 16px);
    transition: var(--transition);

    &:hover {
      transform: rotate(180deg);
    }
  }
}

.base-dialog-body {
  padding: 12px 15px;
  min-height: 0px;
  // overflow: auto;
}

.base-dialog-footer {
  text-align: right;
  border-top: solid 1px #eee;
  padding: 12px 15px;
}
</style>
