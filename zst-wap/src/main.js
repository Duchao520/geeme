// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/js/rem'
import VueLazyload from 'vue-lazyload'  //引入这个懒加载插件
import VueToast from './components/common/toast' //通用弹窗提醒

Vue.config.productionTip = false

Vue.use(VueLazyload,{
    error:require('@/assets/imgs/common/defaultGoods.png'),
    loading:require('@/assets/imgs/common/defaultGoods.png'),
    attempt: 1
});

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import {accMul,accDiv,accAdd,Subtr} from "@/assets/js/deal";
Vue.prototype.$accMul = accMul;   //乘
Vue.prototype.$accDiv = accDiv;   //除
Vue.prototype.$accAdd = accAdd;   //加
Vue.prototype.$Subtr = Subtr;     //减

router.beforeEach((to,from,next) =>{ /*路由变化修改title*/

  if(from.query.status_bar_height){
    to.query.status_bar_height = from.query.status_bar_height;
  }
  if(to.meta.title){ document.title=to.meta.title }
  next();
});

import {getSignIn,getParterToken} from "./assets/js/jsBridge";
Vue.prototype.$getSignIn = getSignIn;
Vue.prototype.$getParterToken = getParterToken;

import { Popup , MessageBox ,Picker , DatetimePicker  } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);
Vue.component(DatetimePicker.name, DatetimePicker);

Vue.component('vToast',VueToast);

// 以 plugin 形式使用时，请在入口处引入：
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin);
Vue.prototype.$devicePixelRatio = 1

import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
