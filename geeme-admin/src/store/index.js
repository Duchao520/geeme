import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import role from './modules/role'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    role,
    menu, 
    user
  }
})