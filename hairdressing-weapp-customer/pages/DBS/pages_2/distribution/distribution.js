var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CUSTOMER_SELLER: true,   //是否是股东
    brand: null,
    shareholderId: null,
    options: ['今日','本月','本年','总计'],
    allBonus: null,  //累计已分红
    currentMonthExpectedBonus: null,  //当月预估待分红
    expectedBonus: null,  //预计待分红
    lastMonthExpectedBonus: null,  //上月预计待分红
    bounsDuration: null,
    bouns: null,
    invite: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    app.getBrand(brand => {
      this.data.brand = brand;
      this.weGetShareholderInfoByBrandCustomerId().then(customerInfo => {
        util.PromiseAll([
          this.weGetBonusStatisticsByDuration(),
          this.weGetBonusStatistics(),
          this.weGetReferralFeeStatisticsByDuration()
        ]).then(res => {
          this.setData(res)
        })
      })
    })
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


  /**
   * 查询股东信息
   */
  weGetShareholderInfoByBrandCustomerId(){
    const {brand} = this.data;
    return apiAction.weGetShareholderInfoByBrandCustomerId(brand.brandId).then(res => {
      if (res.shareholderInfo){
        this.data.shareholderId = res.shareholderInfo.id;
        wx.$place('shareholderId', this.data.shareholderId)
      }
    })

  },

  /**
   * 股东分红头统计
   */
  weGetBonusStatistics(){
    return apiAction.weGetBonusStatistics(this.data.shareholderId)
  },

  /**
   * 股东分红统计
   */
  weGetBonusStatisticsByDuration(duration = 'DAY'){
    const params = {
      duration,
      shareholderId: this.data.shareholderId
    }
    return apiAction.weGetBonusStatisticsByDuration(params).then(res => {
      return {bouns: res}
    })
  },

  /**
   * 股东介绍费统计
   */
  weGetReferralFeeStatisticsByDuration(duration = 'DAY') {
    const params = {
      duration,
      shareholderId: this.data.shareholderId
    }
    return apiAction.weGetReferralFeeStatisticsByDuration(params).then(res => {
      return { invite: res }
    })
  },

  switchBouns(e){
    let {index} = e.detail,
        duration = 'DAY';
    switch(index){
      case 0: duration = 'DAY';break;
      case 1: duration = 'MONTH'; break;
      case 2: duration = 'YEAR'; break;
      case 3: duration = 'ALL'; break;
      default: duration = 'DAY';
    };
    this.weGetBonusStatisticsByDuration(duration).then(res => {
      this.setData(res);
    })
  },
  switchInvite(e) {
    let { index } = e.detail,
      duration = 'DAY';
    switch (index) {
      case 0: duration = 'DAY'; break;
      case 1: duration = 'MONTH'; break;
      case 2: duration = 'YEAR'; break;
      case 3: duration = 'ALL'; break;
      default: duration = 'DAY';
    };
    this.weGetReferralFeeStatisticsByDuration(duration).then(res => {
      this.setData(res);
    })
  },
  getSellPerformance(){
    return apiAction.getSellPerformance().then(res => {
      return res;
    })
  },
  //获取推广明细和奖励明细
  getSellPerformanceDetail(type){
    let params = {
      invite: type
    };
    apiAction.getSellPerformanceDetail(params).then(res => {

    })
  },

  getSellerGoodsListForSeller(){
    return apiAction.getSellerGoodsListForSeller().then(res => {
      if (res.sellerId){
        return {CUSTOMER_SELLER: true}
      }else{
        return { CUSTOMER_SELLER: false }
      }
    })
  },

  //收入明细
  navigateToDetailIncome() {
    wx.navigateTo({
      url: '/pages/DBS/pages/detailIncome/detailIncome',
    })
  },
  //投资保证金
  navigateToPromoteGoods() {
    wx.navigateTo({
      url: '/pages/DBS/pages_2/depositCash/depositCash',
    })
  },
  //我的客户
  navigateToCustomer() {
    wx.navigateTo({
      url: '/pages/DBS/pages_2/customer/customer',
    })
  },
  //我的推广员
  navigateToMyAgent() {
    wx.navigateTo({
      url: '/pages/DBS/pages_2/myAgent/myAgent',
    })
  },
  //排行榜
  navigateToRank() {
    wx.navigateTo({
      url: '/pages/DBS/pages_2/rank/rank',
    })
  },
  //推广提成明细
  navigateToAgentDetail() {
    wx.navigateTo({
      url: '/pages/DBS/pages_2/agentDetail/agentDetail',
    })
  },
  //邀请奖励明细
  navigateToInviteDetail() {
    wx.navigateTo({
      url: '/pages/DBS/pages_2/inviteDetail/inviteDetail',
    })
  },

})