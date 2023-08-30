<template>
  <div>
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="icon"></p>
      <p class="total">可预约总量 <span>999999999</span>人</p>
    </div>
    <div class="people">
      <span v-for="(item,index) in people" :key="index">{{ item }}</span>
    </div>
    <div ref="chartsRef" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref, toRefs } from 'vue';
import type { ECOption, ECharts } from '@/utils/echarts'



const echarts = inject<any>('echarts')

// 获取节点
const chartsRef = ref()
let chart: ECharts;

const data = reactive({
  people: '215980人',
})

let { people } = toRefs(data)

onMounted(() => {
  chartInit()
})


const chartInit = () => {
  // 初始化图表
  if(!chart) chart = echarts.init(chartsRef.value)
  const option:ECOption = {
    // 标题
    title: {
      text: '水球图'
    },
    // 系列：展示图形
    series: [{
      type: 'liquidFill', //类型
      waveAnimation: true,// 动画
      animationDuration: 0,
      animationDurationUpdate: 0,
      data: [0.6, 0.5, 0.4, 0.3],
      radius: '95%', //半径
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'none',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
    }],
    // 布局
    grid: {}
  }
  // 设置配置项
  chart.setOption(option)
}
</script>

<style scoped lang="scss">
.tourist {
  background: url('../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    font-size: 20px;
    margin-left: 10px;
  }

  .icon {
    width: 68px;
    height: 7px;
    background: url('../images/dataScreen-title.png') no-repeat;
    background-size: 100% 100%;
    margin-top: 5px;
  }
  .total {
    float: right;
    font-size: 20px;
    span {
      color: yellowgreen;
    }
  }

  .people {
    margin-top: 40px;
    display: flex;

    span {
      flex: 1;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: url('../images/total.png') no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 30px;
    }
  }
  .charts {
    height: 270px;
    margin-top: 20px;
  }
}
</style>