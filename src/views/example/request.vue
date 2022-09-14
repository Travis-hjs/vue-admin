<template>
  <div class="page-request">
    <h2 class="the-title mgb_30">Http 请求示例，当前页面配置路由缓存</h2>
    <div class="mgb_20" v-if="pageData.showTip">
      <span class="the-tag red mgr_10">请求接口为http，与当前域名https不匹配，可能无法正常请求到数据，需要在http环境下进行</span>
      <button class="the-btn mini green" v-ripple @click="openHttp()">切换至http</button>
    </div>
    <div class="flex">
      <input class="the-input mgb_20 short-input" type="text" v-model="pageData.city" placeholder="请输入城市名">
      <button class="the-btn blue" v-ripple @click="getData()">获取天气数据</button>
    </div>
    <div class="mgb_20" v-if="pageData.desc">
      <span class="the-tag green">{{ pageData.desc }}</span>
    </div>
    <textarea cols="60" rows="30" :value="pageData.content"></textarea>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  // TODO: 设置路由缓存 keepAlive 时，这里必须要设置对应的 name 值
  name: "example-request"
})
</script>
<script lang="ts" setup>
import { reactive } from "vue";
import { getWeather } from "@/api/common";

const pageData = reactive({
  city: "广州",
  loading: false,
  showTable: true,
  content: "",
  tableData: [],
  desc: "",
  showTip: false,
});

// const tableColumns = [
//   { label: "日期", prop: "date", minWidth: "", width: 120 },
//   { label: "最高温度", prop: "high", minWidth: "", width: 120 },
//   { label: "最低温度", prop: "low", minWidth: "", width: 120 },
//   { label: "风力", prop: "fengli", minWidth: 140, width: "" },
//   { label: "风向", prop: "fengxiang", minWidth: 140, width: "" },
//   { label: "天气类型", prop: "type", minWidth: 140, width: "" },
// ]

async function getData() {
  if (!pageData.city) return alert("请输入城市名");
  pageData.loading = true;
  const res = await getWeather(pageData.city);
  pageData.loading = false;
  console.log("获取天气预报数据 >>", res);
  if (res.code === 1) {
    if (res.data.status === 1000) {
      pageData.content = JSON.stringify(res.data, null, 4);
      pageData.tableData = res.data.data.forecast;
      pageData.desc = res.data.data.ganmao;
    } else {
      pageData.content = "";
      pageData.tableData = [];
      pageData.desc = res.data.desc;
    }
  } else {
    alert("网络出错了");
  }
}

function openHttp() {
  location.href = location.href.replace("https", "http");
}

if (location.origin.includes("https")) {
  pageData.showTip = true;
}

</script>
<style lang="scss">
.page-request {
  width: 100%;
  .short-input {
    width: 220px;
    margin-right: 10px;
  }
}
</style>