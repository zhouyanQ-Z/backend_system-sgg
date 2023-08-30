// 用户相关小仓库
import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import { reqLogin,reqUserInfo,reqLogout } from '@/api/user'
import { LoginForm } from '@/api/user/type'
import { constRoute, asyncRoute,anyRoute} from '@/router/routes'
//import type { UserState } from "./types"
//import type { RouteRecordRaw } from "vue-router"
import { getItem,removeItem } from '@/utils/cache'
import router from '@/router'


// 过滤异步路由
const filterAsyncRoute = (asyncRoute: any,routes: any) => {
  return asyncRoute.filter((item:any) => {
    if(routes.includes(item.name)) {
      if(item.children && item.children.length) {
        item.children = filterAsyncRoute(item.children,routes)
      }
      return true
    }
  })
}

// 处理路由
const handleRoute = (routes:any) => {
    let newMenu: any[] = []
    routes.forEach((item:any) => {
      if(!item.meta?.hidde) {
        if(item.children && item.children.length == 1) {
          newMenu.push(...item.children)
        } else newMenu.push(item)
      }
    })
    return newMenu
}

export default defineStore('User', {
  state: () => {
    return {
      token: getItem('SGG_TOKEN'),
      username: '',
      avatar: '',
      menuRoutes: [] as any[],
      buttons: [] as string[],// 保存按钮权限
    }
  },
  actions: {
    // 用户登录
    userLogin(data:LoginForm) {
      return reqLogin(data).then(res => {
        if(res.code == 200) {
          this.token = res.data
          return 'ok'
        } else {          
          return Promise.reject(new Error(res.data))
        }
      })
    },
    // 获取用户信息
    getUserInfo() {
      return reqUserInfo().then(res => {
        if(res.code == 200) {
          this.username = res.data.name
          this.avatar = res.data.avatar
          this.buttons = res.data.buttons
          // 过滤异步路由 深拷贝解决asyncRoute被修改的问题
          let newAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute),res.data.routes)
          this.menuRoutes = handleRoute([...constRoute,...newAsyncRoute,...anyRoute]);
          // 注意此时得到的menuRoutes里面只有constRoute注册了，新得到的路由menuRoutes里面的异步路由和anyRoute并没有注册
          [...newAsyncRoute,...anyRoute].forEach((route:any) => {
            // 注册路由
            router.addRoute(route)
          })
          return 'ok'
        } else {          
          return Promise.reject(new Error(res.message))
        }
      })
    },
    // 退出登录
    logout() {
      return reqLogout().then(res => {
        if(res.code === 200) {
          this.token = ''
          this.username = ''
          this.avatar = ''
          removeItem('SGG_TOKEN')
          return 'ok'
        } else {
          return Promise.reject(new Error(res.message))
        }
      })
    }
  },
  //getters: {
  //  filterRoutes() {
  //    return handleRoute(constRoute)
  //  }
  //},
  persist:[
    {
      paths: ['token'],
      key: 'SGG_TOKEN',
      storage: localStorage
    }
  ]
})