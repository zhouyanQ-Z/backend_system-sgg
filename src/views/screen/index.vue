<template>
  <div class="container">
    <!-- 数据大屏展示内容区 -->
    <div class="screen-main" ref="screemRef">
      <!-- 顶部 -->
      <Top />
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Gender  class="gender" />
          <Age  class="age" />
        </div>
        <div class="center">
          <MapC class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Counter class="counter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Top from './components/top.vue'
import Tourist from './components/tourist.vue'
import Gender from './components/gender.vue'
import Age from './components/age.vue'
import MapC from './components/map.vue'
import Line from './components/line.vue'
import Rank from './components/rank.vue'
import Year from './components/year.vue'
import Counter from './components/counter.vue'

// 数据大屏内容展示区DOM
const screemRef = ref()

onMounted(() => {
  screemRef.value.style.transform =  `scale(${getScale()}) translate(-50%,-50%)`
})

// 定义大屏缩放比例
const getScale = (w=1920,h=1080) => {
  let ww = window.innerWidth/w;
  let wh = window.innerHeight/h;
  return ww < wh ? ww:wh
}

// 监听视口变化
window.onresize = () => {
  screemRef.value.style.transform =  `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">

.container {
  width: 100vw;
  height: 100vh;
  background: url('./images/bg.png') no-repeat;
  background-size: cover;

  .screen-main {
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      height: 1040px;
      color: #fff;
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.5;
        }
        .gender {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        margin: 0 20px;
        .map {
          flex: 3;
        }
        .line {
          flex: 1;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        .rank {
          flex: 1.5;
        }
        .year {
          flex: 1;
        }
        .counter {
          flex: 1;
        }
      }
    }
  }
}

</style>