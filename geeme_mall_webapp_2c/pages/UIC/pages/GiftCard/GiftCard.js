var apiAction = null,util = null,app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['可自用','可赠送','可领取'],
    tabIndex: 0,
    brand: null,
    activityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js')
    util = require('../../../../utils/util.js')
    app = getApp();
    
    app.getBrand((brand) => {
      this.setData({brand})
    })
    this.weappGetBrandCustomerCard().then(res => {
      this.setData(res)
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
    app = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  timestampTotime(timestamp){
    var date = new Date(timestamp),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate();
    return Y + '/' + M + '/' + D
  },

  switchTab(e){
    let {index} = e.detail,promise;
    this.setData({ activityList: []})
    wx.showLoading({
      title: '加载中',
    })
    switch(index){
      case 0:     //可自用
        promise = this.weappGetBrandCustomerCard();
        break;
      case 1:     //可赠送
        promise = this.getGiftCardActivityForSend();
        break;
      case 2:     //可领取
        promise = this.getAvailableGiftCardActivity();
        break;
    }
    promise.then(res => {
      wx.hideLoading();
      Object.assign(res,{tabIndex: index})
      this.setData(res)
    })
  },

  /**
   * 获取可自用礼品卡
   */
  weappGetBrandCustomerCard(){
    const params = {giftCard: true};
    return apiAction.weappGetBrandCustomerCard(params).then(res => {
      if (res.listCustomerCardDetail && res.listCustomerCardDetail.length > 0){
        
        res.listCustomerCardDetail.forEach(ele => {
          ele.timeTo = this.timestampTotime(ele.finishTime);
          ele.validityTime = ele.createTime.split(' ')[0].replace('-', '年').replace('-', '月') + '日-' + ele.timeTo.replace('/', '年').replace('/', '月') + '日';
        })
        return { activityList: res.listCustomerCardDetail }
      }else{
        return {}
      }
    })
  },

  /**
   * 获取可赠送礼品卡
   */
  getGiftCardActivityForSend(){
    let {brand} = this.data;
    return apiAction.getGiftCardActivityForSend({ brandId: brand.brandId }).then(res => {
      if (res.success) {
        return { activityList: res.activityList };
      } else {
        return {}
      }
    })
  },

  /**
   * 获取可领取礼品卡
   */
  getAvailableGiftCardActivity() {
    let { brand } = this.data;
    return apiAction.getAvailableGiftCardActivity({ brandId: brand.brandId }).then(res => {
      if(res.success){
        return { activityList: res.activityList};
      }else{
        return {}
      }
    })
  },

  jumpDetail(e){
    let {item} = e.currentTarget.dataset,
        {tabIndex} = this.data;
    wx.$place('card',item);
    wx.$route('/pages/UIC/pages/GiftCardDetail/GiftCardDetail',{tabIndex});
  }
})