import * as axios from "@/util/axios";
import store from '@/store';

export default {
  setStaffsInfo: ({ commit }, params) => {
    axios.get(`/getShopNumByStoreId/${store.state.manage.currentInfo.shopId}`).then(res => {
      commit('SET_STAFFS_INFO', res.shopNumInfoMap || {})
    });
  },
};