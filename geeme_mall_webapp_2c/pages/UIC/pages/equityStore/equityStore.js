// pages/UIC//pages/equityStore/equityStore.js
var apiAction = require('../../../../utils/apiAction.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryParams: {
      brandCustomerId: '',
      brandId: '',
      pageNum: 1,
      pageSize: 20
    },
    total: null,             //明细总数
    switcher: true,         //请求控制器
    storePreMoneyList: [],         //权益金门店列表
    totalPreMoney: null            //权益金总金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const { brandCustomerId, brandId } = options
    this.data.queryParams.brandCustomerId = brandCustomerId
    this.data.queryParams.brandId = brandId
    // console.log(this.data.queryParams)
    this.weGetPreMoney()
  },
  // 门店收益明细
  weGetPreMoney(next = 'firstPage') {
    // console.log(this.data)
    const { queryParams, total, switcher, storePreMoneyList } = this.data
    if (!switcher) return;
    this.setData({
      switcher: false
    })
    if (next == 'firstPage') {
      queryParams.pageNum = 1;
    } else {
      if (total <= storePreMoneyList.length) return;
      queryParams.pageNum++;
    }
    return apiAction.weGetPreMoney(queryParams).then(res => {
      this.$setData({
        storePreMoneyList: res.storePreMoneyList,
        totalPreMoney: res.totalPreMoney
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.weGetPreMoney('nextPage')
  },
})