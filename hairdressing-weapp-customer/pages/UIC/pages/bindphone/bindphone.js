const apiAction = require('../../../../utils/apiAction.js');

Page({
  $name:'bindphone',
  data: {
    code: true,
    time: 60,
    mobile: null,
    verifyCode: null,
    encryptString: null,
    // 后退n页
    delta:1
  },
  onLoad(options){
    // 如果是从登录页进入，则完成绑定后后退2页
    if(options.from == 'getAuthority'){
      this.data.delta = 2
    }else{
      this.data.delta = 1
    }
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

  getPhone(e){
    console.log(e)
  },

  /**
   * 发送请求获取验证码
   */
  getcode() {
    if (this.data.mobile.length != 11) {
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
      apiAction.registerVerificationCode(this.data.mobile).then( data => {
        this.data.encryptString = data.encryptString
      })
    })
  },

  /**
   * 提交请求
   */
  submit(e) {
    const userInfo = e.detail.userInfo
    if (!userInfo) {
      wx.showToast({
        title: '亲，授权才可以享受服务哦',
        icon: 'none'
      })
      return
    } 

    if (this.data.mobile && this.data.verifyCode) {
      const params = {
        code: this.data.verifyCode,
        encryptString: this.data.encryptString,
        telephone: this.data.mobile,
        ...wx.$getStorage('userInfo')
      }
      apiAction.verifyCustomer(params).then( data => {
        if(data.success){
          // 因token失效，重新登录
          apiAction.login(wx.$getStorage('userInfo')).then( () => {
            wx.$event.emit('bindphone', this.data.mobile)
            wx.navigateBack({
              delta: this.data.delta
            })
          })
        }else{
          wx.showToast({
            title: data.message,
            icon:'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的信息',
        icon: 'none'
      })
    }
  },
})