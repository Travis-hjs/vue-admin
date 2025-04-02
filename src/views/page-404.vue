<template>
  <div class="page-404 fvc">
    <section>
      <div class="from-top-box f-vertical">
        <div class="mr-[30px]">
          <div class="point-icon mb-[50px]"></div>
          <div class="point-icon"></div>
        </div>
        <div class="radius-icon"></div>
        <div class="code-value">404</div>
      </div>
      <div class="from-right-box mb-[40px]">
        <p class="text">你访问的页面不存在，请确认页面路径是否正确。</p>
        <p class="text">我们只收集某些错误信息，然后需要你重新点击返回首页或返回上一页。</p>
        <div class="pt-[40px]">
          <router-link class="go-back fvc" to="/">返回首页</router-link>
        </div>
      </div>
      <div class="from-bottom-box flex">
        <img class="qrcode-box" src="https://travis-hjs.github.io/images/reward-code.jpg" alt="谢谢打赏！">
        <div class="pt-[20px]">
          <p class="desc">如需技术支持，请扫码联系作者。</p>
          <p class="desc">邮箱地址：{{ project.email }}</p>
          <p class="desc">项目地址：{{ project.link }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import store from '@/store';

export default {
  name: "page-404",
  data() {
    return {
      project: store.projectInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.page-404 {
  width: 100%;
  min-height: 100vh;
  background-color: #0078D7;
  color: #fff;
  .point-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #fff;
  }
  .radius-icon {
    width: 280px;
    height: 280px;
    border: 16px transparent solid;
    border-radius: 100%;
    border-left-color: #fff;
    position: relative;
  }
  .code-value {
    font-size: 240px;
    line-height: 1;
    margin-left: -120px;
  }
  .text {
    font-size: 28px;
    margin-bottom: 16px;
  }
  .desc {
    font-size: 15px;
    line-height: 24px;
  }
  .go-back {
    width: 150px;
    height: 40px;
    padding: 0 16px;
    border-radius: var(--border-radius);
    border: solid 1px #fff;
    font-size: 15px;
    transition: var(--transition);
    &:hover {
      color: #0078D7;
      background-color: #fff;
      border-color: #0078D7;
    }
  }
  .qrcode-box {
    width: 120px;
    height: 120px;
    // border-radius: 50%;
    overflow: hidden;
    display: block;
    margin-right: 20px;
  }
  .from-top-box {
    animation: from-top 0.5s ease;
  }
  .from-right-box {
    animation: from-right 0.5s ease;
    animation-delay: 0.5s;
    animation-fill-mode: backwards;
  }
  .from-bottom-box {
    animation: from-bottom 0.5s ease;
    animation-delay: 1s;
    animation-fill-mode: backwards;
  }
}

@keyframes from-top {
  0% {
    opacity: 0;
    transform: translate3d(0, -100px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes from-right {
  0% {
    opacity: 0;
    transform: translate3d(100px, 0, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes from-bottom {
  0% {
    opacity: 0;
    transform: translate3d(0, 80px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>