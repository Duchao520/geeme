// pages/VIP//pages/VipCardPayment/VipCardPayment.js
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
    cardDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.data.params.membershipCardId = options.cardCustomerId
    this.setData({
      cardDetail: JSON.parse(options.cardDetail)
    })
    this.showStoreList()
  },
  showStoreList(next = 'firstPage') {
    let { params, total, switcher, changeRecordResponseList, cardDetail } = this.data;
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
    return apiAction.getMemberShipListRenewalList(params).then(res => {
      // console.log(res)
      changeRecordResponseList = changeRecordResponseList.concat(res.changeRecordResponseList)
      this.setData({
        changeRecordResponseList: changeRecordResponseList,
        total: res.total
      })
      if(next == 'firstPage') {
        cardDetail.storeMessage = res.changeRecordResponseList[0].storeMessage
        this.setData({
          cardDetail
        })
      }
    })
  },
  onReachBottom() {
    this.showStoreList('nextPage')
  }
})