<template>
  <div>
    <div class="top">
      <p class="title">热门景区排行榜</p>
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
      type: 'category', // 图形图标再x轴上均匀分布
      data: ['AA','BB','CC','DD','EE','FF'],
      axisLabel: {
        color: 'red'
      }
    },
    yAxis: {},
    grid: {
      left: 20,
      bottom: 20,
      right: 20,
      top: 50,
    },
    series: [
      {
        type: 'bar',
        data: [34,29,76,26,45,53],
        label: {
          show: true,
          position: 'insideTop',
          color: 'white'
        },
        // 是否显示背景颜色
        //showBackground: true,
        //backgroundStyle: {
        //  color: '#ccc'
        //}
        // 柱条样式
        itemStyle: {
          borderRadius: [15,15,0,0],
          color: function(data: any) {
            // 定义每个柱条颜色
            let colors = ['rgb(84,112,198)','rgb(145,204,117)','rgb(250,200,88)','rgb(222,91,82)','rgb(238,70,203)','rgb(236,227,41)']
            return colors[data.dataIndex]
          },
          opacity: .6
        }
      },
      {
        type: 'line',
        data: [34,29,76,26,45,53],
        smooth: true, // 平滑曲线
        lineStyle: {
          color: 'blue'
        }
      }
    ]
  }
  // 设置配置项
  chart.setOption(option)
}
</script>

<style scoped lang="scss">
.rank {
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
    height: calc(100% - 30px);
    margin: 0 auto;
    text-align: center;
  }
} 
</style>