<template>
  <div class="the-fold-box flex" ref="foldBox" :style="{ 'height': useHeight }">
    <div class="f1">
      <slot></slot>
    </div>
    <!-- 当只有一行的时候不显示展开按钮 -->
    <div v-show="showBtn">
      <button :class="['the-fold-btn', {'the-fold-btn-open': isOpen }]" @click="onSwitch()">
        {{ isOpen ? '收起' : '展开' }} <i class="el-icon-caret-bottom"></i>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/** 折叠盒子组件 */
@Component({
  name: "FoldBox",
})
export default class FoldBox extends Vue {
  /** 关闭的高度 */
  @Prop({
    type: String,
    default: "38px",
  })
  closeHeight!: string;

  /** 展开时的高度，默认自适应 */
  @Prop({
    type: String,
    default: "",
  })
  openHeight!: string;

  isOpen = false;
  /** 当前容器的自动高度 */
  boxHeight = "";
  /** 是否正在更新 */
  isOnUpdate = false;
  /** 是否展示操作按钮 */
  showBtn = false;

  get useHeight() {
    const max = this.openHeight || this.boxHeight || "auto";
    const height = this.isOpen ? max : this.closeHeight;
    return this.isOnUpdate ? "auto" : height;
  }

  $refs!: {
    foldBox: HTMLElement;
  };

  /** 更新当前容器尺寸 */
  updateSize() {
    const needShow = (height: string) => parseFloat(height) > parseFloat(this.closeHeight);
    // 先隐藏按钮，再判断
    this.showBtn = false;
    // 当存在外部设置的展开高度时，就不获取自适应高度了
    if (this.openHeight) {
      this.showBtn = needShow(this.openHeight);
      return;
    }
    this.isOnUpdate = true;
    const box = this.$refs["foldBox"];
    // this.boxHeight = box.clientHeight + "px";
    // this.isOnUpdate = false;
    this.$nextTick(() => {
      // console.log("使用的高度 >>", this.useHeight);
      this.boxHeight = box.clientHeight + "px";
      // console.log("节点高度 >>", this.boxHeight);
      this.showBtn = needShow(this.boxHeight);
      this.isOnUpdate = false;
    });
  }

  onSwitch() {
    this.isOpen = !this.isOpen;
    this.$emit("change", this.isOpen);
  }

  mounted() {
    this.updateSize();
  }
}
</script>
<style lang="scss">
@import "@/styles/variables.scss";

.the-fold-box {
  width: 100%;
  overflow: hidden;
  @include moveTime();
  .the-fold-btn {
    background-color: transparent;
    // border: gold 1px solid;
    border: none;
    outline: none;
    padding: 2px 6px;
    font-size: 14px;
    color: $theme;
    i {
      @include moveTime();
    }
  }
  .the-fold-btn-open {
    i {
      transform: rotate(180deg);
    }
  }
}
</style>