import { Router, RouteLocationNormalized } from 'vue-router';

import {} from 'ant-design-vue';

const isHash = (href: string) => {
  return /^#/.test(href);
};

/**
 * 路由变化时，进度条
 */
import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { setLastChangeTab } from '/@/logics/mitt/tabChange';
import { setTitle } from '/@/utils/browser';
import { REDIRECT_NAME } from '/@/router/constant';
const body = document.body;
/**
 * 创建权限路由
 * @param router
 */
export function createGuard(router: Router) {
  let axiosCanceler: Nullable<AxiosCanceler>;
  const loadedPageMap = new Map<string, boolean>();
  router.beforeEach(async (to) => {
    to.meta.loaded = !!loadedPageMap.get(to.path);
    // 通知路由变化
    setLastChangeTab(to);
    return true;
  });
  router.afterEach((to) => {
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);

    loadedPageMap.set(to.path, true);

    // 更改html标题
    to.name !== REDIRECT_NAME && setTitle(to.meta.title, 'InstantCommunication');
  });
  createProgressGuard(router);
  createPermissionGuard(router);
}
