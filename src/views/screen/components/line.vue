<template>
  <div class="mtop20">
    <div class="top">
      <p class="title">未来7天游客数量趋势图</p>
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
    xAxis:{
      type: 'category',
      boundaryGap: false, // 两边留白区
      splitLine: {
        show: false, // 不显示分割线
      },
      data: ['周一','周二','周三','周四','周五','周六','周日'],
      // 轴线设置
      axisLine: {
        show: true
      },
      // 刻度设置
      axisTick: {
        show: true
      }
    },
    yAxis:{
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
        type: 'line',
        data: [120,740,260,676,332,988,1198],
        smooth: true, // 平滑曲线
        areaStyle: {
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
        }
      }
    ],
    grid: {
      left: 40,
      top: 30,
      right: 30,
      bottom: 40,
    }
  }
  // 设置配置项
  chart.setOption(option)
}
</script>

<style scoped lang="scss">
.line {
  background: url('../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  //margin-top: 10px;

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
    height: calc(100% - 40px);
    margin: 0 auto;
    text-align: center;
  }
} 
</style>