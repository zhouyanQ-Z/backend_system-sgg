<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout-slider">
      <Logo></Logo>
      <!-- 滚动组件 -->
      <el-scrollbar class="menu-scroll">
        <!-- 菜单组件 -->
        <el-menu class="menu-box" background-color="#001529" text-color="#fff" :default-active="$route.path" router unique-opened :collapse="isCollapse" :collapse-transition="false">
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout-tabbar" :class="{ fold: isCollapse ? true : false }">
      <Tabbar :collapse="isCollapse" @onCollapse="handleCollapse"></Tabbar>
    </div>
    <!-- 内容展示区 -->
    <div class="layout-main" :class="{ fold: isCollapse ? true : false }" ref="mainRef">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, reactive,ref,toRefs, watch } from 'vue';
  import { useRoute } from 'vue-router'
  import Logo from "./logo/index.vue";
  import Menu from "./menu/index.vue";
  import Main from "./main/index.vue";
  import Tabbar from "./tabbar/index.vue";
  import useUserStore  from '@/store/modules/user'
  import useLayoutSettingStore from '@/store/modules/setting'
  

  const mainRef = ref()

  let data = reactive({
    isCollapse: false
  })
  const userStore = useUserStore()
  const layoutSettingStore = useLayoutSettingStore()

  let $route = useRoute()

  let { isCollapse } = toRefs(data)

  
  const handleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  
  // 监听scroll是否变化，若变化，则滚动组件
  watch(() => layoutSettingStore.scroll,() => {
    if(layoutSettingStore.scroll) {
      nextTick(() => {
        mainRef.value.scrollTo(({ top: 0, behavior: 'smooth' }))
        layoutSettingStore.updateScroll()
      })
    }
  })
</script>

<style scoped lang="scss">
  .layout-container {
    width: 100%;
    height: 100%;

    .layout-slider {
      width: $base-menu-width;
      background-color: $base-menu-background;
      height: 100%;
      color: white;

      .menu-scroll {
        width: 100%;
        height: calc(100vh - $base-logo-height);

        .menu-box {
          border-right: none;
        }
      }
    }

    .layout-tabbar {
      position: fixed;
      width: calc(100% - $base-menu-width);
      height: $base-tabbar-height;
      top: 0;
      left: $base-menu-width;
      transition: all .3s;
      &.fold {
        width: calc(100% - $base-menu-min-width);
        left: $base-menu-min-width;
      }
      z-index: 999;
      background: $base-tabbar-background;
    }

    .layout-main {
      position: absolute;
      width: calc(100% - $base-menu-width);
      height: calc(100vh - $base-tabbar-height);
      left: $base-menu-width;
      top: $base-tabbar-height;
      padding: 20px;
      overflow: auto;
      transition: all .3s;
      background: $base-main-background;
      z-index: 999;
      &.fold {
        width: calc(100% - $base-menu-min-width);
        left: $base-menu-min-width;
      }
    }
  }
</style>