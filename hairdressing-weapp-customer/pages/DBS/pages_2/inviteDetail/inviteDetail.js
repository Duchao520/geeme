var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: ['日', '月', '年', '总'],
    queryParams: {
      endTime: null,
      startTime: null,
      invite: true,
      pageNum: 1,
      pageSize: 10
    },
    customerCount: 0,  //付款客户数
    orderCount: 0,    //付款订单数
    orderMoney: 0,    //付款订单金额
    expectPerformance: 0, //预估提成金额
    amount: 0,     //已结算提成
    infoList: [],
    Switcher: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.switchTab();
    this.getSellPerformanceDetail().then(res => {
      if (!res.infoList) {
        res.infoList = [];
      };
      this.setData(res);
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    util = null;
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
    let { infoList, total } = this.data;
    if (infoList.length >= total) return;
    this.getSellPerformanceDetail('nextPage').then(res => {
      if (res.infoList) {
        infoList = infoList.concat(res.infoList);
        this.setData({ infoList })
      }
    })
  },

  init(e) {
    let { index } = e.detail;
    this.switchTab(index);
    this.getSellPerformanceDetail().then(res => {
      if (!res.infoList) {
        res.infoList = [];
      };
      this.setData(res);
    })
  },

  switchTab(index = 0) {
    let { queryParams } = this.data,
      date = new Date(),
      Y = date.getFullYear(),
      M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
      D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
      h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
      m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
      s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    switch (index) {
      case 0:  //今日
        queryParams.startTime = Y + '-' + M + '-' + D + ' ' + '00:00:00';
        queryParams.endTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
        break;
      case 1: //本月
        queryParams.startTime = Y + '-' + M + '-' + '01' + ' ' + '00:00:00';
        queryParams.endTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
        break;
      case 2: //今年
        queryParams.startTime = Y + '-' + '01' + '-' + '01' + ' ' + '00:00:00';
        queryParams.endTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
        break;
      case 3: //总计
        queryParams.startTime = null;
        queryParams.endTime = null;
        break;
      default:
        queryParams.startTime = Y + '-' + M + '-' + D + ' ' + '00:00:00';
        queryParams.endTime = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    };
    this.data.queryParams = queryParams;
  },

  getSellPerformanceDetail(pageType = 'firstPage') {
    let { queryParams, Switcher } = this.data;
    if (!Switcher) return Promise.resolve({})
    if (pageType == 'firstPage') {
      queryParams.pageNum = 1;
    } else {
      queryParams.pageNum++;
    };
    this.data.queryParams = queryParams;
    this.data.Switcher = false;
    return apiAction.getSellPerformanceDetail(queryParams).then(res => {
      this.data.Switcher = true;
      return res;
    })
  }
})