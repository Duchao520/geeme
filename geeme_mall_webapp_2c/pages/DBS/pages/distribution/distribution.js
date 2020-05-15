var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CUSTOMER_SELLER: false,   //是否是推客
    options: ['今日','本月','本年','总计'],
    totalPerformance: null,  //累计已返佣
    expectTotalPerformance: null,  //预估待返佣
    lastMonthExpectPerformance: null,  //上月预估返佣
    monthExpectPerformance: null,  //本月预估返佣
    todayInvite: null,   //今日邀请奖励
    monthInvite: null, //
    yearInvite: null,
    totalInvite: null,
    todaySell: null,   //今日邀请奖励
    monthSell: null, //
    yearSell: null,
    totalSell: null,
    sell: null,
    invite: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.getSellerGoodsListForSeller().then(res => {
      if(res.CUSTOMER_SELLER){
        util.PromiseAll([
          this.getSellPerformance()
        ]).then(sellDetail => {
          Object.assign(res, { sell: sellDetail.todaySell, invite: sellDetail.totalInvite })
          Object.assign(res,sellDetail)
          this.$setData(res)
        })
      }else{
        this.$setData(res)
      }
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
  switchSell(e){
    let {index} = e.detail,
        sell = null;
    switch(index){
      case 0: sell = this.data.todaySell;break;
      case 1: sell = this.data.monthSell; break;
      case 2: sell = this.data.yearSell; break;
      case 3: sell = this.data.totalSell; break;
      default:sell = this.data.totalSell;
    };
    this.setData({sell: sell});
  },
  switchInvite(e) {
    let { index } = e.detail,
      invite = null;
    switch (index) {
      case 0: invite = this.data.todayInvite; break;
      case 1: invite = this.data.monthInvite; break;
      case 2: invite = this.data.yearInvite; break;
      case 3: invite = this.data.totalInvite; break;
      default: invite = this.data.totalInvite;
    };
    this.setData({ invite: invite });
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
  //推广商品
  navigateToPromoteGoods() {
    wx.navigateTo({
      url: '/pages/DBS/pages/promoteGoods/promoteGoods',
    })
  },
  //我的客户
  navigateToCustomer() {
    wx.navigateTo({
      url: '/pages/DBS/pages/customer/customer',
    })
  },
  //我的推广员
  navigateToMyAgent() {
    wx.navigateTo({
      url: '/pages/DBS/pages/myAgent/myAgent',
    })
  },
  //排行榜
  navigateToRank() {
    wx.navigateTo({
      url: '/pages/DBS/pages/rank/rank',
    })
  },
  //推广提成明细
  navigateToAgentDetail() {
    wx.navigateTo({
      url: '/pages/DBS/pages/agentDetail/agentDetail',
    })
  },
  //邀请奖励明细
  navigateToInviteDetail() {
    wx.navigateTo({
      url: '/pages/DBS/pages/inviteDetail/inviteDetail',
    })
  },

})