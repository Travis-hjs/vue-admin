/** 折线图表数据 */
export interface ChartLineData {
  /** x轴底部显示数据 */
  bottom: Array<string | number>
  /** y轴名称 */
  yAxisName?: string
  /** y轴数值单位 */
  yAxisUnit?: string
  /** 图表数据 */
  data: Array<{
    /** 标题 */
    title: string
    /** 显示值数据（长度与`bottom`一致） */
    value: Array<number>
    /** 当前线条颜色 */
    color: string
  }>
}

/** 柱状图表数据 */
export type ChartBarData = ChartLineData;

/** 圆环图表数据 */
export type ChartRingData = Array<{
  color: string
  /** 显示值数据 */
  value: number
  /** 对应的名称 */
  name: string | number
}>
