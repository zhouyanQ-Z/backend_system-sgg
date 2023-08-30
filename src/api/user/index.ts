// 统一管理用户模块相关接口
import request from "@/utils/request";
import { LoginForm,LoginRes,UserInfo} from './type'
import { PromiseRes } from '@/api/type'

enum API {
  // mock-api
  //LOGIN_URL = '/user/login',
  //USERINFO_URL = '/user/info'

  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL='/admin/acl/index/logout'
}

// mock-api
//export const reqLogin = (data:LoginForm):PromiseRes<LoginRes> => request.post(API.LOGIN_URL,data)
//export const reqUserInfo = ():PromiseRes<UserInfoRes> => request.get(API.USERINFO_URL)

// 登录
export const reqLogin = (data:LoginForm):PromiseRes<string> => request.post(API.LOGIN_URL,data)
// 获取用户信息
export const reqUserInfo = ():PromiseRes<UserInfo> => request.get(API.USERINFO_URL)
// 获取用户信息
export const reqLogout = ():PromiseRes<null> => request.post(API.LOGOUT_URL)