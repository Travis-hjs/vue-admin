<template>
    <div class="http_request">
        <el-card>
            <div style="margin-bottom: 20px;" v-if="pageData.showTip">
                <el-tag type="danger" style="margin-right: 14px;">请求接口为http，与当前域名https不匹配，可能无法正常请求到数据，需要在http环境下进行</el-tag>
                <el-button type="warning" size="small" @click="openHttp()">切换至http</el-button>
            </div>
            <div class="flex fvertical" style="margin-bottom: 16px;">
                <el-input v-model="pageData.city" clearable placeholder="请输入城市名" style="width: 300px; margin-right: 16px;"></el-input>
                <el-button type="primary" @click="getData()" :loading="pageData.loading" >
                    <svg-icon v-show="pageData.loading" name="international" />
                    <span style="padding-left: 8px;">获取天气数据</span>
                </el-button>
                <el-button type="success" icon="el-icon-document" v-if="pageData.content" v-copy="pageData.content">复制数据</el-button>
            </div>
            <el-input type="textarea" autosize placeholder="数据响应结果" v-model="pageData.content"></el-input>
        </el-card>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import api from "../../api";

@Component({})
export default class HttpRequest extends Vue {
    pageData = {
        city: "广州",
        loading: false,
        content: "",
        showTip: false
    }

    async getData() {
        if (!this.pageData.city) return this.$message.warning("请输入城市名");
        this.pageData.loading = true;
        const res = await api.getWeather(this.pageData.city)
        this.pageData.loading = false;
        console.log("获取天气预报数据 >>", res);
        if (res.code === 1) {
            this.pageData.content = JSON.stringify(res.data, null, 4);
        }
    }
        
    openHttp() {
        location.href = location.href.replace("https", "http");
    }

    mounted() {
        console.clear();
        if (location.origin.includes("https")) {
            this.pageData.showTip = true;
        }
    }
}
</script>
<style lang="scss">
.http_request {
    width: 100%;
}
</style>