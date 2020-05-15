const logistics = () => import('@/components/logistics/index');
const nonsupport = () => import('@/components/logistics/nonsupport');
const closeWebView = () => import('@/components/logistics/closeWebView');

export default [
  {
    path: '/logistics',
    name: 'logistics',
    component: logistics
  },
  {
    path: '/nonsupport',
    name: 'nonsupport',
    component: nonsupport
  },
  {
    path: '/closeWebView',
    name: 'closeWebView',
    component: closeWebView
  }
]
