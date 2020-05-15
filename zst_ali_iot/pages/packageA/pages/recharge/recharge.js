import {accDiv,accMul,accAdd,Subtr} from '/util/jsBridge';
import { Page } from '/util/ix'; // 添加这行
var app = getApp();

Page({
  data: {
    MAIN_CARD: '',
    RECHARGE_LIST: [],
    activeIndex: 0,
    ACT: ''
  },
  onKeyPress(r){
    switch(r.keyCode){
      case 133:
        my.reLaunch({url: '/pages/index/index'});break;
    }
  },
  onLoad() {
    my.setNavigationBar({
      backgroundColor: '#ffffff'
    })
    this.setData({
      MAIN_CARD: app.store.MAINCARD.getStore().data
    });
    this.rechargeList();
  },
  rechargeList(){
    var _self = this , _data , {RECHARGE_LIST} = this.data;
    _data = {
      shopStoreId: app.store.storeId.getStore().data
    };
    app.API.rechargeList(_data).then(res => {
      if(res.state == 1){
        RECHARGE_LIST = res.data;
        RECHARGE_LIST.forEach(ele => {
          ele.shouldMoney_ceil = accDiv(ele.shouldMoney,100);
          ele.discountRate_ceil = accMul(ele.discountRate,10);
          ele.giveMoney_ceil = accDiv(ele.giveMoney,100);
        });
        _self.setData({
          RECHARGE_LIST: RECHARGE_LIST,
          ACT: RECHARGE_LIST[0]
        })
      }
    })
  },
  chooseActive(event){
    var _self = this , _data , {RECHARGE_LIST , activeIndex , ACT} = this.data;
    activeIndex = event.target.dataset.activeIndex;
    ACT = RECHARGE_LIST[activeIndex];
    _self.setData({
      activeIndex: activeIndex,
      ACT: ACT
    })
  },
  clickPayEvent(){
    var _self = this , CASHIER_OBJ ,  
      {ACT , MAIN_CARD} = this.data , 
      _date = new Date();
      CASHIER_OBJ = {
        appName: 'cashier',
        bizNo: _date.getTime(),
        totalAmount: ACT.shouldMoney_ceil,
        showScanPayResult: true,
        faceLoadingTimeout: 5,
        success(r){
          _self.pay(r)
        }
      };
      my.ix.startApp(CASHIER_OBJ);
  },
  pay(r){
    var _self = this , _data , {ACT , MAIN_CARD} = this.data ;
    _data = {
      userId: app.store.USERINFO.getStore().data.id,
      paramsJsonStr: JSON.stringify(r),
      iotAppId: app.store.appId.getStore().data,
      money: ACT.shouldMoney_ceil,
      svipcardActiveId: ACT.id,
      shopStoreId: app.store.storeId.getStore().data,
      mainCardId: MAIN_CARD ? MAIN_CARD.id : '',
      rechargeType: MAIN_CARD ? 2 : 1
    };
    app.API.recharge(_data).then(res => {
      if(res.state == 1){
        my.showToast({
          content: '充值成功',
          type: 'success'
        });
        my.reLaunch({
          url: '/pages/index/index'
        });
      }
    })
  }
});
