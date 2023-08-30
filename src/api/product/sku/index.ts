// sku管理模块接口文件
import request from '@/utils/request'
import { PromiseRes } from '@/api/type'
import { skuData } from './type'
import type { skuInf } from '@/api/product/spu/type';


enum API {
  // 获取SKU
  SKU_URL = '/admin/product/list/',
  // 商品上架
  ONSALE_URL = '/admin/product/onSale/',
  // 商品下架
  CACLESALE_URL = '/admin/product/cancelSale/',
  // 商品详情
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除商品
  DELETESKU_URL = '/admin/product/deleteSku/',

}

// 获取SKU
export const reqSkuList = (page: number,limit: number):PromiseRes<skuData> => request.get(API.SKU_URL+`${page}/${limit}`)
// 商品上架
export const reqOnSale = (skuId: number):PromiseRes<string> => request.get(API.ONSALE_URL+skuId)
// 商品下架
export const reqCancelSale = (skuId: number):PromiseRes<string> => request.get(API.CACLESALE_URL+skuId)
// 商品详情
export const reqSkuInfo = (skuId: number):PromiseRes<skuInf> => request.get(API.SKUINFO_URL+skuId)
// 删除商品
export const reqDelSku = (skuId: number):PromiseRes<string> => request.delete(API.DELETESKU_URL+skuId)
