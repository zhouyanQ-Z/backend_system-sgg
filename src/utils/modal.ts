import { ElMessageBox, ElNotification,ElMessage } from 'element-plus';

// 成功通知
export const notifySuccess = (message:string,title:string) => {
  ElNotification.success({message,title})
}
// 失败通知
export const notifyError = (message:string) => {
  ElNotification.error(message)
}
// 消息提示
export const msgbox = (message:string) => {
  return ElMessageBox({
    title: 'Warning',
    message,
    type: 'warning',
    center: true
  })
}
// 成功消息提示
export const msgSuccess = (message:string) => {
  ElMessage.success(message)
}
// 错误消息提示
export const msgError = (message:string) => {
  ElMessage.error(message)
}