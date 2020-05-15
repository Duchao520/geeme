// pages/SC/pages/customerList/customerList.js
const fetch = require('../../../../utils/fetch.js')
Page({
  $name:'customerList',
  data: {
    keyword:'',
    list:null,
    select:false, // 是否是选择预约客户
    selectedCustomerName:'',
    selectedCustomerId:'',
    dueTime:'',
  },
  onLoad(options) {
    if(options.select){
      this.setData({
        select:true
      })
      this.data.dueTime = options.dueTime
      wx.setNavigationBarTitle({
        title: '选择预约客户',
      })
    }
  },
  onShow(){
    this.fetch()
  },
  fetch(){
    wx.showLoading()
    fetch.weGetRelatedCustomers(this.data.keyword).then( data => {
      wx.hideLoading()
      this.$setData({
        list:data.customerInfos
      })
    })
  },
  search(e){
    this.data.keyword = e.detail
    this.setData({
      list:[]
    })
    this.fetch()
  },
  jumpCustomer_add(){
    this.$route('/pages/SC/pages/customer_add/customer_add')
  },
  // 选择客户
  selectCustomer(e){
    if(!this.data.select) return
    const {customerId, brandCustomerId, nickName} = e.currentTarget.dataset.item
    this.$setData({
      selectedCustomerName: nickName,
      selectedCustomerId: customerId,
      selectedBrandCustomerId: brandCustomerId
    })
  },
  // 跳转选择服务
  jumpChooseService(e){
    if (!this.data.selectedCustomerId){
      return wx.showToast({
        title: '请选择客户',
        icon:'none'
      })
    }
    const query = {
      dueTime:this.data.dueTime,
      customerId:this.data.selectedCustomerId,
      brandCustomerId: this.data.selectedBrandCustomerId
    }
    this.$route('/pages/TC/pages/chooseService/chooseService', query)
  }
})