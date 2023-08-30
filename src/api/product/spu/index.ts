// spu管理模块接口文件
import request from '@/utils/request'
import { PromiseRes } from '@/api/type'
import { Trademark } from '@/api/product/trademark/type'
import { spuData,spuImage,spuSaleAttr,saleAttr,SpuItf,skuInf } from './type'

enum API {
  // 获取SPU
  SPU_URL = '/admin/product/',
  // 获取全部品牌
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 某个spu下的全部售卖商品的图片
  IMAGE_URL = '/admin/product/spuImageList/',
  // 某个spu下的全部销售属性
  SALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 全部销售属性[颜色、版本、尺码]ADDSKU_URL
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 添加spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新spu
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 添加sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看已有spu下全部售卖商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除spu
  DELSPU_URL = '/admin/product/deleteSpu/'

}

// 获取SPU
export const reqSpu = (page: number,limit: number,c3Id:string|number):PromiseRes<spuData> => request.get(API.SPU_URL+`${page}/${limit}?category3Id=${c3Id}`)
// 获取全部品牌
export const reqAllTrademark = ():PromiseRes<Trademark[]> => request.get(API.ALLTRADEMARK_URL)
// 获取某个spu下的全部售卖商品的图片
export const reqSpuImages = (spuId: number):PromiseRes<spuImage[]> => request.get(API.IMAGE_URL+spuId)
// 获取某个spu下的全部销售属性
export const reqSpuSaleAttrs = (spuId: number):PromiseRes<spuSaleAttr[]> => request.get(API.SALEATTR_URL+spuId)
// 获取全部销售属性[颜色、版本、尺码]
export const reqAllSaleAttrs = ():PromiseRes<saleAttr[]> => request.get(API.ALLSALEATTR_URL)
// 添加或更新spu
export const reqAddOrUpdateSpu = (data:SpuItf):PromiseRes<string> => {
  // 拥有id，则为更新
  if(data.id) {
    return request.put(API.UPDATESPU_URL,data)
  } else {// 没有id，则为添加
    return request.post(API.ADDSPU_URL,data)
  }
}
// 添加sku
export const reqAddSku = (data:skuInf):PromiseRes<string> => request.post(API.ADDSKU_URL,data)
// 查看sku数据
export const reqSkuInfo = (skuId:number|string):PromiseRes<skuInf[]> => request.get(API.SKUINFO_URL+skuId)
// 删除spu
export const reqDelSpu = (skuId:number|string):PromiseRes<string> => request.post(API.DELSPU_URL+skuId)
