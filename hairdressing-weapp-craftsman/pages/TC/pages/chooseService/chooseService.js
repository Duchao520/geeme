const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    list:null,
    serviceArr:null,
    notes:'',
    dueTime:'', //
    customerId:'',  //
  },
  computed:{
    _totalPrice(){
      let total = 0
      if(this.data.serviceArr){
        for(const v of this.data.serviceArr){
          total += v.selectedSpecification.count * v.selectedSpecification.specialPrice
        }
      }
      return total
    }
  },
  onLoad(options){
    this.data.dueTime = options.dueTime
    this.data.customerId = options.customerId
    this.brandCustomerId = options.brandCustomerId
    this.fetch()
  },
  fetch(){
    fetch.weGetServiceListByStoreIdAndStaffIds(this.brandCustomerId).then(data => {
      this.$setData({
        list: data.dataList
      })
    })
  },
  updateService(e){
    this.$setData({
      serviceArr:e.detail
    })
  },
  setnote(e){
    this.data.notes = e.detail.value
  },
  // 提交预约
  confirm(){
    if (!this.data.serviceArr || !this.data.serviceArr.length) {
      return wx.showToast({
        title: '请选择服务',
        icon: 'none'
      })
    }

    const params = {
      staffNotes:this.data.notes,
      customerId:this.data.customerId,
      storeId:wx.$getStorage('storeId'),
      staffId:wx.$getStorage('staffId'),
      dueTime:this.data.dueTime,
      appointmentServiceInfoList:[]
    }

    for(const v of this.data.serviceArr){
      params.appointmentServiceInfoList.push({
        count: v.selectedSpecification.count,
        // specificationId: v.selectedSpecification.specificationId,
        specificationId: v.selectedSpecification.id
      })
    }
    
    fetch.weStaffCreateAppointment(params).then( data => {
      if(data.success){
        wx.reLaunch({
          url: '/pages/TC/pages/appointmentSuccess/appointmentSuccess',
        })
      }else{
        wx.showToast({
          title: data.message,
          icon:'none'
        })
      }
    })
  }
})