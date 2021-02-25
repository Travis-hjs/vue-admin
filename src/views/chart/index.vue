<template>
    <div class="chart_home">
        <div class="chart flex">
            <div class="item chart_left f1">
                <div class="title">折线图</div>
                <ChartLine ref="ChartLine" className="line" :chartData="chartLineData" />
                <div class="title">柱状图</div>
                <ChartBar ref="ChartBar" className="bar" :chartData="chartBarData" />
            </div>
            <div class="item chart_right">
                <div class="title">本日已收/未收</div>
                <ChartRing className="ring" :chartData="chartRingInfo.shou" />
                <div class="title">本日已付/未付</div>
                <ChartRing className="ring" :chartData="chartRingInfo.fu" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ChartLine from "../../components/ChartLine.vue";
import ChartBar from "../../components/ChartBar.vue";
import ChartRing from "../../components/ChartRing.vue";
import store from "../../store";
import { ChartBarData, ChartLineData, ChartRingData } from "../../utils/interfaces";

@Component({
    components: {
        ChartRing,
        ChartLine,
        ChartBar
    }
})
export default class ChrtHome extends Vue {
    readonly layoutState = store.layoutState;

    private timer!: NodeJS.Timeout;

    @Watch("layoutState.sidebarOpen")
    onSidebarOpenChange() {
        const line = this.$refs.ChartLine as ChartLine;
        const bar = this.$refs.ChartBar as ChartBar;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            line.updateSize();
            bar.updateSize();
        }, 280); // 这里动画时长为 280 ms
    }

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
}
</script>
<style lang="scss">
$spacing: 20px;
$shadow: rgba(0, 0, 0, 0.1) 0px 2px 6px 0px;
@mixin shadowBox { box-shadow: $shadow; background-color: #fff; border-radius: 10px; }

.chart_home {
    .title { font-size: 18px; color: #999; margin-bottom: 20px; }
    .chart {
        width: 100%; padding-top: 20px;
        .item {
            @include shadowBox(); padding: 15px;
        }
        .chart_left {
            margin-right: $spacing; margin-bottom: $spacing; overflow: hidden;
            .line { width: 100% !important; height: 380px !important; }
            .bar { width: 100% !important; height: 380px !important; }
        }
        .chart_right {
            width: 300px; margin-bottom: $spacing;
            .ring { width: 300px !important; height: 300px !important; }
        }
    }
}
</style>