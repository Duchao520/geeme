export default {
  SET_CURRENT_APPO(state, info) {
    for (let key in info) {
      state.currentAppo[key] = info[key]
    }
  },
  SET_APPO_ENTRY(state, info) {
    state.appoEntry = info
  }
};