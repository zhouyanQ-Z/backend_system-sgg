// 对外暴露自定义插件对象
import { App } from 'vue'
import SvgIcon from "./svg-icon/index.vue";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Pagination from '@/components/pagination/index.vue'
import UploadImage from '@/components/uploadImage/index.vue'
import UploadFile from '@/components/uploadFile/index.vue'


const allGloabalComponent:Record<string,any> = { SvgIcon,Pagination,UploadFile,UploadImage }
export default {
  install(app:App<Element>) {
    Object.keys(allGloabalComponent).forEach(key => {
      app.component(key,allGloabalComponent[key])
    })
    // 注册图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}