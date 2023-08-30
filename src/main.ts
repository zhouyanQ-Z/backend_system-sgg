import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入element-plus样式
import 'element-plus/dist/index.css'
// 使用element-plus暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入nprogress样式
import 'nprogress/nprogress.css'
// 引入全局样式
import './styles/index.scss'
// svg 配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件
import globalComponent from '@/components'
import router from './router'
import store from './store'
import { echarts } from '@/utils/echarts'
import { isHasButton } from '@/utils/directive'

const app = createApp(App)

app.use(ElementPlus,{
  locale:zhCn
})
app.use(globalComponent)
app.use(router)
app.use(store)
// echarts
app.provide('echarts',echarts)
isHasButton(app)
app.mount('#app')


//通过import.meta.env获取环境变量
