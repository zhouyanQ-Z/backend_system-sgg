// 封装一般方法
import {FormInstance} from 'element-plus';

// 获取时间
export const getTime = () => {
  let message = ''
  let hours = new Date().getHours()
  if(hours <= 9) message = '早上'
  else if(hours <= 12) message = '上午'
  else if(hours <= 18) message = '下午'
  else message = '晚上'
  return message
}

// 表单重置
export function resetForm(refName:FormInstance | undefined) {
  if (refName) {
    refName.resetFields()    
  }
}

// 深拷贝
export function deepClone(obj:any) {
  //判断obj是数组还是对象.
  let objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是"object"
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}