<template>
    <div :class="className" :style="{'height': width, 'width': width}"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ChartRingData } from "@/types";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

/**
 * 圆环图表
 * [echart文档](https://echarts.apache.org/examples/zh/editor.html?c=pie-doughnut)
 */
@Component({})
export default class ChartRing extends Vue {
    @Prop({ default: "chart_ring" }) className!: string;
    @Prop({ default: "100%" }) width!: string;
    @Prop({ type: Array, required: true }) chartData!: ChartRingData;

    /** 当前图表实例 */
    chart!: echarts.ECharts;

    @Watch("chartData", { deep: true })
    onChartDataChange(value: ChartRingData) {
        this.setData(value);
    }

    setData(value: ChartRingData) {
        const data = value.map(item => {
            return {
                value: item.value,
                name: item.name
            }
        })
        this.chart.setOption({
            tooltip: {
                trigger: "item"
            },
            legend: {
                top: "0%",
                left: "center"
            },
            color: value.map(item => item.color),
            series: [
                {
                    // name: "嘻嘻嘻",
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: "center"
                    },
                    labelLine: {
                        show: false
                    },
                    data
                }
            ]
        });
    }

    mounted() {
        this.chart = echarts.init(this.$el as HTMLElement);
        if (this.chartData) {
            this.setData(this.chartData);
        }
    }

    beforeDestroy() {
        this.chart.dispose();
    }
    
}
</script>
<style lang="scss">
.chart_ring {
    width: 100%;
}
</style>