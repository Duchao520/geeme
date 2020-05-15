// pages/UIC/pages/mycollection/mycollection.js
var apiAction = null, util = null;
Page({
  data: {
    tabList: ['美购', '作品'],
    tabIndex: 0,
    products: {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      flag: false
    },
    works: {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isFirstShow: false,
      flag: false,
    }
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    this.initPage()
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    this.data = null;
  },
  initPage() {
    util.PromiseAll([this.fetchProducts(),this.fetchWorks()]).then(res => {
      this.$setData(res);
      return res;
    })
  },
  onPullDownRefresh() {
    if (this.data.tabIndex == 0) {
      this.$setData({
        'products.list': [],
      })
      this.data.products.currentPage = 1
      this.data.products.total = 0
      this.data.products.flag = false
      this.fetchProducts().then(res => {this.$setData(res);return res})
    } else {
      this.$setData({
        'works.list': [],
      })
      this.data.works.currentPage = 1
      this.data.works.total = 0
      this.data.works.flag = false
      this.fetchWorks().then(res => { this.$setData(res); return res })
    }
  },
  fetchProducts() {
    const {
      currentPage,
      pageSize
    } = this.data.products

    wx.showLoading()
    return apiAction.getBrandCustomerCollectGoods({
      currentPage,
      pageSize
    }).then(data => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      this.data.products.flag = false
      this.data.products.total = data.totals
      if (data.goodsCollectionList && data.goodsCollectionList.length) {
        let list = currentPage == 1 ? data.goodsCollectionList : this.data.products.list.concat(data.goodsCollectionList)
        return {
          'products.list': list
        }
      }else{
        return {}
      }
    })
  },
  fetchWorks() {
    const {
      currentPage,
      pageSize
    } = this.data.works

    wx.showLoading()
    return apiAction.getCollectSimpleDynamic({
      currentPage,
      pageSize
    }).then(data => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      this.data.works.flag = false
      this.data.works.total = data.total
      if (data.weSimpleDynamicList && data.weSimpleDynamicList.length) {
        let list = currentPage == 1 ? data.weSimpleDynamicList : this.data.works.list.concat(data.weSimpleDynamicList)
        return {
          'works.list': list
        }
      }else{
        return {}
      }
    })
  },
  switchTab(res) {
    const {
      index
    } = res.detail
    
    if (index == 1 && !this.data.works.isFirstShow) {
      this.$setData({
        'works.isFirstShow': true,
        tabIndex: index
      })
    }else{
      this.$setData({
        tabIndex: index
      })
    }
  },
  jumpPurchase(){
    wx.switchTab({
      url: '/pages/tabBar/home/index/index',
    })
  },
  onReachBottom() {
    let currentPage, pageSize
    let obj, attr, fn
    switch (this.data.tabIndex) {
      case 0:
        obj = this.data.products
        attr = 'products'
        fn = this.fetchProducts
        break;
      case 1:
        obj = this.data.works
        attr = 'works'
        fn = this.fetchWorks
        break;
    }
    if (obj.flag) return
    if (obj.currentPage * obj.pageSize >= obj.total) return
    obj.currentPage++
    obj.flag++
    fn().then(res => { this.$setData(res); return res })
  }
})