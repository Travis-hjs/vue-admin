<template>
    <div :class="className"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ChartBarData } from "./types";

echarts.use([GridComponent, BarChart, CanvasRenderer]);

/**
 * 柱状图图表
 * [echart文档](https://echarts.apache.org/examples/zh/editor.html?c=mix-line-bar)
 */
@Component({
    name: "ChartBar"
})
export default class ChartBar extends Vue {
    /** 类名 */
    @Prop({ default: "chart-bar" })
    className!: string;

    /** 图表数据 */
    @Prop({ type: Object, required: true })
    chartData!: ChartBarData;
    
    /** 当前图表实例 */
    chart!: echarts.ECharts;

    @Watch("chartData", { deep: true })
    onChartDataChange(value: ChartBarData) {
        this.setData(value);
    }

    setData(value: ChartBarData) {
        const series = value.data.map(item => {
            return {
                color: item.color,
                name: item.title,
                data: item.value,
                type: "bar"
            }
        })
        this.chart.setOption({
            legend: {
                data: value.data.map(item => item.title),
                top: "0%",
                right: "10%"
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    // crossStyle: {
                    //     color: "#999"
                    // }
                }
            },
            xAxis: {
                type: "category",
                data: value.bottom,
                axisPointer: {
                    type: "shadow"
                }
            },
            yAxis: {
                type: "value",
                name: value.yAxisName,
                axisLabel: {
                    formatter: value.yAxisUnit ? `{value} ${value.yAxisUnit}` : undefined
                }
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
.chart-bar {
    width: 100%;
}
</style>