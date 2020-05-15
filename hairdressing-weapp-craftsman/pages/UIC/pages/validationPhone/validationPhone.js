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
      fetch.staffGetOldMobileVerifyCode(this.data.mobile).then(data => {
        if(data.success){
          this.data.encryptString = data.encryptString
        }
      })
    })
  },

  /**
   * 点击下一步
   */
  submit() {
    if (this.data.mobile && this.data.verifyCode){
      const {mobile, verifyCode, encryptString} = this.data
      const params = {
        mobile,
        code:verifyCode,
        encryptString
      }
      fetch.staffGetVerifyCodeResult(params).then(data => {
        if(data.success){
          this.$route('/pages/UIC/pages/updatePhone/updatePhone')
        }
      })
    }
  },
})