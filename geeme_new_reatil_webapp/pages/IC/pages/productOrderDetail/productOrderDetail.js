// pages/IC/pages/productOrderDetail/productOrderDetail.js
var apiAction = null, util = null;
Page({
  $name:'productOrderDetail',
  data: {
    orderId:0,
    info:null,
    logistics:null,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.data.orderId = options.orderId
    this.getOrderInfo()
    this.$on('orderConfirm', this.getOrderInfo)
    this.$on('orderCancel', this.orderCancel)
    this.$on('orderEvaluate', this.getOrderInfo)
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    this.data = null;
  },
  orderCancel(){
    wx.navigateBack({
      delta: 1
    })
  },
  getOrderInfo(){
    wx.showLoading()
    return apiAction.getProductOrderBasicInfoByOrderId(this.data.orderId).then(info => {
      wx.hideLoading()
      // 若有物流记录id则请求物流信息
      if (info.logisticsId){
        this.getLogistics(info.logisticsId).then(logistics => {
          Object.assign(logistics, {
            info
          });
          this.setData(logistics);
          return logistics
        })
      }else{
        this.setData({info})
        return {info}
      }
    })
  },
  getLogistics(logisticsId){
    return apiAction.productOrderLogisticsWeGet(logisticsId).then( data => {
      return {
        logistics: data
      }
    })
  },
  toProductSpecification(){
    wx.navigateTo({
      url: `/pages/IC/pages/productSpecification/productSpecification?id=${this.data.info.id}`
    })
  },
  jumpMyEvaluation(){
    const goodsInfo = {
      image:this.data.info.cycleImage[0],
      title:this.data.info.title,
      specificationName:this.data.info.specificationName
    }
    this.$route('/pages/RC/pages/myEvaluation/myEvaluation', {goodsInfo:JSON.stringify(goodsInfo), isProduct:1, orderId:this.data.info.id})
  },
  toProductDetail(){
    this.$route('/pages/IC/pages/productdetails/productdetails', {productId:this.data.info.productId, isProduct:1})
  },
  // 分享拼团
  onShareAppMessage(e) {
    const product = e.target.dataset.item
    let path = `/pages/IC/pages/productdetails/productdetails?productId=${product.productId}&isProduct=1`
    return {
      title: product.title,
      path,
      imageUrl: util.getImageUrl(product.cycleImage[0]),
    }
  }
})