import Vue from 'vue'
import Router from 'vue-router'
import svip from './routerModules/svip'
import scanPay from './routerModules/scanPay'
import wx_public from './routerModules/wx-public'

Vue.use(Router)

export default new Router({
  routes: [
    ...svip,
    ...scanPay,
    ...wx_public
  ]
})
