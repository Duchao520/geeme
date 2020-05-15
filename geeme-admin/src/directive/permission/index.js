import Vue from 'vue'
import store from '@/store'

const permission = Vue.directive('permission', {
  inserted: function(el) {
    let permission = store.state.role.permission
    if (permission.indexOf(el.name) < 0) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})

export default permission