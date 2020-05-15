import {accMul} from '/util/jsBridge';
import { Page } from '/util/ix';
var app = getApp();

Page({
  data: {
    totalAmount: '',
    bizNo: '',
    indicatorDots: true,
    autoplay: true,
    vertical: false,
    interval: 5000,
    circular: false,
    banner: []
  },
  onKeyPress(r){
    switch (r.keyCode) {
        case 133:
          my.reLaunch({url: '/pages/index/index',});
          break
      }
  },
  onLoad() {
    my.setNavigationBar({
      backgroundColor: '#ffffff'
    })
    this.getTotalAmount();
    this.getBanner();
  },
  getTotalAmount(){
    let totalAmount = app.store.totalAmount.getStore().data ? Number(app.store.totalAmount.getStore().data) : 0;
    this.setData({
      totalAmount: totalAmount.toFixed(2)
    })
  },
  getBanner(){
    var _self = this, _data;
    _data = {
      token: app.store.token.getStore().data,
      advertType: 2,
      billImgType: 4
    }
    app.API.shopEntry(_data).then(res => {
      if(res.state == 1){
        _self.setData({
          banner: res.listKtCarousel
        })
      }
    })
  },
  /**
   * 刷脸支付
   */
  facePay(){
    var _self = this;
    var _date = new Date();
    this.setData({
      bizNo: '' + _date.getTime()
    })

    var CASHIER_OBJ = {
          appName: 'cashier',
          bizNo: _self.data.bizNo,
          totalAmount: _self.data.totalAmount,
          showScanPayResult: true,
          faceLoadingTimeout: 5,
          success: (r) => _self.pay(r)
    }
    my.ix.startApp(CASHIER_OBJ);
  },
  pay(r){
    var _self = this;
    var _data = {
      paramsJsonStr: JSON.stringify(r),
      totalAmount: _self.data.totalAmount,
      amount: _self.data.totalAmount,
      iotAppId: app.store.appId.getStore().data,
      cashierNum: app.store.cashierNum.getStore().data,
      storeId: app.store.storeId.getStore().data,
      activeType: 0,
      orderType: 1
    };
    app.API.facepay(_data).then(res => {
      if(res.state == 1){
        my.reLaunch({url: '/pages/index/index'});
      }
    })
  },

  /**
   * 前往验证
   */
  goRegister(){
    var _self = this , ALIUSERID , _data , USERINFO;
    my.ix.faceVerify({
      option: 'life',
      success(r){
        ALIUSERID = r.buyerId;
        _data = {
          aliUserId: ALIUSERID
        };
        app.API.verifyUser(_data).then(res => {
          if(res.state == 1){
            USERINFO = res.data;
            USERINFO.isUser = 1;
            USERINFO.totalmoney = accMul(USERINFO.totalmoney,1);
            app.store.USERINFO.setStore(USERINFO);
            my.navigateTo({url: '/pages/packageA/pages/svipPay/svipPay'});
          }else if(res.state == 900012){        //未绑定手机号
            my.navigateTo({url: `/pages/packageA/pages/register/register?aliUserId=${ALIUSERID}`})
          }else if(res.state == 901003){        //没注册前往注册
            my.navigateTo({url: `/pages/packageA/pages/register/register?aliUserId=${ALIUSERID}`})
          }
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },

  /**
   * 会员支付
   */
  verifyUser(){
    var aliUserId = '2088902374965524' , _data , USERINFO;
    _data = {
      aliUserId: aliUserId
    }
    app.API.verifyUser(_data).then(res => {
      if(res.state == 1){
        USERINFO = res.data;
        USERINFO.isUser = 1;
        app.store.USERINFO.setStore(USERINFO);
        my.navigateTo({url: '/pages/packageA/pages/svipPay/svipPay'});
      }else if(res.state == 901003){  //没注册前往注册
        my.navigateTo({url: '/pages/packageA/pages/register/register'});
      }
    })
  }
});
