import request from "@/utils/request";
import { PromiseRes } from '@/api/type'
import { userData,UserItf,RoleRes,SetRolePms } from './type'

enum API {
  // 获取全部用户账号信息
  ALLUSER_API='/admin/acl/user/',
  // 添加用户
  ADDUSER_API='/admin/acl/user/save',
  // 修改用户
  UPDATEUSER_API='/admin/acl/user/update',
  // 获取全部职位，当前账号拥有的职位
  ALLROLE_API='/admin/acl/user/toAssign/',
  // 给用户分配角色
  SETROLE_API='/admin/acl/user/doAssignRole',
  // 删除一个用户
  DELUSER_API='/admin/acl/user/remove/',
  // 批量删除用户
  BATCHDELUSER_API='/admin/acl/user/batchRemove',

}

// 获取全部用户账号信息
export const reqUserInfo = (page: number,limit: number,username?: string):PromiseRes<userData> => {
  if(username) {
    return request.get(API.ALLUSER_API+`${page}/${limit}?username=${username}`)
  } else {
    return request.get(API.ALLUSER_API+`${page}/${limit}`)
  }
}
// 添加或修改用户
export const reqAddOrUpdateUser = (data:UserItf):PromiseRes<userData> => {
  if(data.id) {
    // 修改用户
    return request.put(API.UPDATEUSER_API,data)

  } else {
    // 添加用户
    return request.post(API.ADDUSER_API,data)
  }
}
// 获取全部职位包含当前用户已有的职位
export const reqAllRole = (userId: number) :PromiseRes<RoleRes>=> request.get(API.ALLROLE_API+userId)
// 分配角色
export const reqSetRole = (data:SetRolePms):PromiseRes<string> => request.post(API.SETROLE_API,data)
// 删除用户
export const reqDelUser = (data: number[]):PromiseRes<string> => {
  // 只有一个数据，只删除一个
  if(data.length == 1) return request.delete(API.DELUSER_API+data[0])
  else return request.delete(API.BATCHDELUSER_API,{data})
  // 多个数据，进行批量删除
}