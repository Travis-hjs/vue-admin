<template>
  <div class="login-page">
    <div class="content">
      <div class="title">
        <span>{{ info.name }}</span>
      </div>
      <div class="form-box">
        <div class="login-form">
          <div class="login-title">平台登录</div>
          <input class="the-input mb-[20px]" type="text" v-model="formData.account" placeholder="请输入账号">
          <input class="the-input mb-[20px]" type="password" v-model="formData.password" placeholder="请输入密码">
          <button class="the-btn blue mb-[20px]" v-ripple style="width: 100%" @click="onLogin(false)" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
          <CheckBox class="mb-[20px]" v-model="remember" label="记住账号/密码" />
          <div class="tips f-vertical" v-for="(item, index) in tipList" :key="index">
            <button class="the-btn mini green" v-ripple v-copy="item" :disabled="loading">点击复制</button>
            <div class="tips_text f1">账号: {{ item }}; 密码: 随便填</div>
            <button class="the-btn mini blue" v-ripple :disabled="loading" @click="setLoginInfo(item)">一键登录</button>
          </div>
        </div>
      </div>
      <div class="bottom-text">{{ copyRight }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import store from "@/store";
import { login } from "@/api/common";
import { openNextPage } from "@/router/permission";
import { modifyData } from "@/utils";
import { message } from "@/utils/message";
import { CheckBox } from "@/components/CheckBox";

const cacheName = "login-info";

const tipList = ["admin", "normal"];

const info = store.projectInfo;

const copyRight = "Copyright © Travis-hjs.github.io All Rights Reserved 请使用 Google Chrome、Microsoft Edge、360浏览器、非 IE 等浏览器"

/** 表单数据 */
const formData = reactive({
  account: "",
  password: ""
})

const loading = ref(false);

/**
 * 一键登录
 * @param account 账号
 */
function setLoginInfo(account: string) {
  formData.account = account;
  formData.password = Math.random().toString(36).substr(2);
  onLogin(true);
}

/** 
 * 点击登录 
 * @param adopt 是否不校验直接通过
 */
function onLogin(adopt: boolean) {
  async function start() {
    loading.value = true;
    const res = await login(formData)
    loading.value = false;
    if (res.code === 1) {
      saveLoginInfo();
      openNextPage();
    } else {
      message.error(res.msg);
    }
  }
  if (adopt) {
    return start();
  }
  if (!formData.account) {
    return message.error("请输入账号");
  }
  if (!formData.password) {
    return message.error("请输入密码");
  }
  start();
}

/** 是否记住密码 */
const remember = ref(false);

function saveLoginInfo() {
  if (remember.value) {
    localStorage.setItem(cacheName, JSON.stringify({ remember: true, ...formData }));
  } else {
    localStorage.removeItem(cacheName);
  }
}

function getLoginInfo() {
  const value = localStorage.getItem(cacheName);
  if (value) {
    try {
      const info = JSON.parse(value);
      remember.value = !!info.remember;
      modifyData(formData, info);
    } catch (error) {
      console.warn(error);
    }
  }
}

getLoginInfo();
</script>

<style lang="scss">

.login-page {
  width: 100%;
  min-height: 100vh;
  background-color: #2253dc;
  background-image: linear-gradient(45deg, #2253dc 0%, #4fb8f9 99%);
  position: relative;
  z-index: 1;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("../assets/admin-login-bg.jpg");
    // background-size: 100% auto;
    background-size: cover;
    background-position: center center;
    z-index: 2;
  }
  .content {
    position: absolute;
    z-index: 3;
    top: 50%;
    // margin-top: -245px;
    margin-top: -302px;
    right: 10%;
    width: 100%;
    max-width: 480px;
    .form-box {
      background-color: #81c7fa;
      border: solid 2px #3b9be5;
      padding: 10px;
      width: 100%;
      margin-bottom: 40px;
      .login-form {
        background-color: #fff;
        padding: 40px 40px 30px;
      }
      .login-title {
        font-size: 22px;
        line-height: 22px;
        color: var(--blue);
        margin-bottom: 30px;
        text-align: center;
      }
      .el-checkbox {
        color: #999;
      }
    }
    .title {
      text-align: center;
      font-size: 28px;
      color: #fff;
      margin-bottom: 24px;
      text-shadow: 4px 4px 4px #333;
      // letter-spacing: 2px;
      font-family: "宋体";
      span {
        line-height: 1;
      }
    }
    .bottom-text {
      width: 100%;
      max-width: 500px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
      line-height: 22px;
      margin: 0 auto;
      text-align: center;
    }
  }
  .tips {
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
    .tips_text {
      margin: 0 16px;
    }
  }
}
@media screen and (max-width: 500px) {
  .login-page {
    .content {
      right: 0;
    }
  }
}
</style>