import request from "@/utils/request";
import { PromiseRes } from '@/api/type'
import type { RoleResData,RoleType,PermissionResData } from './type'

enum API {
  // 获取全部角色
  ALLUSER_API='/admin/acl/role/',
  // 添加角色
  ADDROLE_API='/admin/acl/role/save',
  // 修改角色
  UPDATEROLE_API='/admin/acl/role/update',
  // 获取全部权限
  ALLPERMISSION_API='/admin/acl/permission/toAssign/',
  // 分配权限
  ALLOCATEPERMISSION_URL = '/admin/acl/permission/doAssign/',
  // 删除角色
  DELETEROLE_URL = '/admin/acl/role/remove/'
}

// 获取全部角色
export const reqRoleList = (page: number,limit: number,roleName?: string):PromiseRes<RoleResData> => {
  if(roleName) {
    return request.get(API.ALLUSER_API+`${page}/${limit}?roleName=${roleName}`)
  } else {
    return request.get(API.ALLUSER_API+`${page}/${limit}`)
  }
}
// 添加或修改角色
export const reqAddOrUpdateRole = (data:RoleType):PromiseRes<any> => {
  if(data.id) {
    // 修改角色
    return request.put(API.UPDATEROLE_API,data)
  } else {
    // 添加角色
    return request.post(API.ADDROLE_API,data)
  }
}
// 获取全部权限
export const reqAllPermission = (roleId: number):PromiseRes<PermissionResData[]> => request.get(API.ALLPERMISSION_API+roleId)
// 分配权限
export const reqAllocatePermission = (roleId: number,permissionId: number[]):PromiseRes<any> => request.post(API.ALLOCATEPERMISSION_URL+`?roleId=${roleId}&permissionId=${permissionId}`)
// 删除角色
export const reqDelRole = (roleId: number):PromiseRes<any> => request.delete(API.DELETEROLE_URL+roleId)