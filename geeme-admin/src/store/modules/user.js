import { getItem } from '@/utils/storage'

const info = JSON.parse(getItem('USER_INFO'))

const state = {
  name: info? info.userName: '',
  userId: info? info.id: ''
}

const mutations = {
  SET_USER_INFO: (state, data) => {
    state.name = data.name;
    state.userId = data.id;
  }
}

export default {
  state,
  mutations,
}
