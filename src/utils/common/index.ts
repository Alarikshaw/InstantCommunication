import { useMessage } from '/@/hooks/web/useMessage';

// 提示信息
const { createMessage } = useMessage();
/**
 * 群名/用户名校验
 * @param name
 */
export function nameVerify(name: string): boolean {
  let nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (name.length === 0) {
    createMessage.error('请输入名字');
    return false;
  }
  if (!nameReg.test(name)) {
    createMessage.error('名字只含有汉字、字母、数字和下划线 不能以下划线开头和结尾');
    return false;
  }
  if (name.length > 9) {
    createMessage.error('名字太长');
    return false;
  }
  return true;
}
