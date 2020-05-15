const state = {
  routes: [],
  permission: [],
}

const mutations = {
  SET_ROLE:(state, data) => {
    state.routes = data.routes
    state.permission = data.permission
  }
}

export default {
  state,
  mutations,
}