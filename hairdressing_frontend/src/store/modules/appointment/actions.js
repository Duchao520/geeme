export default {
  setCurrentAppo: ({ commit }, appoInfo) => {
      commit('SET_CURRENT_APPO', appoInfo)
  },
  setAppoEntry: ({ commit }, info) => {
    commit('SET_APPO_ENTRY', info)
  }
};