<template>
    <div class="http_request">
        <el-card>
            <div class="mrb_20" v-if="pageData.showTip">
                <el-tag type="danger" style="margin-right: 14px;">请求接口为http，与当前域名https不匹配，可能无法正常请求到数据，需要在http环境下进行</el-tag>
                <el-button type="warning" size="small" @click="openHttp()">切换至http</el-button>
            </div>
            <div class="flex fvertical mrb_20">
                <el-input v-model="pageData.city" clearable placeholder="请输入城市名" style="width: 300px; margin-right: 16px;"></el-input>
                <el-button type="primary" @click="getData()" :loading="pageData.loading" >
                    <svg-icon v-show="pageData.loading" name="international" />
                    <span style="padding-left: 8px;">获取天气数据</span>
                </el-button>
                <el-button type="success" icon="el-icon-document" v-if="pageData.content" v-copy="pageData.content">复制数据</el-button>
                <el-switch v-model="pageData.showTable" active-text="表单展示" inactive-text="响应数据展示" style="margin-left: 16px;"></el-switch>
            </div>
            <template v-if="pageData.showTable">
                <el-tag class="mrb_20" type="warning" v-show="pageData.desc">{{ pageData.desc }}</el-tag>
                <el-table :data="pageData.tableData" border stripe>
                    <el-table-column v-for="item in tableColumns" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :min-width="item.minWidth" align="center"></el-table-column>
                </el-table>
            </template>
            <el-input type="textarea" autosize placeholder="数据响应结果" v-model="pageData.content" v-else></el-input>
        </el-card>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getWeather } from "../../api/common";

@Component({})
export default class HttpRequest extends Vue {
    readonly pageData = {
        city: "广州",
        loading: false,
        showTable: true,
        content: "",
        tableData: [],
        desc: "",
        showTip: false
    }

    readonly tableColumns = [
        { label: "日期", prop: "date", minWidth: "", width: 120 },
        { label: "最高温度", prop: "high", minWidth: "", width: 120 },
        { label: "最低温度", prop: "low", minWidth: "", width: 120 },
        { label: "风力", prop: "fengli", minWidth: 140, width: "" },
        { label: "风向", prop: "fengxiang", minWidth: 140, width: "" },
        { label: "天气类型", prop: "type", minWidth: 140, width: "" },
    ]

    async getData() {
        if (!this.pageData.city) return this.$message.warning("请输入城市名");
        this.pageData.loading = true;
        const res = await getWeather(this.pageData.city)
        this.pageData.loading = false;
        console.log("获取天气预报数据 >>", res);
        if (res.code === 1) {
            if (res.data.status === 1000) {
                this.pageData.content = JSON.stringify(res.data, null, 4);
                this.pageData.tableData = res.data.data.forecast;
                this.pageData.desc = res.data.data.ganmao;
            } else {
                this.$message.error(res.data.desc);
            }
        } else {
            this.$message.error("网络出错了");
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
    .mrb_20 { margin-bottom: 20px; }
}
</style>