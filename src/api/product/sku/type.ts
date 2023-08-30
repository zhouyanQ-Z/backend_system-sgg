import { skuInf } from '@/api/product/spu/type'

// sku返回数据类型
export interface skuData {
  records: skuInf[],
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number,
  hitCount: boolean,
  maxLimit: number | null,
  optimizeCountSql: boolean,
  countId: number,
  orders: number[]
}

// sku图片ts类型
export interface skuImg {
  id: number,
  createTime: string,
  updateTime: string,
  skuId: number,
  imgName: string,
  imgUrl: string,
  spuImgId: number,
  isDefault: string
}