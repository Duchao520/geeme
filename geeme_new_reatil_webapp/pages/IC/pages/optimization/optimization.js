// pages/IC/pages/goodProduct/goodProduct.js
var apiAction = null, util = null;
Page({
  data: {
    advId: null,
    photo: null,
    title: '优选推荐',
    goodsList: []
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.data.advId = options.advId;
    this.getAdDetailByAdId().then(res => {
      this.$setData(res)
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    this.data = null;
  },

  //获取广告
  getAdDetailByAdId(){
    let {advId} = this.data,
        storeId = wx.$getStorage('storeId'),
        params = {adId: advId,storeId};
    return apiAction.getAdDetailByAdId(params).then(res => {
      if(res.success){
        wx.setNavigationBarTitle({ title: res.title})
        return { goodsList: res.adGoodsForWeappList,photo: res.photo}
      }else{
        return {}
      }
    })
  },
  prevent() { }
})