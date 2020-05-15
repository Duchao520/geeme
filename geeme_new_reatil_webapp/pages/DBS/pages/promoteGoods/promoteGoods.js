var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellGoodsInfoForSellerList: [],
    sellerId: null,
    logo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    app.getBrand((brand) => {
      this.setData({logo: brand.logo})
    })
    this.getSellerGoodsListForSeller()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
    app = null;
  },


  getSellerGoodsListForSeller(){
    apiAction.getSellerGoodsListForSeller().then(res => {
      this.setData({ sellGoodsInfoForSellerList: res.sellGoodsInfoForSellerList,sellerId: res.sellerId})
    })
  },
  naviageToDetail(e){
    let { goods } = e.currentTarget.dataset;
    wx.$setStorage('goods', goods);
    wx.navigateTo({
      url: '/pages/DBS/pages/promoteGoodsDetail/promoteGoodsDetail?sellerId=' + this.data.sellerId
    })
  }
})