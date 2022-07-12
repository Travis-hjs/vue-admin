<template>
  <div class="echarts-home">
    <div class="chart flex">
      <div class="item chart-left f1">
        <div class="mgb_20">
          <span class="the-tag green mgr_10">折线图</span>
          <el-button class="mgl_20" type="primary" size="mini" @click="lineChange()">修改折线图数据</el-button>
        </div>
        <ChartLine ref="ChartLine" className="line" :chartData="chartLineData" />
        <div class="mgb_20">
          <span class="the-tag green mgr_10">柱状图</span>
          <el-button class="mgl_20" type="primary" size="mini" @click="barChange()">修改柱状图数据</el-button>
        </div>
        <ChartBar ref="ChartBar" className="bar" :chartData="chartBarData" />
      </div>
      <div class="item chart-right">
        <div class="mgb_20">
          <span class="the-tag green mgr_10">本日已收/未收</span>
          <el-button class="mgl_20" type="primary" size="mini" @click="ringChange('shou')">修改数据</el-button>
        </div>
        <ChartRing className="ring" :chartData="chartRingInfo.shou" />
        <div class="mgb_20">
          <span class="the-tag green mgr_10">本日已付/未付</span>
          <el-button class="mgl_20" type="primary" size="mini" @click="ringChange('fu')">修改数据</el-button>
        </div>
        <ChartRing className="ring" :chartData="chartRingInfo.fu" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChartLine from "@/components/Chart/Line.vue";
import ChartBar from "@/components/Chart/Bar.vue";
import ChartRing from "@/components/Chart/Ring.vue";
import { ChartBarData, ChartLineData, ChartRingData } from "@/components/Chart/types";
import { ranInt } from "@/utils";

@Component({
  components: {
    ChartRing,
    ChartLine,
    ChartBar
  }
})
export default class ChrtHome extends Vue {

  chartLineData: ChartLineData = {
    bottom: ["05-01", "06-01", "07-01", "08-01", "09-01", "10-01", "11-01"],
    data: [
      {
        title: "出库",
        color: "#9609d8",
        value: [820, 932, 901, 934, 1290, 1330, 1320]
      },
      {
        title: "入库",
        color: "#09d8c3",
        value: [562, 485, 111, 222, 999, 666, 1531]
      },
      {
        title: "采购",
        color: "#1890ff",
        value: [825, 942, 911, 904, 1200, 1030, 1120]
      }
    ]
  }

  lineChange() {
    const total = this.chartLineData.bottom.length;
    this.chartLineData.data.forEach(item => {
      item.value = new Array(total).fill(0).map(_ => ranInt(300, 3000));
    });
  }

  chartBarData: ChartBarData = {
    bottom: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    data: [
      {
        title: "蒸发量",
        color: "#fabd4b",
        value: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
      },
      {
        title: "降水量",
        color: "#09d8c3",
        value: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
      }
    ],
    yAxisName: "水量",
    yAxisUnit: "ml"
  }

  barChange() {
    const total = this.chartBarData.bottom.length;
    this.chartBarData.data.forEach(item => {
      item.value = new Array(total).fill(0).map(_ => ranInt(10, 6000) / 10);
    });
  }

  chartRingInfo: { shou: ChartRingData, fu: ChartRingData } = {
    shou: [
      { value: 1048, name: "已收", color: "#9609d8" },
      { value: 735, name: "未收", color: "#1890ff" }
    ],
    fu: [
      { value: 241, name: "已付", color: "#0ac0ae" },
      { value: 765, name: "未付", color: "orange" }
    ]
  }

  ringChange(type: "shou" | "fu") {
    this.chartRingInfo[type].forEach(item => {
      item.value = ranInt(10, 1000);
    })
  }
}
</script>
<style lang="scss">
$spacing: 20px;
$shadow: rgba(0, 0, 0, 0.1) 0px 2px 6px 0px;
@mixin shadowBox {
  box-shadow: $shadow;
  background-color: #fff;
  border-radius: 10px;
}

.echarts-home {
  .chart {
    width: 100%;
    padding-top: 20px;
    .item {
      @include shadowBox();
      padding: 15px;
    }
    .chart-left {
      margin-right: $spacing;
      margin-bottom: $spacing;
      overflow: hidden;
      .line {
        width: 100% !important;
        height: 380px !important;
      }
      .bar {
        width: 100% !important;
        height: 380px !important;
      }
    }
    .chart-right {
      margin-bottom: $spacing;
      .ring {
        width: 22vw !important;
        height: 22vw !important;
      }
    }
  }
}
</style>