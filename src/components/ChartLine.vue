<template>
    <div :class="className"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ChartLineData } from "../utils/interfaces";

echarts.use([GridComponent, LineChart, CanvasRenderer]);

/**
 * [折线图表](https://echarts.apache.org/examples/zh/editor.html?c=line-smooth)
 */
@Component({})
export default class ChartLine extends Vue {
    @Prop({ default: "chart_line" }) className!: string;
    @Prop({ type: Object, required: true }) chartData!: ChartLineData;
    
    /** 当前图表实例 */
    chart!: echarts.ECharts;

    @Watch("chartData", { deep: true })
    onChartDataChange(value: ChartLineData) {
        this.setData(value);
    }

    setData(value: ChartLineData) {
        const series = value.data.map(item => {
            return {
                name: item.title,
                itemStyle: {
                    color: item.color,
                    lineStyle: {
                        color: item.color,
                        width: 2
                    }
                },
                data: item.value,
                type: "line",
                smooth: true
            }
        })
        this.chart.setOption({
            xAxis: {
                type: "category",
                data: value.bottom
            },
            yAxis: {
                type: "value"
            },
            legend: {
                data: value.data.map(item => item.title),
                top: "0%",
                right: "10%"
            },
            tooltip : {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    // label: {
                    //     backgroundColor: "#6a7985"
                    // }
                },
                // padding: 8
            },
            series
        });
    }

    /** 
     * 更新尺寸
     * @description 也可以暴露给父组件调用
     */
    updateSize() {
        this.chart.resize();
    }

    mounted() {
        const el = this.$el as HTMLElement;
        this.chart = echarts.init(el);
        if (this.chartData) {
            this.setData(this.chartData);
        }
        window.addEventListener("resize", this.updateSize);
    }

    beforeDestroy() {
        window.removeEventListener("resize", this.updateSize);
        this.chart.dispose();
    }
}
</script>
<style lang="scss">
.chart_line {
    width: 100%;
}
</style>