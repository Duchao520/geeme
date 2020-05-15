// pages/SC//pages/customer_add/customer_add.js
const fetch = require('../../../../utils/fetch.js')
Page({
  $name:'customer_add',
  data: {
    params:{
      consumptionCycle: '',
      headPortrait: '',
      telephone: '',
      customerName: '',
      nickName: '',
      sex: '',
      birthDay: '',
      province: '',
      city: '',
      district: '',
      weChat: '',
      remark: '',
      belongStoreId: '',
      technician: '',
      belongStore: '',
      technicianName: '',
      belongStoreCity: '',
    },
    // 以上是接口参数
    sexArray: ['男', '女'],
    sexIndex: 0,
  },
  onLoad(options) {
    this.from = options.from
  },
  // 修改头像
  updateHeadPortrait() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const img = res.tempFilePaths[0]
        fetch.uploadFile(img).then(uploadFileRes => {
          this.setData({
            'params.headPortrait': uploadFileRes
          })
        })
      }
    })
  },
  // 修改手机号码
  updateTelephone(e) {
    const mobile = e.detail.value
    this.data.params.telephone = mobile
    if (mobile.length == 11) {
      wx.showLoading()
      fetch.weCheckCustomerInfoByMobile(mobile).then(data => {
        wx.hideLoading()
        if (data.hit) {
          this.$setData({
            params:data,
          })
        } else {
          let attr
          for(const k in this.data.params){
            if(k != 'telephone'){
              attr = `params.${k}`
              this.$setData({
                [attr]: ''
              })
            }
          }
          // 获取服务者昵称
          getApp().getUserInfo(userInfo => {
            this.$setData({
              'params.technicianName': userInfo.nickName
            })
          })
          // 获取店铺信息
          const storeInfo = wx.$getStorage('storeInfo')
          this.$setData({
            'params.belongStoreCity': storeInfo.storeCity,
            'params.belongStore': storeInfo.storeName,
            'params.belongStoreId':storeInfo.storeId,
          })
        }
      })
    }
  },
  // 修改客户姓名
  updateCustomerName(e) {
    this.data.params.customerName = e.detail.value
  },
  // 修改客户备注名
  updateNickName(e) {
    this.data.params.nickName = e.detail.value
  },
  // 修改性别
  sexChange(e) {
    this.$setData({
      'params.sex': this.data.sexArray[e.detail.value]
    })
  },
  // 修改生日
  birthdayChange(e) {
    this.$setData({
      'params.birthDay': e.detail.value
    })
  },
  // 修改居住地
  regionChange(e) {
    const value = e.detail.value
    this.$setData({
      'params.province': value[0],
      'params.city': value[1],
      'params.district': value[2],
    })
  },
  // 修改微信号
  updateWeChat(e) {
    this.data.params.weChat = e.detail.value
  },
  updateCycle(e){
    this.data.params.consumptionCycle = e.detail.value
  },
  // 修改备注
  updateRemark(e) {
    this.data.params.remark = e.detail.value
  },
  // 保存
  confirm(){
    const params = this.data.params
    if(!params.telephone){
      return wx.showToast({
        title: '请填写手机号码',
        icon:'none'
      })
    }
    if (!params.nickName){
      return wx.showToast({
        title: '请填写备注名',
        icon: 'none'
      })
    }
    if (!params.sex) {
      return wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
    }
    
    if (this._confirm) return
    this._confirm = true
    fetch.weCreateRelatedCustomer({ ...params, staffId: wx.$getStorage('staffId'), storeId: wx.$getStorage('storeId')}).then(data => {
      this._confirm = false
      if(data.success){
        wx.showToast({
          title: '新增客户成功',
        })
        setTimeout(() => {
          if(this.from === 'customerList'){
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.reLaunch({
              url: '/pages/SC/pages/customerList/customerList',
            })
          }
        }, 1000)
      }else{
        wx.showToast({
          title: data.message,
          icon:'none'
        })
      }
    })
  }
})