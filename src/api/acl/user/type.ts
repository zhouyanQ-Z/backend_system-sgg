
export interface UserItf {
  id?: number,
  createTime?: string,
  updateTime?: string,
  username: string,
  password?: string,
  name: string,
  phone?: null,
  roleName?: string
}
// 用户信息返回数据类型
export interface userData {
  records: UserItf[],
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
// 角色（职位）ts类型
export interface RoleType {
  id?: number,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark: null,
}
// 获取角色返回数据类型
export interface RoleRes {
  assignRoles: RoleType[],
  allRolesList: RoleType[],
}

// 给用户分配角色携带参数类型
export interface SetRolePms {
  userId: number,
  roleIdList: number[]
}
