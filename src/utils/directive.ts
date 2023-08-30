import useUserStore from '@/store/modules/user'

export const isHasButton = (app:any) => {
  let userStore = useUserStore()  
  // 全局自定义指令
  app.directive('has',{
    mounted(el:any,options:any) {
      if(!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    }
  })
}