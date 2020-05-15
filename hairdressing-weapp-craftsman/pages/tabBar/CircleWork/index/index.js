// pages/tabBar/CircleWork/index/index.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    active: 0,
    tabList: ['热门', '关注', '本店'],
    worksList: [],
    // 当前tab
    curTab: 0,
    // 加载更多相关
    flag: false,
    currentPage: 1,
    pageSize: 10,
    total: 0,
    // 搜索关键字
    keyWord: '',
    scrollTop: null,
    isFixed: false,
    ifDefault: false,
  },
  onLoad(options) {
    if (this.$take('releasedWorks')) {
      this.switchTab(null, 1)
    } else {
      this.getStaffHotSimpleDynamic()
    }
  },
  onShow() {
    if (this.$take('releasedWorks')) {
      this.switchTab(null, 1)
    }
  },
  onPageScroll(e) {
    this.$setData({
      scrollTop: e.scrollTop
    })
  },
  // 改变吸附状态
  changeFix(e) {
    this.setData({
      isFixed: e.detail
    })
  },
  search(e) {
    this.data.keyWord = e.detail
    this.data.currentPage = 1
    this.$setData({
      worksList: [],
      curTab: e.detail ? -1 : 0,
    })
    this.getDynamic()
  },

  // 切换tab
  switchTab(e, index) {
    this.setData({
      worksList: [],
      keyWord: '',
      curTab: index || e.detail.index,
      ifDefault: false,
    })
    this.data.currentPage = 1;
    this.getDynamic();
  },

  // 获取动态（总）
  getDynamic() {
    wx.showLoading()
    if (this.data.keyWord) {
      return this.weStaffSearchDynamics()
    } else {
      switch (this.data.curTab) {
        case 0:
          return this.getStaffHotSimpleDynamic();
        case 1:
          return this.getStaffAttentiveSimpleDynamic();
        case 2:
          return this.getStaffMyShopSimpleDynamic();
      }
    }
  },

  // 获取搜索动态
  weStaffSearchDynamics() {
    const {
      keyWord,
      currentPage,
      pageSize
    } = this.data
    const params = {
      keyWord,
      pageNum: currentPage,
      pageSize
    }
    fetch.weStaffSearchDynamics(params).then(data => {
      this.render(data.simpleStaffDynamicWork, data.total)
    })
  },
  // 获取本店动态
  getStaffMyShopSimpleDynamic() {
    fetch.getStaffMyShopSimpleDynamic(this.data.currentPage, this.data.pageSize).then(data => {
      this.render(data.weStaffSimpleDynamicList, data.total)
    })
  },
  // 获取关注动态
  getStaffAttentiveSimpleDynamic() {
    fetch.getStaffAttentiveSimpleDynamic(this.data.currentPage, this.data.pageSize).then(data => {
      this.render(data.weStaffSimpleDynamicList, data.total)
    })
  },
  // 获取热门动态
  getStaffHotSimpleDynamic() {
    fetch.getStaffHotSimpleDynamic(this.data.currentPage, this.data.pageSize).then(data => {
      this.render(data.weStaffSimpleDynamicList, data.total)
    })
  },
  render(list, total) {
    wx.hideLoading()
    if (list && list.length) {
      this.$setData({
        worksList: this.data.worksList.concat(list),
        total: total,
      })
    } else {
      this.$setData({
        ifDefault: true
      })
    }
    this.data.flag = false
  },

  /**
   * Release->去发布
   */
  toRelease() {
    wx.navigateTo({
      url: '/pages/SC/pages/releaseIndex/releaseIndex'
    })
  },
  onReachBottom() {
    if (this.data.flag) return
    if (this.data.currentPage * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++;
    this.getDynamic()
  },
})