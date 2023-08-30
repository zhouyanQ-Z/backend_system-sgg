<template>
  <div>
    <div class="top">
      <p class="title">男女比例</p>
      <p class="icon"></p>
    </div>
    <div class="center mtop-20">
      <div class="man">
        <span class="title">男士</span>
        <img src="../images/man.png" alt="">
      </div>
      <div class="women">
        <span class="title" >女士</span>
        <img src="../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p class="man">男士58%</p>
      <p class="women">女士42%</p>
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
    // 标题
    title: {
      //text: '男女比例',
      textStyle: {
        color: 'yellow'
      },
      left: '40%'
    },
    // x|y轴
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      type: 'category',
      show: false
    },
    // 系列：展示图形
    series: [
      {
        type: 'bar',
        data: [58],
        itemStyle: {
          color: 'blue',
          borderRadius: 20
        },
        barWidth: 25,
        // 层级
        z: 100
      },
      {
        type: 'bar',
        data: [100],
        itemStyle: {
          color: 'pink',
          borderRadius: 20
        },
        barWidth: 25,
        // 调整位置
        barGap: '-100%'
      }
    ],
    // 布局
    grid: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    }
  }
  // 设置配置项
  chart.setOption(option)
}

</script>

<style scoped lang="scss">
.gender {
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
  .center {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    .man,.women {
      width: 111px;
      height: 115px;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px;
      position: relative;
      .title {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .man {
      background: url('../images/man-bg.png') no-repeat;
    }
    .women {
      background: url('../images/woman-bg.png') no-repeat;
    }
  }
  .rate {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .charts {
    width: 80%;
    height: 45px;
    margin: 0 auto;
  }
} 
</style>