

// 添加与修改菜单携带的参数类型
export interface MenuParams {
  id?: number,
  code: string, // 权限值
  level: number, // 菜单级别
  name: string, // 菜单名称
  pid: number, // 菜单id
}