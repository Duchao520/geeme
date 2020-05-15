// pages/UIC/pages/redPacket/redPacket.js
var apiAction = null;
Page({
  data: {
    tabList: ['未使用', '已使用', '已过期'],
    currentTab:0,
    pageNum:0,
    pageSize:10,
    flag:false,
    total:0,
    list: null,
  },
  onLoad(options) {
    apiAction = require('../../../../utils/apiAction.js');
    this.fetch()
  },
  onUnload() {          //清内存
    apiAction = null;
    this.data = null;
  },
  switchTab(e){
    this.setData({
      currentTab:e.detail.index,
      list:[]
    })
    this.fetch()
  },
  fetch(){
    const {currentTab, pageNum, pageSize} = this.data
    wx.$showLoading()
    apiAction.getRedPacketList(currentTab, pageNum, pageSize).then( data => {
      wx.$hideLoading()
      this.data.flag = false
      this.data.total = data.total
      let list = pageNum == 0 ? data.listRedPacket : this.data.list.concat(data.listRedPacket)
      this.$setData({
        list
      })
    })
  },
  jumpPurchase(){
    wx.switchTab({
      url: '/pages/tabBar/home/index/index',
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if(this.data.flag) return
    if((this.data.pageNum + 1) * this.data.pageSize >= this.data.total) return
    this.data.pageNum++
    this.fetch()
  },
})