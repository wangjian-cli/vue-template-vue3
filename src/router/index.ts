import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  // 首页
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/view/Home.vue')
  },
  // 兜底路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
];
// router实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
