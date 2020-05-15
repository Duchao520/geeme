// pages/UIC/pages/spendorder/spendorder.js
var apiAction = null, util = null, app = null;
Page({
  $name: 'spendorder',
  data: {
    tabList: ['全部', '待结算', '待支付', '已完成'],
    scopes: ['All', 'UnBilling', 'UnPaid', 'Paid'],
    tabIndex: 0,
    // 加载更多
    currentPage: 0,
    pageSize: 10,
    total: 0,
    flag: false,
    // 账单列表
    list: [],
    // 搜索关键字
    keyword: '',
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    util = require('../../../../utils/util.js');
    app = getApp();
    app.getPhone(() => {
      this.fetch()
    })
    this.$on('verifyOrder', this.onVerifyOrder)
  },
  onUnload() {          //清内存
    apiAction = null;
    util = null;
    app = null;
    this.data = null;
  },
  // 抓取
  fetch() {
    const {
      currentPage,
      pageSize,
      keyword
    } = this.data
    const query = {
      currentPage,
      pageSize,
      scope: this.data.scopes[this.data.tabIndex],
      keyword,
    }
    apiAction.weEsCustomerConsumerOrder(query).then(data => {
      this.data.flag = false
      this.data.total = data.total
      this.$setData({
        list: this.data.list.concat(data.consumerOrderInfos)
      })
    })
  },
  // 监听核销事件
  onVerifyOrder(id) {
    for (let i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].id == id) {
        let attr = `list[${i}].status`
        this.$setData({
          [attr]: '已结单'
        })
      }
    }
  },
  search(e) {
    this.$setData({
      currentPage: 0,
      keyword: e.detail,
      list: []
    })
    this.fetch()
  },
  // 切换tab
  switchTab(e) {
    this.$setData({
      tabIndex: e.detail.index,
      list: []
    })
    this.data.currentPage = 0
    this.fetch()
  },
  jumpDetail(e) {
    this.$route('/pages/TC/pages/consumptiondetail/consumptiondetail', {
      id: e.currentTarget.dataset.id
    })
  },
  // 下滑到底部加载更多
  onReachBottom() {
    if ((this.data.currentPage + 1) * this.data.pageSize >= this.data.total) return
    if (this.data.flag) return
    this.data.flag = true
    this.data.currentPage++
      this.fetch()
  },
})