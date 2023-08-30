<template>
  <!-- 顶部导航栏 -->
  <div class="tabbar-container">
    <div class="tabbar-left">
      <div class="icon">
        <el-icon @click="chageIcon">
          <component :is="collapse ? 'Expand':'Fold'"></component>
        </el-icon>
      </div>
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" :to="{ path: item.path }" v-show="item.meta.title">
          <el-icon style="margin: 0 2px;"><component :is="item.meta.icon"></component></el-icon>
          <span>{{ item.meta.title }}</span>  
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar-right">
      <el-button icon="Refresh" circle @click="onRefresh" />
      <el-button icon="FullScreen" circle @click="fullScreen" />
      <!-- 设置 -->
      <el-popover
        placement="top-start"
        title="主题设置"
        :width="300"
        trigger="hover"
      >
        <el-form>
          <el-form-item label="主题颜色" class="form-item">
            <el-color-picker v-model="color" show-alpha :predefine="predefineColors" size="small" @change="setColor" />
          </el-form-item>
          <el-form-item label="暗黑模式" class="form-item">
            <el-switch v-model="dark" size="small" active-icon="MoonNight" inactive-icon="Sunny" inline-prompt @change="darkChange" />
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button icon="Setting" circle />
        </template>
      </el-popover>
      <img :src="userStore.avatar" />
      <el-dropdown class="logout">
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'


let data = reactive({
  color: 'rgba(255, 69, 0, 0.68)', // 主题颜色
  // 预定义颜色
  predefineColors: [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
  ],
  dark: false, // 是否开启暗黑模式
})

let { color,predefineColors,dark } = toRefs(data)


const props = defineProps(['collapse'])
const emits = defineEmits(['onCollapse'])
const $route = useRoute()
const $router = useRouter()

const layoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()


const chageIcon = () => {
  emits('onCollapse')
}


// 刷新
const onRefresh = () => {
  layoutSettingStore.updateRefresh()
}

// 全屏
const fullScreen = () => {
  let full = document.fullscreenElement
  if(!full) {
    // 进入全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}

// 主题颜色设置
const setColor = () => {
  // 获取html根节点
  let html = document.documentElement
  // 设置主题颜色
  html.style.setProperty('--el-color-primary',color.value)
}

// 暗黑模式切换
const darkChange = () => {
  // 获取html根节点
  let html = document.documentElement
  //let el = document.getElementsByTagName('body')[0]

  // 在 html 上添加一个名为 dark 的类 使用暗黑模式
  if(dark.value) {
    html.classList.add('dark')
    html.style.setProperty('--menu-bg','rgba(0,0,0,0.72)')
    html.style.setProperty('--tabbar-bg','rgba(0,0,0,0.72)')
    html.style.setProperty('--main-bg','rgba(0,0,0,0.72)')
  } else {
    html.classList.remove('dark')
    html.style.setProperty('--menu-bg','#001529')
    html.style.setProperty('--tabbar-bg','#f7d5d5')
    html.style.setProperty('--main-bg','#fff')
  }  
  
}

// 退出登录
const logout = () => {
  userStore.logout().then(res => {
    //$router.replace('/login')
    // 退出登录再登录是回到原页面，可需要携带数据
    $router.replace({ path: '/login', query: { redirect: $route.path } })
  })

}
</script>

<style scoped lang="scss">

  .tabbar-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    //background-image: linear-gradient(to right,#ebe9e9,#b8b7b7,#ebe9e9);
    box-shadow: 0px 2px 2px 0px rgba(0,0,0,.2);

    .tabbar-left {
      display: flex;
  
      .icon {
        padding: 0 10px;
      }
    }

    .tabbar-right {
      img {
        width: 32px;
        height: 32px;
        border: 1px solid #ccc;
        border-radius: 50%;
        margin-left: 12px;
        vertical-align: middle;
      }

      .logout {
        margin-left: 12px;
        vertical-align: middle;
      }
    }
  }

  ::v-deep.el-form {
    .form-item {
        .el-form-item__content {
          justify-content: flex-end;
        }
      }
  }
</style>