import Vue from 'vue'
import App from '.'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '卡主详情'
  }
}
