// 进行axios二次封装：使用请求和响应拦截器
import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from '@/store/modules/user'
import { msgError } from './modal'


let request = axios.create({
  // 基础路径
  baseURL:  import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use((config) => {
  let userStore = useUserStore()
  if(userStore.token) config.headers.token = userStore.token
  return config
})

// 响应拦截器
request.interceptors.response.use((response) => {
  //if(response.data.code == 200) msgSuccess(response.data.message)
  return response.data
},(error) => {
  // 失败回调
  let message = '';
  
  let status = error.response.status
  switch(status) {
    case 401 :
      message = 'TOKEN过期'
      break;
    case 403 :
      message = '无权访问'
      break;
    case 404 :
      message = '请求地址错误'
      break;
    case 500 :
      message = '服务器内部错误'
      break;
    default:
      message = '网络出现问题'
      break;
  }
  msgError(message)
  return Promise.reject(error)
})

export default request