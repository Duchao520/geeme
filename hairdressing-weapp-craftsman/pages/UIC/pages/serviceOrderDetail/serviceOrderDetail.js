// pages/TC/pages/consumptiondetail/consumptiondetail.js
const fetch = require('../../../../utils/fetch.js')
const app = getApp()
Page({
  $name:'serviceOrderDetail',
  data: {
    bill: null,
  },
  onLoad(options) {
    this.fetch(options.id)
  },
  fetch(id) {
    fetch.esStaffConsumerOrderDetail(id).then(data => {
      this.setData({
        bill: data
      })
    })
  },
  // 发布作品
  clickBtn(e) {
    if(this.data.bill.published) return
    this.$route('/pages/SC/pages/releaseIndex/releaseIndex', { consumerOrderId: this.data.bill.id, storeId:this.data.bill.storeId })
  },
  // 继续开单
  billing(){
    this.$place('unionOrder', this.data.bill)
    this.$route('/pages/TC/pages/consumptionBillOne/consumptionBillOne', {id:this.data.bill.brandCustomerId})
  },
  // 跳转客户美丽档案
  jumpCustomerDetail(e){
    this.$route('/pages/SC/pages/customerDetail/customerDetail', {id:e.currentTarget.dataset.id})
  }
})