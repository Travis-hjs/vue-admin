<script lang="ts" setup>
import { reactive, ref } from "vue";
import store from "@/store";
import { login } from "@/api/common";
import { openNextPage } from "@/router/permission";
import { jsonParse } from "@/utils";
import { type FormInstance } from "element-plus";
import { validateEX } from "@/utils/dom";
import { getInputRule } from "@/hooks/common";

const cacheName = "login-info";

const tipList = ["admin", "normal"];

const info = store.projectInfo;

const copyRight = "Copyright © Travis-hjs.github.io All Rights Reserved 请使用 Google Chrome、Microsoft Edge、360浏览器、非 IE 等浏览器"

const formRules = {
  account: getInputRule("请输入手机号"),
  password: getInputRule("请输入密码"),
}

const state = reactive({
  loading: false,
  form: {
    account: "",
    password: "",
  },
  remember: false,
});

/**
 * 一键登录
 * @param account 账号
 */
function setLoginInfo(account: string) {
  state.form.account = account;
  state.form.password = Math.random().toString(36).substr(2);
  onLogin();
}

const theForm = ref<FormInstance>();

function onLogin() {
  theForm.value!.validate(async function(val) {
    validateEX("#the-form", val);
    if (!state) return;
    state.loading = true;
    const res = await login(state.form)
    state.loading = false;
    if (res.code === 1) {
      saveLoginInfo();
      openNextPage();
    }
  });
}

function saveLoginInfo() {
  if (state.remember) {
    localStorage.setItem(cacheName, JSON.stringify({ remember: true, ...state.form }));
  } else {
    localStorage.removeItem(cacheName);
  }
}

function getLoginInfo() {
  const info = jsonParse(localStorage.getItem(cacheName));
  state.remember = !!info.remember;
  state.form = info;
}

getLoginInfo();
</script>
<template>
  <div class="login-page">
    <div class="content">
      <div class="title">
        <span>{{ info.name }}</span>
      </div>
      <div class="form-box">
        <div class="login-form">
          <div class="login-title">平台登录</div>
          <el-form
            ref="theForm"
            id="the-form"
            size="large"
            :model="state.form"
            :rules="formRules"
            status-icon
          >
            <el-form-item prop="account">
              <el-input
                v-model="state.form.account"
                :placeholder="formRules.account.message"
                clearable
                type="text"
                @keyup.enter.native="onLogin"
              >
                <template #prefix><i class="el-icon-user"></i></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="state.form.password"
                :placeholder="formRules.password.message"
                clearable
                type="password"
                :show-password="true"
                @keyup.enter.native="onLogin"
              >
                <template #prefix><i class="el-icon-key"></i></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="">
              <div class="w-full">
                <el-button type="primary" class="w-full" :loading="state.loading" @click="onLogin">立即登录</el-button>
              </div>
              <el-checkbox v-model="state.remember" size="large">记住账号/密码</el-checkbox>
            </el-form-item>
          </el-form>
          <div class="mb-[10px] w-full f-vertical" v-for="(item, index) in tipList" :key="index">
            <div class="f1"><span class="the-tag gray">账号: {{ item }}; 密码: 随便填</span></div>
            <el-button type="primary" plain :disabled="state.loading" @click="setLoginInfo(item)">一键登录</el-button>
          </div>
        </div>
      </div>
      <div class="bottom-text">{{ copyRight }}</div>
    </div>
  </div>
</template>
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
        padding: 40px 40px 20px;
      }
      .login-title {
        font-size: 22px;
        line-height: 22px;
        color: var(--blue);
        margin-bottom: 30px;
        text-align: center;
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
}
@media screen and (max-width: 500px) {
  .login-page {
    .content {
      right: 0;
    }
  }
}
</style>
