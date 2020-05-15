var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: ['今日','本月','今年','总计'],
    queryParams: {
      brandId: null,
      topDuration: 'DAY',
      currentPage: 0,
      pageSize: 10
    },
    infoForPagedList: [],
    total: null,
    Switcher: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    app.getBrand(brand => {
      this.data.queryParams.brandId = brand.brandId;
    })
    this.switchTab();
    this.shareholderTopInfoPagedList().then(res => {
      if (res.infoForPagedList){
        this.setData(res);
      }
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
    let { infoForPagedList,total} = this.data;
    if(infoForPagedList.length >= total) return;
    this.getSellPerformanceForBoard('nextPage').then(res => {
      if (res.infoForPagedList){
        infoForPagedList = infoForPagedList.concat(res.infoForPagedList);
        this.setData({ infoForPagedList})
      }
    })
  },

  init(e){
    let { index } = e.detail;
    this.switchTab(index);
    this.shareholderTopInfoPagedList().then(res => {
      if (res.infoForPagedList) {
        this.setData(res);
      }else{
        this.setData({ infoForPagedList: []})
      }
    })
  },

  switchTab(index = 0){
    let {queryParams} = this.data;
    switch(index){
      case 0:  //今日
        queryParams.topDuration = 'DAY';
        break;
      case 1 : //本月
        queryParams.topDuration = 'MONTH';
        break;
      case 2 : //今年
        queryParams.topDuration = 'YEAR';
        break;
      case 3: //总计
        queryParams.topDuration = 'ALL';
        break;
      default: 
        queryParams.topDuration = 'DAY';
    };
    this.data.queryParams = queryParams;
  },

  shareholderTopInfoPagedList(pageType = 'firstPage'){
    let {queryParams,Switcher} = this.data;
    if(!Switcher) return Promise.resolve({})
    if(pageType == 'firstPage'){
      queryParams.currentPage = 0;
    }else{
      queryParams.currentPage++;
    };
    this.data.queryParams = queryParams;
    this.data.Switcher = false;
    return apiAction.shareholderTopInfoPagedList(queryParams).then(res => {
      this.data.Switcher = true;
      return res;
    })
  }
})