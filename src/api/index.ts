import { FetchPost } from '/@/api/services';

/**
 * 注册新用户
 * @param param
 */
export async function GetRegister(param: UserRegister) {
  const URL = '/auth/register';
  return await FetchPost(URL, param);
}

/**
 * 用户登录
 * @param params
 */
export async function PostLogin(params: UserRegister) {
  const URL = '/auth/login';
  return await FetchPost(URL, params);
}
