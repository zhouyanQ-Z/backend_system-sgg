// 品牌管理模块API
import request from "@/utils/request";
import { PromiseRes } from '@/api/type'
import { BaseTrademark,BaseTrademarkData,Trademark } from './type'

enum API {
  // 已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改品牌
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除品牌
  DEL_TRADEMARK_URL = '/admin/product/baseTrademark/remove/',

}

// 添加
export const reqBaseTrademark = (data:BaseTrademark):PromiseRes<BaseTrademarkData> => request.get(API.TRADEMARK_URL+`${data.page}/${data.limit}`)
export const reqAddOrUpdateBaseTrademark = (data:Trademark):PromiseRes<null> => {
  if(data.id) { // 修改
    return request.put(API.UPDATE_TRADEMARK_URL,data)
  } else {
    // 新增
    return request.post(API.ADD_TRADEMARK_URL,data)
  }
}
// 删除
export const reqDelBaseTrademark = (data:number):PromiseRes<null> => request.delete(API.DEL_TRADEMARK_URL+data)
