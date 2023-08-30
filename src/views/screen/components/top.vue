<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHme">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大屏</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';


defineEmits(['toHome'])
const $router = useRouter()

const data = reactive<{
  currentTime: string,
  timer: NodeJS.Timer | number
}>({
  currentTime: '',
  timer: 0
  
})

let { currentTime,timer } = toRefs(data)


onMounted(() => {
  timer.value = setInterval(() => {
    getTime()
  },1000)
})

// 前往首页
const goHme = () => {
  $router.push('/home')
}

// 获取当前时间
const getTime = () => {
  let date = new Date(),
      year = date.getFullYear(), //获取完整的年份(4位)
      month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
      day = date.getDate(), // 获取当前日(1-31)
      hour = date.getHours(), // 时
      minutes = date.getMinutes(), //分
      seconds = date.getSeconds(); //秒
  let h: number|string = hour
  let m: number|string = minutes
  let s: number|string = seconds
  if(hour < 10) h = '0' + hour
  if(minutes < 10) m = '0' + minutes
  if(seconds < 10) s = '0' + seconds
  currentTime.value = `${year}年${month}月${day}日 ${h}:${m}:${s}`
}

onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = 0
})
</script>

<style scoped lang="scss">
.top {
  display: flex;
  color: #29fcff;
  .left{
    flex: 1.5;
    background: url('../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: 100% 100%;
    .lbtn {
      width: 150px;
      height: 100%;
      float: right;
      background: url('../images/dataScreen-header-btn-bg-l.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      &:hover {
        cursor: default
      }
    }
  }
  .center{
    flex: 2;
    .title {
      width: 100%;
      height: 75px;
      background: url('../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 75px;
      font-size: 36px;
    }
  }
  .right{
    flex: 1.5;
    background: url('../images/dataScreen-header-right-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      width: 150px;
      height: 100%;
      background: url('../images/dataScreen-header-btn-bg-r.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
    }
    .time {
      margin-right: 20px;
      font-size: 20px;
    }
  }
}
</style>