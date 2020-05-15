const apiAction = require('../../../../utils/apiAction.js')
const app = getApp()
Page({
  data: {
    countdown: 0,
    phone: null,
    code: null,
  },
  inputPhone(e) {
    this.data.phone = e.detail.value
  },
  inputCode(e) {
    this.data.code = e.detail.value
  },
  getCode() {
    if (!this.data.phone || this.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    }

    if (this.hasSent) return
    this.hasSent = true
    apiAction.brandCustomerSendNewMobileMsg(this.data.phone).then(data => {
      this.hasSent = false      
      if (data.success) {
        this.setData({
          countdown: 60
        })
        this.startCountdown()
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  startCountdown() {
    const i = setInterval(() => {
      if (this.data.countdown == 0) {
        clearInterval(i)
        return
      }
      this.setData({
        countdown: --this.data.countdown
      })
    }, 1000)
  },
  submit() {
    if(!this.data.phone || !this.data.code) return
    apiAction.brandCustomerChangeMobile(this.data.phone, this.data.code).then( data => {
      if(data.success){
        app.globalData.phone = null
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 2
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
})