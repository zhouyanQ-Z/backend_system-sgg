<template>
  <div>
    <div ref="chartsRef" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { ECOption, ECharts } from '@/utils/echarts'

// 获取节点
const chartsRef = ref()
let chart: ECharts;

const echarts = inject<any>('echarts')

onMounted(() => {
  chartInit()
})


const chartInit = () => {
  // 初始化图表
  if(!chart) chart = echarts.init(chartsRef.value)
  const option:ECOption = {
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontSize: 30,
        color: 'red'
      }
    },
    geo: {
      map: 'china',
      roam: true,//鼠标缩放
      left: 30,
      right: 30,
      label: {
        show: true, // 地图文字显示
        fontSize: 14,
        color: '#fff'
      },
      itemStyle: {
        //areaColor: "#f2d5ad",
        borderColor: "cyan",
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0, color: 'red' // 0% 处的颜色
          }, {
              offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        },
        opacity: .8
      },
      // 高亮
      emphasis:{
        label: {
          show: true,
          fontSize: 24,
          color: '#fff'
        }
      },
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              // 维度X   维度Y
              [84.9023, 41.748],// 起点
              [121.4648, 31.2891],// 终点
            ]
          },
          {
            coords: [
              // 维度X   维度Y
              [121.4648, 31.2891],// 起点
              [84.9023, 41.748],// 终点
            ]
          },
          {
            coords: [
              // 维度X   维度Y
              [118.7402, 36.4307],// 起点
              [84.9023, 41.748],// 终点
            ]
          }
        ],
        lineStyle: {
          color: 'white',
          width: 2
        },
        //线特效的配置
        effect: {
          show: true,
          symbol: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
          symbolSize: 20,
          trailLength: 0.1,
          roundTrip: true, //按原路返回
        }
      }
    ],
  }
  // 设置配置项
  chart.setOption(option)
}
</script>

<style scoped lang="scss">
.map {
  margin-top: 50px;
  .charts {
    width: 100%;
    height: calc(100% - 20px);
    margin: 0 auto;
    text-align: center;
  }
} 
</style>