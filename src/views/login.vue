<template>
    <div class="login">
        <video autoplay="autoplay" muted="muted" volume="0" :poster="background.poster" loop="loop" class="section-background-video">
            <source type="video/mp4" :src="background.video">   
        </video>
        <div class="mask"></div>
        <el-form class="login_form" label-position="left" ref="loginFormEl" :model="loginForm" :rules="loginRules">
            <h3 class="title">{{ title }}</h3>
            <el-form-item prop="username">
                <span class="svg_container">
                    <svg-icon name="user"/>
                </span>
                <el-input v-model="loginForm.username" type="text" placeholder="用户名或者账号" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg_container">
                    <svg-icon name="password"/>
                </span>
                <el-input :type="pwdType" v-model="loginForm.password" placeholder="密码" @keyup.enter.native="handleLogin(false)" />
                <span class="password_icon" @click="switchInput()">
                    <svg-icon :name="pwdType === 'password' ? 'eye-off' : 'eye-on'"/>
                </span>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" class="btn" type="primary" @click="handleLogin(false)">登录</el-button>
            </el-form-item>
            <div class="tips flex fvertical" v-for="(item, index) in tipList" :key="index">
                <el-button size="mini" type="success" v-copy="item">点击复制</el-button>
                <div class="tips_text f1">账号：{{ item }} 密码 : 随便填</div>
                <el-button size="mini" type="primary" @click="setLoginInfo(item)">一键登录</el-button>
            </div>
        </el-form>

        <a class="copyright" :href="tipLink">{{ tipLink }}</a>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import utils from "../utils";
import apiUser from "../api/User";
import store from "../store";

function validateUsername(rule: any, value: string, callback: Function) {
    if (value.trim().length <= 2) {
        callback(new Error("请输入正确的用户名"));
    } else {
        callback();
    }
}

function validatePass(rule: any, value: string, callback: Function) {
    if (!utils.isValidPassowrd(value)) {
        callback(new Error("密码不能小于6位"));
    } else {
        callback();
    }
}

@Component({})
export default class Login extends Vue {
    title = "vue2-element-ts";
    tipLink = "https://github.com/Hansen-hjs";
    tipList = store.testUserList;

    /** 背景信息 */
    background = {
        poster: "https://ccdn.goodq.top/caches/927a729d326a897a6e2f27a03c31ee07/aHR0cDovLzU3ZThlY2Y0MTE1NWQudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxNy8wNi85OGIyZTYyYzgwOGRkNTdkMDA0MTUxNWVkNjk0NDg5YXByZXZpZXdfaW1hZ2UucG5n.png",
        video: "https://ccdn.goodq.top/caches/927a729d326a897a6e2f27a03c31ee07/aHR0cDovLzU3ZThlY2Y0MTE1NWQudDczLnFpZmVpeWUuY29tL3FmeS1jb250ZW50L3VwbG9hZHMvMjAxNy8wNi85OGIyZTYyYzgwOGRkNTdkMDA0MTUxNWVkNjk0NDg5YS5tcDQ_p_p100_p_3D.mp4"
    }
    /** 登录信息 */
    loginForm = {
        username: "",
        password: ""
    }
    loginRules = {
        username: [
            { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
            { required: true, trigger: "blur", validator: validatePass }
        ]
    }
    loading = false;
    pwdType = "password"
    redirect = false;

    switchInput() {
        this.pwdType = this.pwdType === "password" ? "text" : "password";
    }

    /**
     * 一键登录
     * @param account 账号
     */
    setLoginInfo(account: string) {
        this.loginForm.username = account;
        this.loginForm.password = Math.random().toString(36).substr(2);
        this.handleLogin(true);
    }

    /** 
     * 点击登录 
     * @param adopt 是否不校验直接通过
    */
    handleLogin(adopt: boolean) {
        const elementForm: any = this.$refs["loginFormEl"];
        const start = () => {
            this.loading = true;
            // console.log("用户登录信息：", this.loginForm);
            apiUser.login(this.loginForm, res => {
                // console.log("success", res);
                this.loading = false;
                this.$router.push("/");
            }, err => {
                this.loading = false;
                this.$message.error(err.msg);
            });
        }
        if (adopt) {
            return start();
        }
        elementForm.validate((valid: boolean) => {
            if (valid) {
                start();
            }
        })
    }
}
</script>

<style lang="scss">
$bg: rgba(0,0,0,0);
$light_gray: #eee;
$dark_gray: #889aa4;
.login {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;
    .section-background-video{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%; 
        height: 100%;
        object-fit: cover;
        object-position:center center;
    }
    .mask{ width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); position: absolute; left: 0; top: 0; }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        background-color: $bg;
        input {
            background-color: $bg;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px rgba(0,0,0,0.6) inset !important;
                -webkit-text-fill-color: #fff !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
    .btn{ width: 100%; }
    .copyright{ position: fixed; bottom:20px; z-index: 10; left: 50%; color:#ccc;transform: translate(-50%,-50%); font-size: 14px; }
    .login_form {
        position: absolute;
        left: 50%;
        top: 30%;
        width: 500px;
        margin-left: -250px;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        .tips_text {
            margin: 0 16px;
        }
    }
    .svg_container {
        color: $dark_gray;
        padding: 6px 5px 6px 15px;
        vertical-align: middle;
        display: inline-block;
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }
    .password_icon {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>