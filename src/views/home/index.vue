<template>
  <el-card>
    <div class="home-box">
      <img :src="userStore.avatar" alt="" class="avator-img"/>
      <div class="info">
        <h3 class="title"> {{ getTime() }}好呀！{{ userStore.username }}</h3>
        <p class="subtitle">硅谷甄选运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottom mtop20">
    <svg-icon  name="welcome" width="500px"  height="350px"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useUserStore from "@/store/modules/user";
import { getTime } from "@/utils/common";


// 用户相关仓库
const userStore = useUserStore();
</script>

<style scoped lang="scss">

    .home-box {
      display: flex;

      .avator-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
      
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 10px;
        .title {
          font-size: 30px;
          font-weight: bold;
        }
        .subtitle {
          font-size: 16px;
          color: #ccc;
          font-style: italic;
        }
      }
    }
  
    .bottom {
      text-align: center;
    }
  
</style>