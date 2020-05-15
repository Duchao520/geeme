var apiAction = null, util = null, app = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryParams: {
      brandId: null,
      currentPage: 1,
      shareholderId: null,
      pageSize: 10
    },
    shareholderBindPagedListList: [],
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
    this.data.queryParams.shareholderId = wx.$takeNotNull('shareholderId');
    app.getBrand(brand => {
      this.data.queryParams.brandId = brand.brandId;
      this.weGetShareholderBindPagedList().then(res => {
        if (res.shareholderBindPagedListList) {
          this.setData(res);
        }
      })
    })
  },

  onUnload(){
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
    let { shareholderBindPagedListList, total} = this.data;
    if(shareholderBindPagedListList.length >= total) return;
    this.weGetShareholderBindPagedList('nextPage').then(res => {
      if (res.shareholderBindPagedListList){
        shareholderBindPagedListList = shareholderBindPagedListList.concat(res.shareholderBindPagedListList);
        this.setData({shareholderBindPagedListList});
      }
    })
  },

  search(e){
    let {detail} = e,
        {queryParams} = this.data;
    queryParams.keyword = detail;
    this.data.queryParams = queryParams;
    this.getMyCustomerSellInfo().then(res => {
      if (res.shareholderBindPagedListList) {
        this.setData(res);
      }
    })
  },

  weGetShareholderBindPagedList(pageType = 'firstPage'){
    let { queryParams, Switcher, total, shareholderBindPagedListList} = this.data;
    if(!Switcher) return Promise.resolve({});
    if(pageType == 'firstPage'){
      queryParams.currentPage = 0;
    }else{
      queryParams.currentPage++;
    };
    this.data.queryParams = queryParams;
    this.data.Switcher = false;
    return apiAction.weGetShareholderBindPagedList(queryParams).then(res =>{
      this.data.Switcher = true;
      return res;
    })
  }
})