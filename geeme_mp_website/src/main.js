import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/js/rem'

// main.js
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
Vue.use(Toast, {
  type: 'center',
  duration: 1500,
  wordWrap: true,
  width: '150px'
});


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
