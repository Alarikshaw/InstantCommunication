/**
 * 注册请求参数
 */
interface UserRegister {
  /**
   * 注册密码
   */
  password: string;

  /**
   * 注册用户名
   */
  userName?: string;

  /**
   * 注册用户名
   */
  username?: string;

  /**
   * 注册时间
   */
  createTime?: number;
}

/**
 * 注册接口返回值
 */
interface RepUserReg {
  code: number;
  data: object;
  msg: string;
}

interface ResponseParam {
  code?: number;
  data?: any;
  msg?: string;
}

interface InitDBForm {
  mysql: string;
  host: string;
  port: string;
  userName: string;
  password: string;
  dbName: string;
}
