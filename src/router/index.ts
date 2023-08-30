// 路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import nprogress from 'nprogress'
import { constRoute}  from './routes'
import useUserStore from '@/store/modules/user'
import { msgbox } from '@/utils/modal'
import setting from '@/setting'


nprogress.configure({showSpinner: false}) // 取消加载小球效果
//创建路由
const router =  createRouter({
  history:createWebHashHistory(),
  routes: constRoute,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
})

// 路由鉴权

// 全局前置守卫
router.beforeEach((to,from,next) => {
  nprogress.start()
  // 注意：useUserStore()必须放在路由守卫中，否则，持久化无效
  let userStore = useUserStore()
  
  if( userStore.token ) { // 已登录
    if( to.path == '/login') next(false)
    else {
      if(userStore.username) next()
      else {
        userStore.getUserInfo().then(res => { // 获取用户信息
          // 解决异步路由加载出现空白问题
          next({...to}) // 保证加载完之后再放行
        }).catch(err => {
          // token过期或被手动修改
          // 先退出登录
          msgbox('token已失效，请重新登录！').then(res => {
            if(res === 'confirm') {
              userStore.logout().then(res => {
                next({ path : '/login', query: { redirect: to.path } })                
              })
            }
          })
        })
      }
    }
  } else { // 未登录
    if(to.path === '/login') next()
    else next({ path : '/login', query: { redirect: to.path } })
  }
})


// 全局后置守卫
router.afterEach((to,from) => {
  nprogress.done()
  document.title = setting.title +'-'+ to.meta.title
})

export default router