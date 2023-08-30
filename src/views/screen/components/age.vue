<template>
  <div>
    <div class="top">
      <p class="title">年龄比例</p>
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
    legend: {
      right: 10,
      top: 40,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 14
      }
    },
    graphic: {
      type: "text",
      left: "center",
      top: "middle",
      style: {
        text: "资产总数",
        fill: "#fff",
        fontSize: 16,
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: '#fff'
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union' },
          { value: 300, name: 'Video' }
        ]
      }
    ]
  }
  // 设置配置项
  chart.setOption(option)
}
</script>

<style scoped lang="scss">
.age {
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