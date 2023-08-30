import * as echarts from 'echarts/core';
// 水球图拓展插件
import  'echarts-liquidfill'
import 'echarts/lib/component/grid'

import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
  TitleComponent,
  TitleComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
  GridComponent,
  GridComponentOption,
  GraphicComponent,
  GraphicComponentOption,
} from 'echarts/components';
import { 
  PieChart, 
  PieSeriesOption,
  MapChart,
  MapSeriesOption,
  BarChart,
  BarSeriesOption,
  LinesChart,
  LineSeriesOption,
  LineChart,
  ScatterChart,
  ScatterSeriesOption,
  RadarChart,
  RadarSeriesOption
} from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import china from '@/assets/data/china.json';
// 注册的组件
echarts.use([
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  TooltipComponent,
  MapChart,
  TitleComponent,
  VisualMapComponent,
  BarChart,
  GraphicComponent,
  LinesChart,
  GridComponent,
  LineChart,
  ScatterChart,
  RadarChart
]);

// 注册地图
echarts.registerMap('china',china as any)


// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
//type ECOption = echarts.ComposeOption<
//  | PieSeriesOption
//  | LegendComponentOption
//  | TooltipComponentOption
//  | MapSeriesOption
//  | TitleComponentOption
//  | VisualMapComponentOption
//  | liquidfillOption
//>;
type ECOption = echarts.EChartsCoreOption

type ECharts = echarts.ECharts

export { echarts }
export type { ECOption,ECharts }