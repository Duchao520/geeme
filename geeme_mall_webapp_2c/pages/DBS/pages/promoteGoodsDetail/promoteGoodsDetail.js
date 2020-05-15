var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: null,
    sellerId: null,
    couponSendRecordList: [],
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
    this.data.sellerId = options.sellerId;
    this.data.goods = wx.$getStorage('goods');
    this.data.goods.prospectIncome = util.AccMul(util.AccMul(this.data.goods.sellPercent, this.data.goods.price),0.01)
    this.getGoodsCoupons().then(res => {
      this.setData({ goods: this.data.goods, couponSendRecordList: res.couponSendRecordList});
    })
  },

  onUnload: function () {
    apiAction = null;
    util = null;
    app = null;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let url;
    if(this.data.goods.goodsType == 3){
      url = `/pages/VIP/pages/VipCardDetail/VipCardDetail?id=${this.data.goods.goodsId}&SId=${this.data.sellerId}`;
    }else{
      url = `/pages/IC/pages/productdetails/productdetails?productId=${this.data.goods.goodsId}&isP=${this.data.goods.goodsType == 1 ? 1 : ''}&SId=${this.data.sellerId}`;
    }
    return {
      title: this.data.goods.goodsName,
      path: url,
      imageUrl: util.getImageUrl(this.data.goods.cycleImageList[0])
    }
  },
  //获取优惠券
  getGoodsCoupons() {
    let { goods } = this.data,
      params = {
        goodsId: goods.goodsId,
        goodsTypeScope: goods.goodsType == 1 ? 'production' : 'service',
        storeId: goods.storeId
      };
    return apiAction.getGoodsCoupons(params).then(res => {
      let { couponSendRecordList } = res;
      if (couponSendRecordList.length > 0) {
        return { couponSendRecordList }
      }
      return {}
    })
  },
  // 分享画报
  sharePic() {
    this.$route('/pages/DBS/pages/agentPic/agentPic',{sellerId:this.data.sellerId})
    // 避免手机卡顿做个500ms延时
    setTimeout(() => {
      this.$setData({
        ifShowSharePop: false
      })
    }, 500)
  },
  navigateToDetail(){
    let url;
    if (this.data.goods.goodsType == 3) {
      url = `/pages/VIP/pages/VipCardDetail/VipCardDetail?id=${this.data.goods.goodsId}`;
    } else {
      url = `/pages/IC/pages/productdetails/productdetails?productId=${this.data.goods.goodsId}&isP=${this.data.goods.goodsType == 1 ? 1 : ''}`;
    }
    wx.navigateTo({
      url: url
    })
  }
})