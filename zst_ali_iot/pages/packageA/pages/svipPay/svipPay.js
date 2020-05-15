import {accDiv,accMul,accAdd,Subtr} from '/util/jsBridge';
import { Page } from '/util/ix';
var app = getApp();

Page({
  data: {
    USER_IS_CARDER: 0,
    COUPON_LIST_FLAG: false,
    COUPON_LIST: '',
    COUPON_ACTIVE_INDEX: '',
    SHARE_CARD_LIST_FLAG: false,
    storeId: '',
    USERINFO: {},
    STORE_ACTIVE: {},
    SHARE_CARD_LIST: '',
    SHARE_CARD: ''
  },
  onReady(){
    if (my.canIUse('hideBackHome')) {
      my.hideBackHome();
    }
  },
  onKeyPress(r){
    switch (r.keyCode) {
        case 133:
          my.reLaunch({url: '/pages/index/index',});
          break
      }
  },
  onLoad() {
    this.setData({
      USERINFO: app.store.USERINFO.getStore().data,
      storeId: app.store.storeId.getStore().data
    });
    this.getStoreActive();
  },
  closeCouponList(){
    this.setData({
      COUPON_LIST_FLAG: false
    })
    my.setNavigationBar({
      backgroundColor: '#108DE9'
    });
  },
  showCouponList(){
    this.setData({
      COUPON_LIST_FLAG: true
    });
    my.setNavigationBar({
      backgroundColor: '#ffffff'
    })
  },
  getCouponListRef(ref){
    // console.log(ref.close)
  },
  getVIPRef(ref){
    this.VIP = ref;
  },
  getShareCardRef(ref){
    this.shareCard = ref
  },
  getCarderRef(ref){
    this.carder = ref
  },
  showShareCardList(){
    this.setData({
      SHARE_CARD_LIST_FLAG: true
    });
    my.setNavigationBar({
      backgroundColor: '#ffffff'
    })
  },
  closeShareCardList(){
    this.setData({
      SHARE_CARD_LIST_FLAG: false
    });
    my.setNavigationBar({
      backgroundColor: '#108DE9'
    });
  },
  chooseShareCard(id){
    if(!this.data.USER_IS_CARDER)
    {
    this.VIP.getCard(id)
    }
  },
  chooseCoupon(coupon,index){
    if(!this.data.USER_IS_CARDER){
      this.VIP.getCoupon(coupon);
    }else{
      this.carder.getCoupon(coupon);
    }
    this.setData({
      COUPON_ACTIVE_INDEX: index
    })
  },
  onlyUseCoupon(coupon,index){
    if(!this.data.USER_IS_CARDER){
      this.VIP.onlyUseCoupon(coupon);
    }else{
      this.carder.onlyUseCoupon(coupon);
    }
    this.setData({
      COUPON_ACTIVE_INDEX: index
    })
  },
  clearCoupon(){
    this.setData({
      COUPON_ACTIVE_INDEX: ''
    })
  },

  /**
   * 获取门店活动
   */
  getStoreActive(){
    var _self = this , _data , STORE_ACTIVE , SHARE_CARD , COUPON_LIST;
    _data = {
      userId: _self.data.USERINFO.id,
      storeId: _self.data.storeId
    };
    app.API.storeActives(_data).then(res => {
      if(res.state == 1){
        STORE_ACTIVE = res;
        SHARE_CARD = STORE_ACTIVE.data;
        COUPON_LIST = STORE_ACTIVE.listCardcoupon;
        COUPON_LIST.forEach(item => {
          item.consumeMoney_ceil = Number(item.consumeMoney)
          item.times = String(item.startDate).slice(0,4) + '.' + String(item.startDate).slice(4,6) +
                  '.' + String(item.startDate).slice(6,8) + '-' + String(item.endDate).slice(0,4) + '.' + String(item.endDate).slice(4,6) +
                  '.' + String(item.endDate).slice(6,8)
        })
        _self.setData({
          STORE_ACTIVE: STORE_ACTIVE,
          COUPON_LIST: COUPON_LIST,
          SHARE_CARD: SHARE_CARD,
          USER_IS_CARDER: STORE_ACTIVE.biSvipcard ? 1 : 0
        })
        _self.getShareCardList()
      }
    })
  },

  getShareCardList(){
    var _self = this , _data , SHARE_CARD_LIST;
    _data = {
      shopStoreId: _self.data.storeId,
      state: 1
    };
    app.API.getShareCardList(_data).then(res => {
      if(res.state == 1){
        SHARE_CARD_LIST = res.data;
        SHARE_CARD_LIST.forEach(ele => {
          ele.money_ceil = accDiv(ele.money,100);
          ele.shareCardDiscount_ceil = accMul(ele.shareCardDiscount,10);
        })

        _self.setData({
          SHARE_CARD_LIST: SHARE_CARD_LIST
        })
        _self.data.STORE_ACTIVE.biSvipcard ? _self.carder.init() : _self.VIP.init() ;        
      }
    })
  }
});
