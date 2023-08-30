import request from "@/utils/request";
import { PromiseRes } from '@/api/type'
import type { PermissionResData } from '../role/type'
import type { MenuParams } from './type'


enum API {
  // 获取全部菜单与权限的标识数据
  ALLPERMISSION_API = '/admin/acl/permission',
  // 添加菜单
  ADDMENU_API = '/admin/acl/permission/save',
  // 更新菜单
  UPDATEMENU_API = '/admin/acl/permission/update',
  // 删除菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/'
}
// 获取全部菜单与权限的标识数据
export const reqAllPermission = ():PromiseRes<PermissionResData[]> => request.get(API.ALLPERMISSION_API)

// 添加或修改菜单
export const reqAddOrUpdateMenu = (data:MenuParams):PromiseRes<any> => {
  if(data.id) {
    // 修改菜单
    return request.put(API.UPDATEMENU_API,data)
  } else {
    // 添加菜单
    return request.post(API.ADDMENU_API,data)
  }
}
// 删除角色
export const reqDelMenu = (menuId: number):PromiseRes<any> => request.delete(API.DELETEMENU_URL+menuId)