<template>
    <div class="page-language">
        <div class="mgb_20">
            <el-select v-model="$languageType">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <h2 class="the-title mgb_20">{{ $language.projectName }}</h2>
        <el-form label-width="140px" label-position="left">
            <el-form-item :label="$language.login.account">
                <el-input :placeholder="$language.input + $language.login.account"></el-input>
            </el-form-item>
            <el-form-item :label="$language.login.password">
                <el-input :placeholder="$language.input + $language.login.password"></el-input>
            </el-form-item>
            <el-button type="primary" size="medium">{{ $language.login.signIn }}</el-button>
            <el-button type="success" size="medium">{{ $language.login.register }}</el-button>
            <el-button type="text" size="medium">{{ $language.login.logout }}</el-button>
        </el-form>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class LanguageDemo extends Vue {
    options = [
        { label: "中文", value: "zh" },
        { label: "English", value: "en" },
        { label: "日本語", value: "ja" },
    ]
}
</script>
<style lang="scss">
.page-language {
    width: 100%;
    .el-form {
        width: 100%;
        max-width: 600px;
    }
}
</style>