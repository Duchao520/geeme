// pages/SC/pages/searchresults/searchresults.js
const apiAction = require('../../../../utils/apiAction.js');
const app = getApp()
Page({
  $name:'searchresults',
  data: {
    list:[],
    latitude:0,
    longitude:0,
    keyword:''
  },
  onLoad(options) {
    this.$setData({
      keyword: options.keyword
    })
    this.search(options.keyword);
  },
  confirm(e){
    const keyword = e.detail
    if (!keyword.length) {
      return;
    }
    app.addSearchHistory('store', keyword)
    this.search(keyword)
  },
  search(keyword){
    let params = {
      city: wx.$getStorage('address').city,
      keyword: keyword
    }
    wx.$showLoading()
    apiAction.searchStoreListByStoreLikeName(params).then(data => {
      wx.$hideLoading()
      let address = wx.getStorageSync('address');
      this.$setData({
        latitude: address.latitude,
        longitude: address.longitude,
        list: data.shopInfoList
      })
    })
  }
})