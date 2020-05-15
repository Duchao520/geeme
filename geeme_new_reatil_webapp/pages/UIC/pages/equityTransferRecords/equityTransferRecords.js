// pages/UIC//pages/equityTransferRecords/equityTransferRecords.js
var apiAction = require('../../../../utils/apiAction.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部吸附相关
    scrollTop: 0,
    isFixed: true,
    tabs: ['选择门店', '选择转出方式'],
    activeTab: -1,
    // 权益金申请提现
    queryParam: {
      brandCustomerId: '',
      pageNum: 1,
      pageSize: 20,
      storeId: null,
      type: null
    },
    storeInfoList: ['选择门店'],    // 获取门店列表
    sortStores: ['选择门店'],       // 门店数组列表
    sortMethods: ['选择转出方式', '转至钱包余额', '转至银行卡'],
    total: null,             //明细总数
    switcher: true,         //请求控制器
    preMoneyApplyOutInfoList: [],         //权益金门店列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.queryParam.brandCustomerId = options.brandCustomerId
  },
  onShow() {
    this.setData({
      switcher: true,
      storePreMoneyList: [],
      queryParam: {
        brandCustomerId: '',
        pageNum: 1,
        pageSize: 20,
        storeId: null,
        type: null
      },
      total: null,             //明细总数
      switcher: true,         //请求控制器
      preMoneyApplyOutInfoList: [],         //权益金门店列表
    })
    // 权益门店列表
    this.getStoreList()
    this.getPreMoneyOutApplyListForSelf();
  },
  // 权益门店列表
  getStoreList() {
    const { brandCustomerId } = this.data.queryParam
    let params = {
      brandCustomerId
    }
    return apiAction.getStoreList(params).then(res => {
      // console.log(res)
      if (res.storeInfoList == null) return
      let sortStores = ['选择门店'];
      for (let i in res.storeInfoList) {
        sortStores.push(res.storeInfoList[i].storeName)
      }
      this.$setData({
        sortStores,
        storeInfoList: res.storeInfoList
      })
    })
  },
  // 获取权益金转出记录
  getPreMoneyOutApplyListForSelf(next = 'firstPage') {
    let { queryParam, total, switcher, preMoneyApplyOutInfoList } = this.data
    if (!switcher) return;
    this.setData({
      switcher: false
    })
    if (next == 'firstPage') {
      queryParam.pageNum = 1;
    } else {
      if (total <= storePreMoneyList.length) return;
      queryParam.pageNum++;
    }
    return apiAction.getPreMoneyOutApplyListForSelf(queryParam).then(res => {
      if (res.preMoneyApplyOutInfoList == null) return
      preMoneyApplyOutInfoList = preMoneyApplyOutInfoList.concat(res.preMoneyApplyOutInfoList)
      this.setData({
        preMoneyApplyOutInfoList,
        total: res.total
      })
    })
  },
  // 选择弹框
  popup(e) {
    // console.log(e)
    const index = e.detail.index
    this.$setData({
      activeTab: index
    })
  },
  // 选择门店
  selectStore(e) {
    this.data.queryParam.storeId = e.detail.index === 0 ? null : this.data.storeInfoList[e.detail.index - 1].storeId
    this.data.queryParam.pageNum = 1
    this.setData({
      'tabs[0]': e.detail.item,
      activeTab: -1,
      switcher: true,
      storePreMoneyList: []
    })
    this.getPreMoneyOutApplyListForSelf();
  },
  // 选择转出方式
  selectSort(e) {
    this.data.queryParam.type = e.detail.index === 0 ? null : e.detail.index
    this.data.queryParam.pageNum = 1
    this.setData({
      'tabs[1]': e.detail.item,
      activeTab: -1,
      switcher: true,
      storePreMoneyList: []
    })
    this.getPreMoneyOutApplyListForSelf();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getPreMoneyOutApplyListForSelf('nextPage')
  },
  navigateToProgress(e) {
    let brandCustomerId = { brandCustomerId: this.data.queryParam.brandCustomerId};
    let key = e.currentTarget.dataset;
    let data = { ...key, ...brandCustomerId }
    // console.log(e.currentTarget.dataset)
    wx.$route('/pages/UIC/pages/equityTransferProgress/equityTransferProgress', data)
  }
})