
<template>
    <div class="login_page">
        <div class="content">
            <div class="title">
                <!-- <img class="logo" :src="info.logo" :alt="info.title"> -->
                <span>{{ info.name }}</span>
            </div>
            <div class="form_box">
                <div class="login_form">
                    <div class="login_title">平台登录</div>
                    <el-form label-position="left" ref="the-form" :model="formData" :rules="formRules">
                        <el-form-item prop="account">
                            <el-input v-model="formData.account" :placeholder="formRules.account[0].message" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input show-password v-model="formData.password" :placeholder="formRules.password[0].message" @keyup.enter.native="onLogin(false)" />
                        </el-form-item>
                        <el-form-item>
                            <div class="mgb_10">
                                <el-button :loading="loading" type="primary" @click="onLogin(false)" style="width: 100%">登录</el-button>
                            </div>
                            <el-checkbox v-model="remember">记住账号/密码</el-checkbox>
                        </el-form-item>
                    </el-form>
                    <div class="tips flex fvertical" v-for="(item, index) in tipList" :key="index">
                        <el-button size="mini" type="success" v-copy="item">点击复制</el-button>
                        <div class="tips_text f1">账号: {{ item }}; 密码: 随便填</div>
                        <el-button size="mini" type="primary" @click="setLoginInfo(item)">一键登录</el-button>
                    </div>
                </div>
            </div>
            <div class="bottom-text">{{ copyRight }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { login } from "@/api/common";
import { openNextPage } from "../router/permission";
import { Form } from "element-ui";
import store from "@/store";
import { LoginParams } from "@/types/user";
import { modifyData } from "@/utils";

const cacheName = "login-info";

@Component({})
export default class Login extends Vue {
    
    readonly tipList = ["admin", "normal"];

    readonly info = store.projectInfo;

    readonly copyRight = "Copyright © Hansen-hjs.github.io All Rights Reserved 请使用 Google Chrome、Microsoft Edge、360浏览器、IE9 及以上版本等浏览器"

    /** 登录信息 */
    readonly formData: LoginParams = {
        account: "",
        password: ""
    }
    
    readonly formRules = {
        account: [
            { required: true, message: "请输入账号", trigger: "blur" },
            { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
            {
                validator: function(rule: any, value: string, callback: Function) {
                    if (value) {
                        if (/[\u4E00-\u9FA5]/g.test(value)) {
                            callback(new Error("账号不能有中文！"));
                        } else {
                            callback();
                        }
                    }
                    callback();
                },
                trigger: "blur" 
            }
        ],
        password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
    }
    
    loading = false;

    $refs!: {
        "the-form": Form
    }

    /**
     * 一键登录
     * @param account 账号
     */
    setLoginInfo(account: string) {
        this.formData.account = account;
        this.formData.password = Math.random().toString(36).substr(2);
        this.onLogin(true);
    }

    /** 
     * 点击登录 
     * @param adopt 是否不校验直接通过
     */
    onLogin(adopt: boolean) {
        const start = async () => {
            this.loading = true;
            // console.log("用户登录信息：", this.formData);
            const res = await login(this.formData);
            this.loading = false;
            if (res.code === 1) {
                this.saveLoginInfo();
                openNextPage();
            } else {
                this.$message.error(res.msg);
            }
        }
        if (adopt) {
            return start();
        }

        this.$refs["the-form"].validate(valid => {
            if (valid) {
                start();
            }
        })
    }

    /** 是否记住密码 */
    remember = false;

    saveLoginInfo() {
        if (this.remember) {
            localStorage.setItem(cacheName, JSON.stringify({ remember: true, ...this.formData }));
        } else {
            localStorage.removeItem(cacheName);
        }
    }

    getLoginInfo() {
        const value = localStorage.getItem(cacheName);
        if (value) {
            try {
                const info = JSON.parse(value);
                this.remember = !!info.remember;
                modifyData(this.formData, info);
            } catch (error) {
                console.warn(error);
            }
        }
    }

    created() {
        this.getLoginInfo();
    }
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.login_page {
    width: 100%;
    height: 100%;
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
        .form_box {
            background-color: #81c7fa;
            border: solid 2px #3b9be5;
            padding: 10px;
            width: 100%;
            margin-bottom: 40px;
            .login_form {
                background-color: #fff;
                padding: 40px 50px 30px;
            }
            .login_title {
                font-size: 22px;
                line-height: 22px;
                color: $theme;
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
        // .logo {
        //     display: inline-block;
        //     vertical-align: text-bottom;
        //     width: 24px;
        //     vertical-align: text-bottom;
        //     padding-right: 10px;
        //     box-sizing: content-box;
        // }
        .bottom-text {
            width: 100%;
            max-width: 500px;
            font-size: 14px;
            color: rgba(255,255,255,0.8);
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
    .login_page {
        .content {
            right: 0;
        }
    }
}
</style>