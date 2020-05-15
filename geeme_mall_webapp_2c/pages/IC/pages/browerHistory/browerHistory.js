var apiAction = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandId: null,
    productInfoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    app = getApp();

    app.getBrand(brand => {
      this.data.brandId = brand.brandId;
      this.getProductBrowsingHistoryList();
    })
  },




  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    app = null;
  },

  getProductBrowsingHistoryList(){
    let params = {
      brandId: this.data.brandId,
      keepDay: 7,
      goodsTypeScope: 'production'
    };
    apiAction.getProductBrowsingHistoryList(params).then(res => {
      res.productInfoList.forEach(ele => {
        ele.type = 'product';
        ele.specialPrice = ele.showPrice;
        ele.price = ele.showPriceMax;
      })
      this.setData(res)
    })
  }
})