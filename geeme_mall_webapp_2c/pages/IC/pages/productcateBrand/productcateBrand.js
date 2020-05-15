// pages/IC/pages/productcatedetails/productcatedetails.js
var apiAction = null,app = null;
Page({
  data: {
    brandId: '',
    serviceList: [],
    // one过滤数据
    listOneRight: [],
    flagOne: false,
    currentOne: null,
    // two过滤数据
    listTwo: ['智能排序', '价格最低', '评分最高', '评价最多'],
    flagTwo: false,
    currentTwo: null,
    // three过滤的数据
    flagThree: false
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    app = getApp();
    app.getBrand((brand) => {
      this.data.brandId = brand.brandId;
      this.getServiceList(options.classId)
    })
    wx.setNavigationBarTitle({
      title: options.className,
    })
  },
  onUnload() {          //清内存
    apiAction = null;
    app = null;
    this.data = null;
  },
  // 获取分类列表
  getServiceList(classId) {
    apiAction.getBrandServiceListByStoreIdAndSortInfo(this.data.brandId,null,classId).then(data => {
      this.$setData({
        serviceList: data.serviceInfos
      })
    })
  },

  /**
   * 跳转商品详情
   */
  jumpProductDetails(e) {
    let productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/IC/pages/productdetails/productdetails?productId=' + productId
    })
  },

  /**
   * 点击筛选
   */
  clickFilter(e) {
    let type = e.currentTarget.dataset.type;
    if (type == "one") {
      this.setData({
        flagOne: !this.data.flagOne,
        flagTwo: false,
        flagThree: false
      })
    } else if (type == "two") {
      this.setData({
        flagTwo: !this.data.flagTwo,
        flagOne: false,
        flagThree: false
      })
    } else {
      this.setData({
        flagTwo: false,
        flagOne: false,
        flagThree: !this.data.flagThree
      })
    }
  },
  /**
   * one->返回当前
   */
  setOneCurrent() {
    this.setData({
      currentOne: e.detail
    })
    this.close()
  },

  /**
   * two->返回当前
   */
  setTwoCurrent(e) {
    this.setData({
      currentTwo: e.detail
    })
    this.close()
  },

  /**
   * 点击关闭
   */
  close() {
    this.setData({
      flagOne: false,
      flagTwo: false
    })
  },
  /**
   * three->touchMove事件
   */
  filterTouchMove() {
    this.setData({
      flagThree: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})