import actions from './actions';
import mutations from './mutations';
import state from './state';
import billCardInfo from './billCardInfo/index'

export default {
  state,
  actions,
  mutations,
  modules: {billCardInfo}
}
