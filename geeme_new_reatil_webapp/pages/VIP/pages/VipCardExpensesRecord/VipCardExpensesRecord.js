// pages/VIP//pages/VipCardExpensesRecord/VipCardExpensesRecord.js
var apiAction = require('../../../../utils/apiAction.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      currentPage: 0,
      pageSize: 10,
      membershipCardId: ''
    },
    total: null,             //明细总数
    switcher: true,         //请求控制器
    changeRecordResponseList: [],         //权益金门店列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.data.params.membershipCardId = options.cardCustomerId
    this.showStoreList()
  },
  showStoreList(next = 'firstPage') {
    let { params, total, switcher, changeRecordResponseList } = this.data;
    // console.log(params)
    if (!switcher) return;
    this.setData({
      switcher: false
    })
    if (next == 'firstPage') {
      params.currentPage = 0;
    } else {
      if (total <= changeRecordResponseList.length) return;
      params.currentPage++;
    }
    return apiAction.getMemberShipList(params).then(res => {
      // console.log(res)
      changeRecordResponseList = changeRecordResponseList.concat(res.changeRecordResponseList)
      this.setData({
        changeRecordResponseList: changeRecordResponseList,
        total: res.total
      })
    })
  },
  onReachBottom() {
    this.showStoreList('nextPage')
  }
})