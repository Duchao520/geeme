import {accMul} from '/util/jsBridge';
import { Page } from '/util/ix'; // 添加这行
var app = getApp();

Page({
  data: {
    buttonDisabled: true,
		btnstyle:'ghost',
    totalAmount: '',
    bizNo: '',
    banner: '',
    indicatorDots: true,
    autoplay: true,
    vertical: false,
    interval: 5000,
    circular: false,
  },
  onKeyPress(r){
    switch (r.keyCode) {
        case 131:
          this.clickPayEvent(r);break;
        case 132:
          this.face();break;
        case 134:
          my.navigateTo({url: '/pages/system/system'});break;
      }
  },
  onLoad() {
    var _self = this;
    if(app.store.token.getStore().data && app.store.token.getStore().data != 'null'){
      _self.shopEntry();
    }else{
      my.reLaunch({url: '/pages/login/login'});
    }

  },
  onShow(){
    var _self = this;
    app.store.totalAmount.removeStore();
    app.store.USERINFO.removeStore();
    app.store.MAINCARD.removeStore();
  },
  onHide(){
  },
  //输入框监听
	bindKeyInput(e) {
		var totalAmount = e.detail.value //输入框数据
		if(totalAmount <= 0) {
			this.setData({buttonDisabled: true});
			this.setData({btnstyle:'ghost'});
		} else {
			this.setData({buttonDisabled: false});
			this.setData({btnstyle:'primary'});
		}
		this.setData({totalAmount:totalAmount});
  },

  /**
   * 获取banner
   */
  shopEntry(){
    var _self = this;
    var _data = {
      token: app.store.token.getStore().data,
      advertType: 1,
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

  clickPayEvent(r) {
    var _self = this;
    if(Number(r.amount) > 0){
      app.store.totalAmount.setStore(r.amount);
      my.navigateTo({url: '/pages/packageA/pages/pay/pay'});
    }else{
      _self.face();
    }
    /*var _date = new Date();
    this.setData({
      bizNo: '' + _date.getTime(),
      totalAmount: r.amount
    })

    var CASHIER_OBJ = {
          appName: 'cashier',
          bizNo: _self.data.bizNo,
          totalAmount: _self.data.totalAmount,
          showScanPayResult: true,
          btnName: 'hello',
          faceLoadingTimeout: 5,
          success: (r) => {
            _self.pay(r);
          }
    }
    console.log(CASHIER_OBJ)
    my.ix.startApp(CASHIER_OBJ);*/
  },
  pay(r){
    var _self = this;
    var _data = {
      paramsJsonStr: JSON.stringify(r),
      totalAmount: _self.data.totalAmount,
      iotAppId: app.store.appId.getStore().data,
      cashierNum: app.store.cashierNum.getStore().data,
      storeId: app.store.storeId.getStore().data
    };
    app.API.facepay(_data).then(res => {
      if(res.state == 1){
        _self.openPayResult();        
      }else{
        
      }
    })
  },
  openPayResult(){
    var _self = this;
    my.ix.startApp({ 
          appName: 'scanPayResult',
          totalAmount: _self.data.totalAmount,
          bizNo: _self.data.bizNo,
          bizAmount: '0.02',
          discount: '0.01',
          success(result){
            my.showToast({ content: JSON.stringify(result) });
          }
        });
  },
  face(){
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
            my.navigateTo({url: '/pages/packageA/pages/maincardList/maincardList'});
          }else if(res.state == 900012){        //未绑定手机号
            my.navigateTo({url: `/pages/packageA/pages/register/register?aliUserId=${ALIUSERID}`})
          }else if(res.state == 901003){        //没注册前往注册
            my.navigateTo({url: `/pages/packageA/pages/register/register?aliUserId=${ALIUSERID}`});
          }
        })
      },
      fail(res){
        console.log(res)
      }
    })
  }
});
