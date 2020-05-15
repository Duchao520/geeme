// pages/Login/loginForgetPassword/loginForgetPassword.js
const fetch = require('../../../utils/fetch.js')
const encriptPassword = require('../../../utils/encript.js').encriptPassword
const app = getApp()
Page({
  data: {
    phone:null,
    encryptPhone:null,
    code:null,
    password:null,
    ifShowPhoneInput:true,
    countdown:0,
    encryptString:null,
  },
  onLoad(){
    // 若是已登录状态
    if (wx.$getStorage('authorization')){
      app.getUserInfo( userInfo => {
        let phone = userInfo.mobile
        phone = "" + phone;
        let reg = /(\d{3})\d{4}(\d{4})/;
        let encryptPhone = phone.replace(reg, "$1****$2")
        this.$setData({
          ifShowPhoneInput:false,
          phone,
          encryptPhone,
        })
      })
    }
  },
  inputPhone(e){
    this.data.phone = e.detail.value
  },
  inputCode(e){
    this.data.code = e.detail.value
  },
  inputPwd(e){
    this.data.password = e.detail.value
  },
  getCode(){
    if(!this.data.phone){
      wx.showToast({
        title: '请输入手机号',
        icon:'none'
      })
      return
    }
    this.data.countdown = 61
    fetch.staffGetVerifyCode4ModifyPwd(this.data.phone).then(data => {
      if(data.success){
        this.data.encryptString = data.encryptString
        this.startCountdown()    
      }else{
        wx.showToast({
          title: data.message,
          icon:'none'
        })
      }
    })
  },
  startCountdown(){
    if(this.data.countdown > 0){
      this.setData({
        countdown: --this.data.countdown
      })
      setTimeout(this.startCountdown.bind(this), 1000)
    }
  },
  submit(){
    const {code, encryptString, phone, password} = this.data
    if(!phone || !code || !password) return
    const params = {
      code,
      encryptString,
      mobile:phone,
      newPassword: encriptPassword(password)
    }
    fetch.staffModifyPwd(params).then( data => {
      const title = data.success ? '修改密码成功' : data.message
      wx.showToast({
        title,
      })
      if(data.success){
        setTimeout( () => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500) 
      }
    })
  }
})