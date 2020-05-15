import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
// import store from '@/store'
import authRoutes from './authRoutes'
// Token 相关
import utils from '@/utils'
import {  getTokenByCode,  refreshToken} from '@/api/token'
import { removeToken, tokenExist, tokenExpires, setToken, } from '@/utils/token'

Vue.use(Router)

const constantRoutes = [
  {
    path: '/',
    redirect: '/app'
  },
  {
    path: '/app',
    component: Layout,
    children: authRoutes,
    redirect: '/app/dashboard'
  },
  {
    path: '/register',
    component: () => import('@/pages/register/index'),
  },
  {
    path: '/login',
    component: () => import('@/pages/login/index'),
  },
  {
    path: '/retrieve',
    component: () => import('@/pages/retrieve/index'),
  }
]

const createRouter = () => new Router({
  routes: constantRoutes,
})

const router = createRouter()

router.beforeEach(async (to, from, next) => {
  // return // 开发环境 这里是复制了线上开发网址token等数据后， 才能执行后续的
  // /login 页面不受限... 还有其他？
  if (to.path === '/login' || to.path === '/retrieve') {
    return next()
  }
  // 授权中心强制登出
  if (utils.getURLParam('logout') === 'true') {
    removeToken()
    window.location.href = process.env.VUE_APP_AUTHURL + '/login'
  }

  // token不存在且URL中不存在 code,登出
  if (!tokenExist() && !utils.getURLParam('code')) {
    window.location.href = process.env.VUE_APP_AUTHURL + '/oauth/authorize?response_type=code&client_id=' + process.env.VUE_APP_APPID + '&redirect_uri=' + process.env.VUE_APP_BASEURL
    return
  }
  // token不存在且URL中存在 code, 请求换取 token
  if (!tokenExist() && utils.getURLParam('code')) {
    const code = utils.getURLParam('code')
    try {
      let res = await getTokenByCode(code)
      setToken(res.data)
    } catch(e) {
      window.location.href = process.env.VUE_APP_AUTHURL + '/oauth/authorize?response_type=code&client_id=' + process.env.VUE_APP_APPID + '&redirect_uri=' + process.env.VUE_APP_BASEURL
    }
    next('/')
  }

  // 如果 token存在但已过期
  if (tokenExist() && tokenExpires()) {
    try {
      const res = await refreshToken()
      setToken(res.data)
    } catch(e) {
      window.location.href = process.env.VUE_APP_AUTHURL + '/oauth/authorize?response_type=code&client_id=' + process.env.VUE_APP_APPID + '&redirect_uri=' + process.env.VUE_APP_BASEURL
    }
    return next()
  }
  return next()
})

export default router
