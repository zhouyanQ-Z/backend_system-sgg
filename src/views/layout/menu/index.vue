<template>
  <template v-for="(item,index) in menuList" :key="index">
    <template v-if="!item.meta.hidden">
      <el-menu-item :index="item.path" v-if="!item.children">
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
      <el-sub-menu :index="item.path" v-else>
        <template #title>
          <el-icon><component :is="item.meta.icon"></component></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts">
//import { onMounted } from 'vue';

  
  let props = defineProps(['menuList'])

</script>
<script lang="ts">
  export default {
    name: 'Menu'
  }
</script>
<style scoped lang="scss">
</style>