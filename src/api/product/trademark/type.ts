
export interface BaseTrademark {
  page: number,
  limit: number
}

export interface Trademark {
  createTime?: string
  id?: number
  logoUrl: string
  tmName: string
  updateTime?: string
}

export interface BaseTrademarkData {
  countId: number | null
  current: number
  hitCount: boolean
  maxLimit: number | null
  optimizeCountSql: boolean
  orders: number[]
  pages: number
  records: Trademark[]
  searchCount: boolean
  size: number
  total: number
}