import Vue from 'vue'
import Router from 'vue-router'
import {constants} from 'os';
import {shopRouters} from './_shopRouters'
import {brandRouters} from './_brandRouters'
import store from '../store'

Vue.use(Router)
const router = new Router({
  // mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return {x: 0, y: 0}
  },
  routes: [
    {
      path: '/',
      name: 'login',
      component: res => require(['@/pages/loginAbout/Login.vue'], res)
    },
    {
      path: '/retsiger',  // 注册路由 register倒置
      component: res => require(['@/pages/loginAbout/Register.vue'], res)
    },
    {
      path: '/user-agreement',
      component: res => require(['@/pages/loginAbout/UserAgreement.vue'], res)
    },
    {
      path: '/retrieve-pass',
      component: res => require(['@/pages/loginAbout/RetrievePass.vue'], res),
    },
    //个人中心
    {
      path: '/center',
      component: res => require(['@/pages/center/index.vue'], res),
      redirect: '/center/brands',
      children: [
        {path: '/center/brands', component: res => require(['@/pages/center/brands.vue'], res)},
        {path: '/center/shops', component: res => require(['@/pages/center/shops.vue'], res)},
        {path: '/center/buySoftware', component: res => require(['@/pages/center/buySoftWare.vue'], res)},
        {path: '/center/novice-guide', component: res => require(['@/pages/center/noviceGuide.vue'], res)},
        {path: '/center/systemInfo', component: res => require(['@/pages/center/systemInfo.vue'], res)},
        {path: '/center/customerService', component: res => require(['@/pages/center/customerService.vue'], res)},
        {path: '/center/person', component: res => require(['@/pages/center/person.vue'], res)},
        {path: '/center/password', component: res => require(['@/pages/center/password.vue'], res)},
        {path: '/center/account', component: res => require(['@/pages/center/accountSecurity.vue'], res)},
      ]
    },
    //个人中心,创建品牌
    {
      path: '/create/brands',
      component: res => require(['@/pages/center/createBrands.vue'], res),
    },
    // 伪白名单
    //个人中心,品牌认证(entry: brand)
    {
      path: '/brand-inner/center/auth-brand',
      component: res => require(['@/pages/center/brandAuthentication.vue'], res),
    },
    //个人中心,编辑品牌(entry: brand)
    {
      path: '/brand-inner/edit/brands',
      component: res => require(['@/pages/center/createBrands.vue'], res),
    },
    //个人中心,创建门店(entry: brand)
    {
      path: '/brand-inner/create/shops',
      component: res => require(['@/pages/center/createShops.vue'], res),
    },
    //个人中心,编辑门店(entry: shop)
    {
      path: '/shop-inner/edit/shops',
      component: res => require(['@/pages/center/createShops.vue'], res),
    },
    // 个人中心, 软件订购-新购
    {
      path: '/shop-inner/newBuy',
      component: res => require(['@/pages/center/newBuy.vue'], res),
    },
    // 个人中心, 软件订购-续费[品牌]
    {
      path: '/shop-inner/renewal',
      component: res => require(['@/pages/center/softRenew/_brandShops.vue'], res),
      // component: res => require(['@/pages/center/renewal.vue'], res),
    },
    // 个人中心, 软件订购-购买续期券[品牌]
    {
      path: '/center/buy-tickets',
      component: res => require(['@/pages/center/softRenew/buyTickets.vue'], res),
    },
    // 个人中心, 软件订购-续费[门店]
    {
      path: '/center/single-shop',
      component: res => require(['@/pages/center/softRenew/_singleShop.vue'], res),
    },
    // 伪白名单
    ...shopRouters,
    ...brandRouters
  ]
})
if (SERVICE_URL === 'https://develop.geeme.cn') {
  router.addRoutes([{
    path: '/test/180801',
    name: 'test',
    component: res => (require(['@/pages/testPages.vue'], res))
  }])
}
export default router

let whiteList = [
  '/',
  '/test/180801',
  '/retsiger',  // register倒置
  '/user-agreement',
  '/retrieve-pass',
  '/center/brands',
  '/create/brands',
  '/center/shops',
  '/center/novice-guide',
  '/center/buySoftware',
  '/center/systemInfo',
  '/center/customerService',
  '/center/person',
  '/center/password',
  '/center/account',
  // 伪白名单
  '/brand-inner/center/auth-brand',
  '/brand-inner/edit/brands',
  '/brand-inner/create/shops', // 使用新开券
  '/shop-inner/edit/shops', // 使用新开券
  '/shop-inner/renewal', // 品牌软件[续费] - 使用续期券
  '/shop-inner/newBuy',  // 品牌软件新购 - 购新开券
  '/center/buy-tickets', // 品牌软件续费 - 购续期券
  '/center/single-shop', // 单店软件[续费] - 使用续期券
]
router.beforeEach((to, from, next) => {
  // console.log('from: ', from.path)
  // console.log('to: ', to.path)
  if (whiteList.includes(to.path)) {
    next()
  } else if ((from.path.indexOf('/brand-inner') === 0 || store.state.authRouter.currentEntry === 'brand') && to.path.indexOf('/shop-inner') === 0) {
    console.warn('权限不足1')
    next({path: '/center/brands'})
  } else if ((from.path.indexOf('/shop-inner') === 0 || store.state.authRouter.currentEntry === 'shop') && to.path.indexOf('/brand-inner') === 0) {
    console.warn('权限不足2')
    next({path: '/center/brands'})
  } else if (store.state.authRouter.comparisonBrandId !== store.state.manage.currentInfo.brandId) {
    // 这里主要是解决个人中心的品牌切换导致另外标签的管理页面的数据混乱
    console.warn('权限不足4')
    next({path: '/center/brands'})
  } else {
    // 2 测试开放全部路由, 上线请记得注释!!!
    // return next()

    // 1
    if (checkAuthRouter(to.name)) {
      next()
    } else {
      console.warn('权限不足3', from.path, to.path)
      next({path: '/center/brands'})
    }
  }
})

function checkAuthRouter(pathName) {
// let currentEntry = store.state.authRouter.currentEntry
  let flatAuths = store.state.authRouter.flatAuths
  if (flatAuths.includes(pathName)) return true
  return false
}
