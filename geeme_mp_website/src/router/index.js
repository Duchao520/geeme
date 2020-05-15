import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/authorize/index')
    },
    {
      path: '/wxAuthorize',
      name: 'wxAuthorize',
      component: () => import('@/pages/authorize/authorize/wxAuthorize')
    },
    {
      path: '/bindPhone',
      name: 'bindPhone',
      component: () => import('@/pages/authorize/bindCustomer/bindPhone')
    }
  ]
})
