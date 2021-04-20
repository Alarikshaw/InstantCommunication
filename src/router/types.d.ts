import type { RouteRecordRaw } from 'vue-router';

import { RoleEnum } from '/@/enums/roleEnum';

import Component from '/@/components/types';

/**
 * 路由属性接口
 */
export interface RouteMeta {
  /**
   * 标题
   */
  title: string;

  /**
   * 是否忽略权限
   */
  ignoreAuth?: boolean;

  /**
   * 角色信息
   */
  roles?: RoleEnum[];

  /**
   * 是否缓存
   */
  ignoreKeepAlive?: boolean;

  /**
   * 是否固定在tab上
   */
  affix?: boolean;

  /**
   * 图标
   */
  icon?: string;

  // 跳转地址

  /**
   * 当前页面过渡
   */
  transitionName?: string;

  /**
   * 路由是否被动态添加
   */
  hideBreadcrumb?: boolean;

  /**
   * 携带参数
   */
  carryParam?: boolean;

  /**
   * 用于内部标记单个菜单
   */
  single?: boolean;
}

/**
 * 路由属性
 */
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Record<string, any>;
  fullPath?: string;
}

/**
 * 路由标签
 */
export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

/**
 * 菜单属性
 */
export interface Menu {
  name: string;
  icon?: string;
  path: string;
  disabled?: boolean;
  children?: Menu[];
  orderNo?: number;
  roles?: RoleEnum[];
  meta?: Partial<RouteMeta>;
  tag?: MenuTag;
}

/**
 * 菜单模块
 */
export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}

/**
 * 路由
 */
export type AppRouteModule = AppRouteRecordRaw;
