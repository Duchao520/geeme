// pages/Login/loginCode/loginCode.js
const fetch = require('../../../utils/fetch.js')
Page({
  data: {
    countdown: 0,
    phone: '',
    code: '',
  },
  submit(e){
    const { telephone, code } = e.detail.value
    if (telephone.length === 11) {
      const params = {
        telephone,
        verifyCode:code
      }
      fetch.login(params)

    } else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
  },
  inputPhone(e){
    this.data.phone = e.detail.value
  },
  inputCode(e){
    this.data.code = e.detail.value
  },
  getCode() {
    if (this.hasSent) return
    if(this.data.phone.length != 11){
      return wx.showToast({
        title: '请输入正确的手机号',
        icon:'none'
      })
    }
    this.hasSent = true
    fetch.staffGetVerifyCode4Login(this.data.phone).then(data => {
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
  // 返回密码登录
  tologinIndex() {
    wx.navigateBack({
      delta: 1
    })
  },
})