import Vue from 'vue'
import App from './App'
import flyioPlugin from './utils/apiUtil.js'
import store from './store/index'
import Hack from './utils/Hack'

// src/main.js

Vue.prototype.$store = store;

import '../static/weui/weui.css'
import './css/app.css'


// Vue.config._mpTrace = true
// Vue.config.productionTip = false
// App.mpType = 'app'
Vue.use(flyioPlugin);//使用组件库
Vue.use(Hack);//使用组件库

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {

}
