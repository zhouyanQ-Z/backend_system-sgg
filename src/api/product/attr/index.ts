// 属性管理模块API
import request from "@/utils/request";
import { PromiseRes } from '@/api/type'
import { categoryRes,attrRes } from './type'

enum API {
  // 一级分类接口
  C1_URL = '/admin/product/getCategory1',
  // 二级分类接口
  C2_URL = '/admin/product/getCategory2/',
  // 三级分类接口
  C3_URL = '/admin/product/getCategory3/',
  // 获取属性数据接口
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加或修改属性接口
  ADD_UPDATE_ATTR_URL = '/admin/product/saveAttrInfo',
  // 删除属性接口
  DEL_ATTR_URL = '/admin/product/deleteAttr/',

}
// 获取一级分类数据接口
export const reqC1 = ():PromiseRes<categoryRes[]> => request.get(API.C1_URL)
// 获取二级分类数据接口
export const reqC2 = (id: number|string):PromiseRes<categoryRes[]> => request.get(API.C2_URL+id)
// 获取三级分类数据接口
export const reqC3 = (id: number|string):PromiseRes<categoryRes[]> => request.get(API.C3_URL+id)
// 获取属性数据接口
export const reqAttrList = (id1: number|string,id2: number|string,id3: number|string):PromiseRes<attrRes[]> => request.get(API.ATTR_URL+`${id1}/${id2}/${id3}`)
// 新增或修改已有属性的接口
export const reqAddOrUpdateAttr = (data:attrRes):PromiseRes<string> => request.post(API.ADD_UPDATE_ATTR_URL,data)
// 删除属性的接口
export const reqDelAttr = (id:number):PromiseRes<string> => request.delete(API.DEL_ATTR_URL+id)