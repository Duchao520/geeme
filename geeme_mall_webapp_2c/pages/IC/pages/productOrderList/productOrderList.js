// pages/IC/pages/productOrderList/productOrderList.js
var apiAction = null, util = null, app = null;
Page({
  $name: 'productOrderList',
  data: {
    // tabbar
    tabList: ['全部', '待付款', '待发货', '待收货', '待评价', '待拼单', '已完成'],
    // request相关参数
    orderStatusArr: ['ALL', 'WAITING_PAY', 'WAITING_DELIVER', 'WAITING_CONFIRM', 'WAITING_ASSESSMENT', 'GROUP_BUY_WAIT', 'FINISHED'], // 另还有FINISHED已完成状态，但不需要传递
    currentPage: 0,
    pageSize: 10,
    // response
    orderList: [],
    total: 0,
    // 加载更多相关
    flag: false,
    // 当前选中的tab
    currentTab: 0,
    // 搜索关键字
    keywords: '',
    // 是否显示缺省图片
    isNothing: false,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    let renderData = {};
    if (options.tabIndex) {
      const index = Number(options.tabIndex)
      this.data.currentTab = index;
      renderData.currentTab = index;
    }
    app.getPhone(() => {
      this.getOrderList().then(res => {
        Object.assign(renderData,res);
        this.$setData(renderData);
        return renderData;
      })
    })
    this.$on('orderConfirm', this.orderConfirm)
    this.$on('orderCancel', this.orderCancel)
    this.$on('orderEvaluate', this.orderEvaluate)
    this.$on('orderRefund', this.orderRefund)
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  search(e) {
    this.$setData({
      currentPage: 0,
      keywords: e.detail,
      orderList: []
    })
    this.getOrderList().then(res => {this.$setData(res); return res;})
  },
  // 切换tab
  switchTab(e) {
    this.setCurrentTab(e.detail.index)
  },
  // 设置当前tab
  setCurrentTab(index = this.data.currentTab) {
    this.setData({
      currentTab: index,
      currentPage: 0,
      orderList: []
    })
    this.getOrderList().then(res => { this.$setData(res); return res; })
  },
  // 点击去产品订单详情
  toproductOrderDetail(e) {
    this.$route('/pages/IC/pages/productOrderDetail/productOrderDetail', {
      orderId: e.currentTarget.dataset.id
    })
  },
  // 获取产品订单列表
  getOrderList() {
    let {
      currentPage,
      pageSize,
      keywords,
      currentTab
    } = this.data
    const data = {
      currentPage,
      pageSize,
      keywords,
      orderStatus: this.data.orderStatusArr[currentTab]
    }
    wx.showLoading()
    return apiAction.getProductOrderList(data).then(data => {
      wx.hideLoading()
      const isNothing = currentPage == 0 && (!data.productOrderInfoList || !data.productOrderInfoList.length)
      this.data.total = data.total
      this.data.flag = false
      return {
        orderList: this.data.orderList.concat(data.productOrderInfoList),
        isNothing,
      }
    })
  },
  orderEvaluate(res) {
    const i = this.getIndexById(res.id)
    if (this.data.currentTab === 0) {
      this.data.orderList[i].orderStatus = "FINISHED"
      this.$setData({
        orderList: this.data.orderList
      })
    } else {
      this.spliceItem(i)
    }
  },
  orderConfirm(res) {
    const i = this.getIndexById(res.id)
    if (this.data.currentTab == 0) {
      this.data.orderList[i].orderStatus = "WAITING_ASSESSMENT"
      this.$setData({
        orderList: this.data.orderList
      })
    } else {
      this.spliceItem(i)
    }
  },
  orderCancel(res) {
    const i = this.getIndexById(res.id)
    this.spliceItem(i)
  },
  orderRefund(res) {
    const i = this.getIndexById(res.id)
    this.data.orderList[i][res.type] = true
    this.$setData({
      orderList: this.data.orderList
    })
  },
  getIndexById(id) {
    for (let i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].id == id) {
        return i
      }
    }
  },
  // 使index下标的订单从视图中删除
  spliceItem(index) {
    this.data.orderList.splice(index, 1)
    this.$setData({
      orderList: this.data.orderList
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if ((this.data.currentPage + 1) * this.data.pageSize >= this.data.total) return
    if (this.data.flag) return;
    this.data.flag = true;
    this.data.currentPage++;
    this.getOrderList().then(res => { this.$setData(res); return res; });
  },
  // 分享拼团
  onShareAppMessage(e) {
    const product = e.target.dataset.item
    let path = `/pages/IC/pages/productdetails/productdetails?productId=${product.productId}&isProduct=1`
    return {
      title: product.title,
      path,
      imageUrl: util.getImageUrl(product.cycleImage[0]),
    }
  }
})