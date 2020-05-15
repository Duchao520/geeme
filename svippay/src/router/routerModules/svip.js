const index = () => import('@/components/svip/index');
const pay = () => import('@/components/svip/pay');
const auth = () => import('@/components/svip/auth');

export default [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/pay',
    name: 'pay',
    component: pay
  },
  {
    path: '/auth',
    name: 'auth',
    component: auth
  }
]
