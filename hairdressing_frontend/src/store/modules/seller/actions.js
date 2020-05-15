export default {
  saveSellerGroup: ({
    commit
  }, param) => {
    // 深拷贝 防止通过Actions方法改变已经传入state中的数据
    commit('SAVE_SELLER_GROUP', JSON.parse(JSON.stringify(param)))
  },
  saveSellerMenu: ({
    commit
  }, param) => {
    commit('SAVE_SELLER_MENU', param)
  },
  saveSellerFlag: ({
    commit
  }, param) => {
    commit('SAVE_SELLER_FLAG', param)
  }
};
