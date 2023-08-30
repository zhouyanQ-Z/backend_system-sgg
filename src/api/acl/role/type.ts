
// 角色数据类型
export interface RoleType {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark?: null
}

// 接口返回数据类型
export interface RoleResData {
  records: RoleType[],
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
// 权限接口返回数据类型
export interface PermissionResData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  pid?: number,
  name: string,
  code: string,
  toCode: string,
  type: number,
  status: null,
  level: number,
  children?: PermissionResData[],
  select: boolean
}