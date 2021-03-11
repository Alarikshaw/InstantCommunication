import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import store from '/@/store/index';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

import { VuexModule, Mutation, Module, getModule, Action } from 'vuex-module-decorators';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';

import { asyncRoutes } from '/@/router/routes';

import { filter } from '/@/utils/helper/treeHelper';

import { RoleEnum } from '/@/enums/roleEnum';

const NAME = 'permission';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Permission extends VuexModule {
  // Permission code list
  private permCodeListState: string[] = [];

  // Whether the route has been dynamically added
  private isDynamicAddedRouteState = false;

  // To trigger a menu update
  private lastBuildMenuTimeState = 0;

  // Backstage menu list
  private backMenuListState: Menu[] = [];

  get getPermCodeListState() {
    return this.permCodeListState;
  }

  get getBackMenuListState() {
    return this.backMenuListState;
  }

  get getLastBuildMenuTimeState() {
    return this.lastBuildMenuTimeState;
  }

  get getIsDynamicAddedRouteState() {
    return this.isDynamicAddedRouteState;
  }

  @Mutation
  commitPermCodeListState(codeList: string[]): void {
    this.permCodeListState = codeList;
  }

  @Mutation
  commitBackMenuListState(list: Menu[]): void {
    this.backMenuListState = list;
  }

  @Mutation
  commitLastBuildMenuTimeState(): void {
    this.lastBuildMenuTimeState = new Date().getTime();
  }

  @Mutation
  commitDynamicAddedRouteState(added: boolean): void {
    this.isDynamicAddedRouteState = added;
  }

  @Mutation
  commitResetState(): void {
    this.isDynamicAddedRouteState = false;
    this.permCodeListState = [];
    this.backMenuListState = [];
    this.lastBuildMenuTimeState = 0;
  }

  @Action
  async buildRoutesAction(id?: number | string): Promise<AppRouteRecordRaw[]> {
    let routes: AppRouteRecordRaw[] = [];
    let tole = {
      value: 'super',
    };
    const roleList = [tole.value] as RoleEnum[];
    const { permissionMode } = appStore.getProjectConfig;
    routes = filter(asyncRoutes, (route) => {
      const { meta } = route as AppRouteRecordRaw;
      const { roles } = meta || {};
      if (!roles) return true;
      return roleList.some((role) => roles.includes(role));
    });
    return routes;
  }
}
export const permissionStore = getModule<Permission>(Permission);
