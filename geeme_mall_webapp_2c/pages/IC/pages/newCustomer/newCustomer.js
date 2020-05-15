var apiAction = null, util = null , app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandId: null,
    goodsInfoList: [],
    groupPurchaseGoodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();

    this.getBrand();

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
    this.data = null;

  },
  
  getBrand(){
    app.getBrand((brand) => {
      this.data.brandId = brand.brandId;
      this.getBrandGroupPurchaseGoodsList()
    })
  },

  getBrandGroupPurchaseGoodsList(){
    apiAction.getBrandGroupPurchaseGoodsList({brandId: this.data.brandId}).then(res => {
      this.setData({
        goodsInfoList: res.goodsInfoList ? res.goodsInfoList : [],
        groupPurchaseGoodsList: res.groupPurchaseGoodsList ? res.groupPurchaseGoodsList : []
      })
    })
  },

  jumpProductDetail(e){
    let {type,id} = e.currentTarget.dataset;
    if (type == 'production'){
      wx.$route('/pages/IC/pages/productdetails/productdetails', { productId: id, isProduct: 1})
    }else{
      wx.$route('/pages/IC/pages/productdetails/productdetails', { productId: id})
    }
  }
})