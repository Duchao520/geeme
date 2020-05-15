import {accDiv,accMul,accAdd,Subtr} from '/util/jsBridge';
import { Page } from '/util/ix'; // 添加这行
var app = getApp();


Page({
  data: {
    SHARE_CARD_LIST: [],
    USERINFO: ''
  },
  onKeyPress(r){
    switch(r.keyCode){
      case 133:
        my.reLaunch({url: '/pages/index/index'});break;
    }
  },
  onLoad() {
    this.setData({
      USERINFO: app.store.USERINFO.getStore().data
    });
    this.svipCardList();
  },
  svipCardList(){
    var _self = this , _data, {USERINFO,SHARE_CARD_LIST} = this.data;
    _data = {
      userId: USERINFO.id,
      shopStoreId: app.store.storeId.getStore().data
    };
    app.API.svipCardList(_data).then(res => {
      if(res.state == 1){
        SHARE_CARD_LIST = res.data;
        SHARE_CARD_LIST.forEach(ele => {
          ele.money_ceil = accDiv(ele.money,100);
          ele.discountRate_ceil = accMul(ele.discountRate,10);
        })
        _self.setData({
          SHARE_CARD_LIST: SHARE_CARD_LIST
        })
      }
    })
  },
  clickCard(event){
    var {card} = event.target.dataset;
    if(card){
      app.store.MAINCARD.setStore(card);
      my.navigateTo({url: '/pages/packageA/pages/recharge/recharge'});
    }
  },
  putCarder(){
    var _self = this;
    app.store.MAINCARD.removeStore();
    my.navigateTo({url: '/pages/packageA/pages/recharge/recharge'});
  }
});
