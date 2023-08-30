<template>
  <div class="logo" v-if="setting.logoShow">
    <img :src="setting.logo"  alt=""/>
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
  import setting from "@/setting";
</script>

<style scoped lang="scss">
  .logo {
    width: 100%;
    height: $base-logo-height;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;

    img {
      width: 40px;
      height: 40px;
    }
    p {
      font-size: $base-logo-fontSize;
    }
  }
</style>