import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import type { App } from 'vue';

import { basicRoutes } from './routes';

import { createGuard } from './guard/';

/**
 * 路由故障处理
 */
import { scrollBehavior } from './scrollBehavior';
import { REDIRECT_NAME } from './constant';

export const hashRouter = createWebHashHistory();

/**
 * 创建路由
 */
const router = createRouter({
  history: hashRouter,
  routes: (basicRoutes as unknown) as RouteRecordRaw[], // 基础路由，无需权限
  strict: true,
  scrollBehavior: scrollBehavior,
});

/**
 * 重置路由器
 */
export function resetRouter() {
  const resetWhiteNameList = ['Login', REDIRECT_NAME];
  router.getRoutes().forEach((route: any) => {
    const { name } = route;
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}
export function setupRouter(app: App<Element>) {
  app.use(router);
  createGuard(router);
}

export default router;
