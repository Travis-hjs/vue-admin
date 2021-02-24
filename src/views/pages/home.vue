<template>
    <div class="home">
        <HelloWorld msg="首页" />
        <div class="chart flex">
            <div class="item chart_line f1">
                <div class="title">一周业务数据</div>
                <ChartLine ref="ChartLine" className="line" :chartData="chartLineData" />
            </div>
            <div class="item chart_ring">
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
import HelloWorld from "../../components/HelloWorld.vue";
import ChartRing from "../../components/ChartRing.vue";
import ChartLine from "../../components/ChartLine.vue";
import store from "../../store";
import { ChartLineData, ChartRingData } from "../../utils/interfaces";

@Component({
    components: {
        HelloWorld,
        ChartRing,
        ChartLine
    }
})
export default class Home extends Vue {
    readonly layoutState = store.layoutState;

    private timer!: NodeJS.Timeout;

    @Watch("layoutState.sidebarOpen")
    onSidebarOpenChange() {
        const component = this.$refs.ChartLine as ChartLine;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            component.updateSize();
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
.home {
    .title { font-size: 18px; color: #999; margin-bottom: 20px; }
    .chart {
        width: 100%; padding-top: 20px;
        .item {
            @include shadowBox(); padding: 15px;
        }
        .chart_line {
            margin-right: $spacing; margin-bottom: $spacing;
            .line { width: 100% !important; height: 380px !important; }
        }
        .chart_ring {
            width: 300px; margin-bottom: $spacing;
            .ring { width: 300px !important; height: 300px !important; }
        }
    }
}
</style>