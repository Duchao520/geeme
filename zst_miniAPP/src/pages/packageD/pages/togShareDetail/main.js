import Vue from 'vue'
import App from '.'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '我的共享卡',
  }
}
