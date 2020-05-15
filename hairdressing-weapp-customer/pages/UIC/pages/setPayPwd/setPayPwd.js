const apiAction = require('../../../../utils/apiAction.js');
Page({
  data: {
    countdown: 0,
    phone: null,
    code: null,
  },
  onLoad() {
    getApp().getPhone(phone => {
      this.setData({
        phone
      })
    })
  },
  inputCode(e) {
    this.data.code = e.detail.value
  },
  getCode() {
    if (this.hasSent) return
    this.hasSent = true

    apiAction.brandCustomerPayPasswordMobileMsg(this.data.phone).then(data => {
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
    if (!this.data.code) {
      return
    }
    apiAction.checkBrandCustomerPayPasswordCode(this.data.code).then(data => {
      if (data.success) {
        this.$route('/pages/UIC/pages/setPayPwd2/setPayPwd2')
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  makePhone() {
    getApp().getBrand(brand => {
      wx.makePhoneCall({
        phoneNumber: brand.phone,
      })
    })
  }
})