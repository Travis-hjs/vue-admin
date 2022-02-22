<template>
    <div :class="className"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ChartLineData } from "./types";
import { onElementResize } from "./hooks";

echarts.use([GridComponent, LineChart, CanvasRenderer]);

/**
 * 折线图表
 * [echart文档](https://echarts.apache.org/examples/zh/editor.html?c=line-smooth)
 */
@Component({
    name: "ChartLine"
})
export default class ChartLine extends Vue {
    /** 类名 */
    @Prop({ default: "chart-line" })
    className!: string;

    /** 图表数据 */
    @Prop({ type: Object, required: true })
    chartData!: ChartLineData;
    
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
                type: "value",
                name: value.yAxisName,
                axisLabel: {
                    formatter: value.yAxisUnit ? `{value} ${value.yAxisUnit}` : undefined
                }
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
        
        onElementResize({
            el: el,
            vue: this,
            callback: this.updateSize,
            destroy: () => this.chart.dispose()
        });
    }

}
</script>
<style lang="scss">
.chart-line {
    width: 100%;
}
</style>