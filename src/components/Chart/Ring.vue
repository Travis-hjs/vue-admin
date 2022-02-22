<template>
    <div :class="className" :style="{'height': size, 'width': size}"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { ChartRingData } from "./types";
import { onElementResize } from "./hooks";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

/**
 * 圆环图表
 * [echart文档](https://echarts.apache.org/examples/zh/editor.html?c=pie-doughnut)
 */
@Component({
    name: "ChartRing"
})
export default class ChartRing extends Vue {
    /** 类名 */
    @Prop({ default: "" })
    className!: string;

    /** 尺寸：正方形 */
    @Prop({ default: "100%" })
    size!: string;

    /** 图表数据 */
    @Prop({ type: Array, required: true })
    chartData!: ChartRingData;

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
