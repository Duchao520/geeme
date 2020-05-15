// pages/UIC/pages/serviceOrderList/serviceOrderList.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    tabs:['全部', '待结算', '已结算','已撤销'],
    currentTab:0,
    requestStatus: ['ALL', 'WAITING_PAY', 'FINISHED','RESCIND'],
    currentPage:0,
    pageSize:10,
    flag:false,
    keyword:'',
    list:null,
  },
  onLoad(options) {
    this.fetch()
  },
  fetch(){
    const {currentPage, pageSize, keyword} = this.data
    const params = {
      currentPage,
      pageSize,
      keyword,
      consumerOrderStatus:this.data.requestStatus[this.data.currentTab],
      searchPublish:false
    }
    fetch.esStaffConsumerOrder(params).then( data => {
      this.data.flag = false
      if (data.consumerOrderInfos && data.consumerOrderInfos.length){
        let list = this.data.currentPage == 0 ? data.consumerOrderInfos : this.data.list.concat(data.consumerOrderInfos)
        this.setData({
          list
        })
      }
      this.data.total = data.total
    })
  },
  switchTab(e){
    this.data.currentPage = 0
    this.setData({
      currentTab:e.detail.index,
      list:[],
    })
    this.fetch()
  },
  search(e){
    this.$setData({
      currentPage: 0,
      keyword: e.detail,
      list: []
    })
    this.fetch()
  },
  jumpDetail(e){
    const {id} = e.currentTarget.dataset
    this.$route('/pages/UIC/pages/serviceOrderDetail/serviceOrderDetail', {id})
  },
  jumpRelease(e){
    const {id, storeid, published} = e.currentTarget.dataset
    if (published) return
    this.$route('/pages/SC/pages/releaseIndex/releaseIndex', { consumerOrderId:id, storeId:storeid})
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if((this.data.currentPage+1)*this.data.pageSize >= this.data.total) return
    if(this.data.flag) return
    this.data.currentPage++
    this.data.flag = true
    this.fetch()
  },
})