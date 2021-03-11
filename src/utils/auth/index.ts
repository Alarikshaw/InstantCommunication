import { userStore } from '/@/store/modules/user';

export function getToken(): string {
  return userStore.getTokenState;
}

export function getTokenState(): any {
  return userStore.getUserInfoState;
}
