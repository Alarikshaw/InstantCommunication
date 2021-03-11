/**
 * 用户登录参数
 */
export interface LoginParams {
  userName: string;
  password: string;
}

/**
 * 获取角色信息
 */
export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * 登录界面返回值
 */

export interface LoginResultModel {
  userId: string;
  token: string;
  role: RoleInfo;
}
/**
 * @description: Get user information return value
 */
export interface GetUserInfoByUserIdModel {
  userId: string;
  username: string;
  createTime: number;
  password: string;
  status?: string;
  tag?: string;
  avatar?: string;
}

/**
 * 获取用户信息
 */
export interface GetUserInfoByUserIdParams {
  userId: string;
  username: string;
  createTime: number;
  password: string;
  status?: string;
  tag?: string;
  avatar: string;
}
