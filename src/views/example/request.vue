<template>
  <div class="page-request">
    <h2 class="the-title mgb-30">Http 请求示例，当前页面配置路由缓存</h2>
    <div class="flex">
      <el-input class="mgb-20 short-input" v-model="pageData.city" placeholder="请输入城市名"></el-input>
      <el-button type="primary" v-ripple @click="getData()" :disabled="pageData.loading">获取天气数据</el-button>
    </div>
    <div class="mgb-20" v-if="pageData.desc">
      <span :class="['the-tag', pageData.error ? 'red' : 'green']">{{ pageData.desc }}</span>
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
import { message } from "@/utils/message";

const pageData = reactive({
  city: "广州",
  loading: false,
  showTable: true,
  content: "",
  desc: "",
  error: false
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
  if (!pageData.city) return message.warning("请输入城市名");
  pageData.loading = true;
  const res = await getWeather(pageData.city);
  pageData.loading = false;
  console.log("获取天气预报数据 >>", res);
  if (res.code === 1) {
    const result = res.data;
    pageData.content = JSON.stringify(result, undefined, 4);
    pageData.error = !!result.errcode;
    if (pageData.error) {
      pageData.desc = result.errmsg;
    } else {
      pageData.desc = `${result.week} > ${result.wea} > ${result.win} > 最低温度 ${result.tem_night}° > 最高温度 ${result.tem_day}°`;
    }
  }
}

</script>
<style lang="scss">
.page-request {
  width: 100%;
  .short-input {
    width: 220px;
    margin-right: 10px;
  }
  textarea {
    font-size: 15px;
    color: #555;
    padding: 10px;
    border: solid 1px #ccc;
    outline-color: var(--blue);
  }
}
</style>