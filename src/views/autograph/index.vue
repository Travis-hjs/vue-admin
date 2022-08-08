<template>
  <div class="page-canvas-autograph">
    <div class="autograph-box" ref="autograph-box"></div>
    <div class="pdt_10 pdb_20">
      <el-button @click="onReset()">重置签名</el-button>
      <el-button type="primary" @click="setImage()">生成签名</el-button>
    </div>
    <img class="autograph-img" v-if="imgUrl" :src="imgUrl" alt="">
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import canvasAutograph, { Autograph, CanvasAutographOption } from "@/utils/canvasAutograph";

@Component({})
export default class PageAutograph extends Vue {

  $refs!: {
    "autograph-box": HTMLElement
  }

  autograph!: Autograph;

  options!: CanvasAutographOption;
  
  timer!: NodeJS.Timeout;

  imgUrl = "";

  setImage() {
    const base64 = this.autograph.getBase64();
    if (!base64) return this.$message.warning("没有任务签名！");
    this.imgUrl = base64;
  }

  onReset() {
    this.autograph.reset();
    this.options.lineColor = "#2C72F3";
    this.options.lineSize = 4;
    this.imgUrl = "";
    this.timer && clearTimeout(this.timer);
  }

  mounted() {
    this.options = {
      el: this.$refs["autograph-box"],
      lineColor: "orange",
      lineSize: 4
    }
    this.autograph = canvasAutograph(this.options);
    this.timer = setTimeout(() => {
      this.options.lineColor = "green";
      this.options.lineSize = 8;
    }, 3000);
  }
}
</script>
<style lang="scss">
.page-canvas-autograph {
  width: 100%;
  .autograph-box {
    width: 540px;
    height: 320px;
    border: solid 1px #eee;
  }
  .autograph-img {
    width: 540px;
  }
}
</style>