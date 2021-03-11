/**
 * 路由属性
 */
import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';

/**
 * 定义：未找到路由&&重定向路由
 */
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '../constant';

/**
 * 获取该目录下所有菜单文件
 */
const modules = import.meta.globEager('./modules/**/*.ts');

/**
 * 获取基础页面路径
 */
import { PageEnum } from '/@/enums/pageEnum';

/**
 * 所有路由容器(带权限)
 */
const routeModuleList: AppRouteModule[] = [];

/**
 * 将获得的路由 处理装入容器
 */
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

/**
 * 合并错误路由至容器
 */
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

/**
 * 设置根路由
 */
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_CHAT,
  meta: {
    title: 'Root',
  },
};

/**
 * 设置登录路由
 */
export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: '登录',
  },
};

/**
 * 设置登录路由
 */
export const InitRoute: AppRouteRecordRaw = {
  path: '/init',
  name: 'init',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: '初始化数据库',
  },
};
/**
 * 导出登录路由、根路由、重新向路由
 */
export const basicRoutes = [LoginRoute, InitRoute, RootRoute, REDIRECT_ROUTE];
