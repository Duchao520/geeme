// pages/Login/loginIndex/loginIndex.js
const fetch = require('../../../utils/fetch.js');
const request = new fetch.request();
const format = require('../../../utils/format.js');
const config = require('../../../config/index.js');
const encriptPassword = require('../../../utils/encript.js').encriptPassword
const app = getApp();
Page({
  data: {
    AUTHORIZE_SWITCHER: false              //是否同意协议
  },
  submit(e) {
    if (!this.data.AUTHORIZE_SWITCHER){
      wx.showToast({
        title: '请阅读并同意服务协议',
        icon: 'none'
      })
      return ;
    }
    const {telephone, password} = e.detail.value
    if (telephone.length === 11) {
      const params = {
        telephone,
        password: encriptPassword(password),
      }
      fetch.login(params)

    } else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
  },

  authorize(){
    this.setData({
      AUTHORIZE_SWITCHER: !this.data.AUTHORIZE_SWITCHER
    })
  },

  navigateToAuth(){
    wx.navigateTo({
      url: '/pages/Authorization/Authorization'
    })
  },

  /**
   * 点击去验证码登录
   */
  tologinCode() {
    wx.navigateTo({
      url: '/pages/Login/loginCode/loginCode'
    })
  },

  /**
   * 点击去忘记密码
   */
  toforgetPassWord() {
    wx.navigateTo({
      url: '/pages/Login/loginForgetPassword/loginForgetPassword'
    })
  },

  
})