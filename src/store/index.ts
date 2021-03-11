import type { App } from 'vue';

/**
 * 创建记录器
 */
import { createStore } from 'vuex';

import { config } from 'vuex-module-decorators';
config.rawError = true;

const store = createStore({
  strict: false,
});

export function setupStore(app: App<Element>) {
  app.use(store);
}

export default store;
