<template>
  <div class="error">
    <img src="../../assets/images/error_images/404.png" alt="">
    <el-button type="primary" @click="goHme" class="mtop-20">首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const $router = useRouter()

// 前往首页
const goHme = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.error {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 800px;
    height: 400px;
  }
}
</style>