const apiAction = require('../../../../utils/apiAction.js')
const util = require('../../../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    pageSize: 10,
    dynamicCategory: '',
    hotS: true,
    dynamicList: [],
    brandId: null,
    businessCategoryInfoList: [{ showName: '推荐', id: '' }],   //tab标签,
    ifShowDefault: false,
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBrand()
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const tabBarObj = this.getTabBar();
      let tabBar = tabBarObj.data.tabBar.filter(ele => ele.showFlag == 1);
      let index = tabBar.findIndex(value => {
        return value.pagePath == "/pages/tabBar/dynamic/index/index"
      })
      tabBarObj.setData({
        selected: index == -1 ? app.globalData.selected : index
      })
    }
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.currentPage = 1;
    this.$setData({ dynamicList: [] })
    this.getHotSimpleDynamic().then(res => {
      wx.stopPullDownRefresh();
      this.$setData(res)
    })
  },
  onShareAppMessage() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentPage * this.data.pageSize >= this.data.dynamicListTotal) return
    if (this.data.flag) return;
    this.data.flag = true;
    this.data.currentPage++;
    this.getHotSimpleDynamic('nextPage');
  },

  getBrand() {
    app.getBrand((brand) => {
      this.data.brandId = brand.brandId;
      util.PromiseAll([this.getStaffDynamicCategoryList(), this.getHotSimpleDynamic()]).then(res => {
        Object.assign(res, { isShow: true })
        this.$setData(res)
      })
    })
  },

  // 请求作品动态（现在封面动态就是热门动态）
  getHotSimpleDynamic(type) {
    let params = {
      currentPage: this.data.currentPage,
      pageSize: this.data.pageSize,
      dynamicCategory: this.data.dynamicCategory,
      hotS: this.data.hotS
    }
    let response = {};
    return apiAction.getSimpleDynamic(params).then(data => {
      wx.stopPullDownRefresh()
      response.flag = false;
      response.dynamicListTotal = data.total;
      if (type == 'nextPage') {
        response.dynamicList = this.data.dynamicList.concat(data.weSimpleDynamicList);
        this.setData(response)
      } else {
        response.dynamicList = data.weSimpleDynamicList;
        return response;
      }
    }).catch(error => {
      return error;
    })
  },
  getStaffDynamicCategoryList() {
    let { businessCategoryInfoList } = this.data;
    return apiAction.getStaffDynamicCategoryList({ brandId: this.data.brandId }).then(res => {
      if (res.staffDynamicWorksCategoryList) {
        businessCategoryInfoList = businessCategoryInfoList.concat(res.staffDynamicWorksCategoryList);
      }
      return { businessCategoryInfoList }
    })
  },
  switchTab(e) {
    let { id, index } = e.detail;
    if (index == 0) {
      this.data.hotS = true
    } else {
      this.data.hotS = false;
    }
    this.data.dynamicCategory = id;
    this.data.currentPage = 1;
    this.$setData({ dynamicList: [] })
    this.getHotSimpleDynamic().then(res => {
      this.$setData(res)
    })
  }
})