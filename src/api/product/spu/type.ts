import type { skuImg } from '@/api/product/sku/type'
// spu数据ts类型
export interface SpuItf {
  id?: number,
  spuName: string,
  description: string,
  category3Id: string | number,
  tmId: number | string,
  spuSaleAttrList: null | spuSaleAttr[],
  spuImageList: null | spuImage[]
}

// 接口返回全部数据类型
export interface spuData {
  records: SpuItf[],
  total: number,
  size: number,
  current: number,
  searchCount: number,
  pages: number
}

// 商品图片ts类型
export interface spuImage {
  id: number,
  createTime: string,
  updateTime: string,
  spuId: number,
  imgName: string,
  imgUrl: string
}

// 商品销售属性值ts类型
export interface spuSaleAttrValue {
  id?: number,
  createTime?: string,
  updateTime?: string,
  spuId?: number,
  baseSaleAttrId: number,
  saleAttrValueName: string,
  saleAttrName?: string,
  isChecked?: null
}
// 商品销售属性ts类型
export interface spuSaleAttr {
  id?: number,
  createTime?: string,
  updateTime?: string,
  spuId?: number,
  baseSaleAttrId: number,
  saleAttrName: string,
  spuSaleAttrValueList: spuSaleAttrValue[],
  flag?: boolean,
  saleAttrValue?: ''
  saleIdAndValueId?:string
}
// 全部销售属性
export interface saleAttr {
  id: number,
  name: string
}

export interface skuAttrValue {
  id?: number,
  skuId?: number,
  attrId: string | number,
  attrName?: string,
  valueId: string | number,
  valueName?: string,
  attrIdAndValueId?:string
}
export interface skuSaleAttr {
  id?: number,
  skuId?: number,
  spuId?: number,
  saleAttrId: string | number,//属性ID
  saleAttrName?: string,//属性名字
  saleAttrValueId: string | number// 属性值ID
  saleAttrValueName?: string// 属性值名字
}

// sku参数
export interface skuInf {
  category3Id?: string | number,//三级分类ID
  spuId?: string | number,//spu的ID
  tmId?: string | number,//品牌ID
  skuName?: string,// sku名字
  price?: string | number,// sku价格
  weight?: string | number,// sku重量
  skuDesc?: string,// sku描述
  skuAttrValueList?: skuAttrValue[],// 平台属性
  skuSaleAttrValueList?: skuSaleAttr[],// 销售属性
  skuDefaultImg?: string, // sku图片地址
  isSale?: number // 是否在售卖
  id?: number,
  skuImageList?: skuImg[]
}