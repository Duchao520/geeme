var app = getApp();
import {MD5} from '../../util/jsBridge'

Page({
  data: {
    userphone:'',
    userpwd:'',
  },
  onLoad() {
    my.clearStorage();
  },
  inputphone(e){
    this.setData({
      userphone:e.detail.value
    })
  },

  inputpsd(e){
    this.setData({
      userpwd:e.detail.value
    })
  },
  navigateTo() {
    var tel = this.data.userphone
    var pwd = this.data.userpwd

    let regTel = /^1\d{10}$/;
    let _self = this;
    if (!regTel.test(tel)) {
      my.showToast({
        content: '手机号格式有误，请重新输入',
        type: 'fail',
        duration: 1500
      })
      return;
    }
    if (pwd.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
      my.showToast({
        content: '密码不能为空',
        type: 'fail',
        duration: 1500
      })
      return;
    }

    //登录协议
    app.store.version.setStore(app.version)  //读取版本信息存入全局
    let version = app.store.version.getStore().data;
    let password = MD5(tel+pwd);
    var _data = {
      userName: tel,
      password: password,
      token: '',
      version: version == 'develop' ? '1.0.0' : version,
      device: 'ali-iot-mini-program'
    }
    app.API.login(_data).then(res => {
      if(res.state == 1){
        app.store.appId.setStore(app.appId);
        app.store.storeId.setStore(res.data.shopStoreId ? res.data.shopStoreId : '');
        app.store.token.setStore(res.token ? res.token : '');
        app.store.cashierNum.setStore(res.data.staffNum ? res.data.staffNum : '');
        _self.goIndex();
      }
    })
  },
  goIndex(){
    my.reLaunch({
      url: '/pages/index/index'
    })
  }
});
