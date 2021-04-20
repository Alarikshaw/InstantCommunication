import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dashboard: AppRouteModule = {
  path: '/chat',
  name: 'Chat',
  component: LAYOUT,
  redirect: '/chat/foamal',
  meta: {
    icon: 'bx:bx-home',
    title: '首页',
  },
  children: [
    {
      path: 'foamal',
      name: 'foamal',
      component: () => import('/@/layouts/default/index.vue'),
      meta: {
        title: '首页',
        affix: true,
        icon: 'bx:bx-home',
      },
    },
  ],
};

export default dashboard;
