import type { UserConfig, ConfigEnv } from 'vite';

import { loadEnv } from 'vite';
import { resolve } from 'path';

import { generateModifyVars } from './build/config/themeConfig';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';

import globbyTransform from './build/vite/plugin/context/transform';
import dynamicImportTransform from './build/vite/plugin/dynamicImport/index';

import { isDevFn } from './build/utils';

import { createVitePlugins } from './build/vite/plugin';

const pkg = require('./package.json');
function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE, VITE_LEGACY } = viteEnv;
  console.log('VITE_PROXY', VITE_PROXY);
  console.log('createProxy(VITE_PROXY)', createProxy(VITE_PROXY));
  const isBuild = command === 'build';
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          // /@/xxxx  =>  src/xxx
          find: /^\/@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          // /#/xxxx  =>  types/xxx
          find: /^\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        'socket.io': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          ws: true,
        },
      },
      hmr: {
        overlay: true,
      },
    },
    build: {
      cssCodeSplit: false,
      // minify: 'esbuild',
      outDir: 'dist',
      polyfillDynamicImport: VITE_LEGACY,
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 1200,
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __VUE_I18N_LEGACY_API__: false,
      __VUE_I18N_FULL_INSTALL__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // Used for global import to avoid the need to import each style file separately
            // reference:  Avoid repeated references
            hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
            ...generateModifyVars(),
          },
          javascriptEnabled: true,
        },
      },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    optimizeDeps: {
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: [
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'ant-design-vue/es/locale/en_US',
        'moment/dist/locale/eu',
        'socket.io-client',
      ],
      exclude: ['vue-demi'],
    },
  };
};
