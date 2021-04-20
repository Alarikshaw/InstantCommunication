// see https://github.com/vuejs/vue-router-next/blob/master/playground/scrollWaiter.ts
import type { RouteLocationNormalized } from 'vue-router';
/**
 * 处理滚动行为的路线导航
 *
 * @param {object} to 下一页的路由对象
 * @param {object} from 前一页的路由对象
 * @param {object} savedPosition 由popstate导航使用
 * @returns {(object|boolean)} 滚动位置或false
 */
// @ts-ignore
export async function scrollBehavior(to, from, savedPosition) {
  // await scrollWaiter.wait();
  // 使用预定义的滚动行为，如果定义，默认为没有滚动行为
  const behavior = 'smooth';
  // 当使用后退/前进按钮导航时，
  // 返回' savedPosition'(如果可用)将导致类似本机的行为
  if (savedPosition) {
    return { ...savedPosition, behavior };
  }

  // /通过返回选择器滚动到锚
  if (to.hash) {
    return { el: decodeURI(to.hash), behavior };
  }

  // //检查任何匹配的路由配置是否有不滚动到顶部
  if (to.matched.some((m: RouteLocationNormalized) => m.meta.scrollToTop === false)) {
    // 让滚动保持原样
    return false;
  }

  // //滚动到顶部
  return { left: 0, top: 0, behavior };
}
