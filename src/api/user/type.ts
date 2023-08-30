// 登录接口携带参数ts类型
export interface LoginForm {
  username: string,
  password: string
}


export interface LoginRes {
  token: string,
  message?: string
}

export interface UserInfo {
  userId:number,
  avatar: string,
  username?: string,
  name: string,
  password?: string,
  desc: string,
  roles: string[],
  buttons: string[],
  routes: string[],
  token: string,
}

export interface UserInfoRes {
  checkUser: UserInfo,
  message?: string
}