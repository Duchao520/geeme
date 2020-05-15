// pages/UIC//pages/shippingAddress_edit/shippingAddress_edit.js
const apiAction = require('../../../../utils/apiAction.js')
Page({
  data: {
    id:null,
    info:{
      name: '',
      mobile: '',
      province: '',
      city: '',
      district: '',
      address: '',
      isDefault: true,
    }
  },
  onLoad(options) {
    if(options.id){
      wx.setNavigationBarTitle({
        title: '编辑收货地址',
      })
      this.$setData({
        id:options.id
      })
      this.fetch()
    }
  },
  fetch(){
    wx.$showLoading()
    apiAction.shippingAddressWeGet(this.data.id).then( data => {
      wx.$hideLoading()
      this.$setData({
        info:data.addressInfo
      })
    })
  },
  updateName(e){
    this.data.info.name = e.detail.value
  },
  updateMobile(e){
    this.data.info.mobile = e.detail.value
  },
  changeRegion(e){
    const [province, city, district] = e.detail.value
    this.$setData({
      'info.province':province,
      'info.city':city,
      'info.district':district
    })
  },
  updateAddress(e){
    this.data.info.address = e.detail.value
  },
  changeDefault(e){
    this.$setData({
      'info.isDefault':e.detail.value
    })
  },
  // 确认修改/确认新增
  confirm(){
    let promise
    const params = this.data.info
    const {name, mobile, province, city, district, address} = params
    // 判断信息完整
    if(!(name && mobile && province && city && district && address)){
      return wx.showToast({
        title: '请完善信息',
        icon:'none'
      })
    }else if(mobile.length != 11){
      return wx.showToast({
        title: '请输入正确的手机号',
        icon:'none'
      })
    }
    if(this.data.id){
      params.id = this.data.id
      promise = apiAction.shippingAddressUpdate(params)
    }else{
      promise = apiAction.shippingAddressAdd(params)
    }
    promise.then( data => {
      if(data.success){
        let toastTitle = this.data.id ? '修改成功' : '新增成功'
        wx.showToast({
          title: toastTitle,
        })
        setTimeout( () => {
          wx.navigateBack({
            delta:1
          })
        }, 1000)
      }else{
        wx.showToast({
          title: data.message,
          icon:'none'
        })
      }
    })
  },
  deleteAddress(){
    wx.showModal({
      title: '警告',
      content: '确认删除收货地址吗？',
      success: res => {
        if(res.confirm){
          apiAction.shippingAddressDel(this.data.id).then(data => {
            if (data.success) {
              wx.showToast({
                title: '删除成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }
})