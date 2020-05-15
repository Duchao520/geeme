var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryParams: {
      keyword: null,
      pageNum: 1,
      pageSize: 10,
      searchType: 2
    },
    dataBeanList: [],
    total: null,
    Switcher: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.getMyCustomerSellInfo().then(res => {
      if (res.dataBeanList) {
        this.setData(res);
      }
    })
  },

  onUnload() {
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
    let { dataBeanList, total } = this.data;
    if (dataBeanList.length >= total) return;
    this.getMyCustomerSellInfo('nextPage').then(res => {
      if (res.dataBeanList) {
        dataBeanList = dataBeanList.concat(res.dataBeanList);
        this.setData({ dataBeanList });
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  search(e) {
    let { detail } = e,
      { queryParams } = this.data;
    queryParams.keyword = detail;
    this.data.queryParams = queryParams;
    this.getMyCustomerSellInfo().then(res => {
      if (res.dataBeanList) {
        this.setData(res);
      }
    })
  },

  getMyCustomerSellInfo(pageType = 'firstPage') {
    let { queryParams, Switcher, total, dataBeanList } = this.data;
    if (!Switcher) return Promise.resolve({});
    if (pageType == 'firstPage') {
      queryParams.pageNum = 1;
    } else {
      queryParams.pageNum++;
    };
    this.data.queryParams = queryParams;
    this.data.Switcher = false;
    return apiAction.getMyCustomerSellInfo(queryParams).then(res => {
      this.data.Switcher = true;
      return res;
    })
  }
})