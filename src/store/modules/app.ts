import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { resetRouter } from '/@/router';
import type { ProjectConfig } from '/@/types/config';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { setLocal, getLocal, clearSession, clearLocal } from '/@/utils/helper/persistent';
import store from '/@/store';
import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import { userStore } from './user';
import { permissionStore } from './permission';
let timeId: TimeoutHandle;
const NAME = 'app';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class App extends VuexModule {
  /**
   * 页面加载状态
   */
  private pageLoadingState = false;

  // project config
  private projectConfigState: ProjectConfig | null = getLocal(PROJ_CFG_KEY);
  /**
   * 获取页面加载状态
   */
  get getPageLoading() {
    return this.pageLoadingState;
  }

  get getProjectConfig(): ProjectConfig {
    return this.projectConfigState || ({} as ProjectConfig);
  }
  /**
   * 改变页面加载状态
   * @param loading
   */
  @Mutation
  commitPageLoadingState(loading: boolean): void {
    this.pageLoadingState = loading;
  }

  /**
   * 重载
   */
  @Action
  async resumeAllState() {
    resetRouter();
    clearSession();
    clearLocal();
    permissionStore.commitResetState();
    userStore.commitResetState();
  }

  @Action
  public async setPageLoadingAction(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId);
      // Prevent flicker
      timeId = setTimeout(() => {
        this.commitPageLoadingState(loading);
      }, 50);
    } else {
      this.commitPageLoadingState(loading);
      clearTimeout(timeId);
    }
  }
}

export const appStore = getModule<App>(App);
