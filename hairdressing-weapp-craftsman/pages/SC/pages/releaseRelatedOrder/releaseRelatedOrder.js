// pages/SC/pages/releaseRelatedOrder/releaseRelatedOrder.js
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    currentPage:0,
    pageSize:10,
    total:0,
    flag:false,
    list:null,
    currentOrder:null,
    selectedId:null,
  },
  onLoad(options) {
    if (options.consumerOrderId){
      this.data.selectedId = options.consumerOrderId
    }
    this.fetch()
  },
  fetch(){
    const {currentPage, pageSize} = this.data
    const params = {
      consumerOrderStatus:"ALL",
      currentPage,
      pageSize,
      keyword:'',
      searchPublish:true
    }
    fetch.esStaffConsumerOrder(params).then(data => {
      this.data.flag = false
      this.data.total = data.total
      if (data.consumerOrderInfos && data.consumerOrderInfos.length) {
        let currentOrder = null
        // 若已选择服务单，则选中对应id的服务单
        if (this.data.selectedId){
          for (const v of data.consumerOrderInfos){
            if(v.id == this.data.selectedId){
              currentOrder = v
              break
            }
          }
        }
        let list = this.data.currentPage == 0 ? data.consumerOrderInfos : this.data.list.concat(data.consumerOrderInfos)
        this.setData({
          list,
          currentOrder
        })
      }
    })
  },
  selectOrder(e){
    const item = e.currentTarget.dataset.item
    this.$setData({
      currentOrder:this.data.currentOrder && this.data.currentOrder.id == item.id ? null : item
    })
  },
  confirm(){
    const order = this.data.currentOrder
    if(order){
      const images = []
      for (let i = 0; i < Math.min(order.details.length, 3); i++) {
        images.push(order.details[i].cycleImage)
      }
      wx.$event.emit('updateRelateOrder', { id: order.id, images })
    }else{
      wx.$event.emit('updateRelateOrder', { id: null, images:null })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  onReachBottom() {
    if(this.data.flag) return
    if((this.data.currentPage+1) * this.data.pageSize >= this.data.total) return
    this.data.flag = true
    this.data.currentPage++
    this.fetch()
  }
})