
export interface categoryRes {
  id: number|string,
  name: string,
  category1Id?: number
  category2Id?: number
}

export interface attrVal {
  id?: number,
  valueName: string,
  attrId?: number,
  flag?: boolean, // 控制编辑与查看模式切换
}

export interface attrRes {
  id?: number,
  attrName: string,
  categoryId: number|string,
  categoryLevel: number,
  attrValueList: attrVal[]
  attrIdAndValueId?: string
}