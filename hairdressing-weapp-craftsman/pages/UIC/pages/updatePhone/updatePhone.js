// const util = require('../../../../utils/util.js');
// const request = new util.request();
const fetch = require('../../../../utils/fetch.js')
Page({
  data: {
    code: true,
    time: 60,
    mobile: null,
    verifyCode: null,
    encryptString: null
  },

  /**
   * input事件双向绑定电话
   */
  bindphone(e) {
    if (e.detail.cursor == 12) {
      return
    }
    this.setData({
      mobile: e.detail.value
    })
  },

  /**
   * input事件双向绑定验证码
   */
  bindcode(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  /**
   * 发送请求获取验证码
   */
  getcode() {

    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    }
    // 倒计时
    this.setData({
      code: false
    }, () => {
      let a = setInterval(() => {
        if (this.data.time == 0) {
          clearInterval(a)
          this.setData({
            code: true,
            time: 60
          })
          return;
        }
        this.setData({
          time: this.data.time - 1
        })
      }, 1000)
      fetch.staffGetUpdateMobileVerifyCode(this.data.mobile).then( data => {
        if(data.success){
          this.data.encryptString = data.encryptString
        }else{
          wx.showToast({
            title: data.message,
            icon:'none'
          })
        }
      })
    })
  },

  /**
   * 提交请求
   */
  submit() {
    const { mobile, encryptString, verifyCode} = this.data
    const params = {
      mobile,
      code:verifyCode,
      encryptString,
    }
    fetch.staffUpdateMobile(params).then( data => {
      if(data.success){
        wx.reLaunch({
          url: '/pages/tabBar/User/index/index'
        })
      }
    })
  },
})