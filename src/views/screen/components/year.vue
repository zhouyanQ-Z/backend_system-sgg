<template>
  <div>
    <div class="top">
      <p class="title">年度游客量对比</p>
      <p class="icon"></p>
    </div>
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
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: ['2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022'],
      // 轴线设置
      axisLine: {
        show: true
      },
      // 刻度设置
      axisTick: {
        show: true
      },
      axisLabel: {
        interval: 0,// 强制显示所有标签
        rotate:30,//x轴文字倾斜角度
      }
    },
    yAxis: {
      splitLine: {
        show: false, // 不显示分割线
      },
      // 轴线设置
      axisLine: {
        show: true
      },
      // 刻度设置
      axisTick: {
        show: true
      }
    },
    series: [
      {
        type: 'scatter',
        data: [23,54,29,16,48,71,59,88,37,96,64],
        //symbol: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
        symbol: 'pin',
        symbolSize: 30,
        // 标签
        label: {
          show: true,
          fontSize: 10,
          color: '#fff'
        },
        itemStyle: {
          color: 'rgb(145,204,117)'
        },
        // 高亮
        emphasis:{
          label: {
            show: true,
            fontSize: 24,
            color: '#fff'
          },
          scale: 1.6
        },
      }
    ]
  }
  // 设置配置项
  chart.setOption(option)
}
</script>

<style scoped lang="scss">
.year {
  background: url('../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    font-size: 20px;
    margin-left: 10px;
    .icon {
      width: 68px;
      height: 7px;
      background: url('../images/dataScreen-title.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 5px;
    }
  }
  .charts {
    width: 100%;
    height: 270px;
    margin: 0 auto;
    text-align: center;
  }
} 
</style>