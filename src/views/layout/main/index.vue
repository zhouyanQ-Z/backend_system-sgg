<template>
  <!-- 路由组件出口位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染一级路由组件 注意：这里需加一个根节点div，否则出现警告-->
      <div>
        <component :is="Component" v-if="flag"></component>
      </div>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
  import { watch,ref,nextTick } from 'vue'
  import useLayoutSettingStore from '@/store/modules/setting'


  let flag = ref(true) // 控制组价刷新
  const layoutSettingStore = useLayoutSettingStore()

  // 监听refresh是否变化，若变化，则刷新组件
  watch(() => layoutSettingStore.refresh,() => {
    // 销毁路由
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  })
</script>

<style scoped lang="scss">
  .fade-enter-from {
    opacity: 0;
    transform: scale(0);
  }
  .fade-enter-active {
    transition: all 1s;
  }
  .fade-enter-to {
    opacity: 1;
    transform: scale(1);
  }
</style>