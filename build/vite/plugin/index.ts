import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import { configHtmlPlugin } from './html';
// @ts-ignore
import pkg from '../../../package.json';
import { isDevFn, isProdFn, ViteEnv } from '../../utils';

// gen vite plugins
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK, VITE_LEGACY, VITE_USE_PWA } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    // have to
    vue(),
    // have to
    vueJsx(),
  ];
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));
  if (isProdFn() && VITE_USE_PWA) {
  }

  if (isDevFn() && VITE_USE_MOCK) {
  }
  return vitePlugins;
}
