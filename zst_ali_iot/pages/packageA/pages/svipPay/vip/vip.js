import {accDiv,accMul,accAdd,Subtr} from '/util/jsBridge';
var app = getApp();

Component({
  mixins: [],
  data: {
    totalAmount: '',
    USERINFO: '',
    SHARE_CARD: '',
    COUPON_LIST: '',
    coupon: '',
    INTERGRAL_ACT: {activeNum: '',actPay: '',discount: ''},
    SVIP: {},
    COUPON_PAY: {},
    INTERGRAL_DISCOUNT_ACT: '',
    INTERGRAL_DEF_ACT: '',
    consumeMoneys: '',
    act: '',
    actIndex: 0,
    priType: 1,
    couponPayFlag: false,
    SHARE_CARD_ID: '',

    PAY_INFO: {},

    bizNo: ''
  },
  props: {
    STORE_ACTIVE: '',
    SHARE_CARD_LIST: '',
    onShowShareCardList: () => console.error('not find'),
    onShowCouponList: () => console.error('not find'),
    onClearCoupon: () => console.error('not find')
  },
  didMount() {
    
    this.setData({
      totalAmount: app.store.totalAmount.getStore().data,
      USERINFO: app.store.USERINFO.getStore().data
    })
  },
  didUnmount() {},
  methods: {
    showShareCardList(){
      this.props.onShowShareCardList();
    },
    showCoupon(){
      this.props.onShowCouponList();
    },
    getCard(id){
      var _self = this;
      _self.props.SHARE_CARD_LIST.forEach(ele => {
        if(ele.id == id){
          _self.setData({
            SHARE_CARD: ele,
            SHARE_CARD_ID: id
          });
          _self.calMoney();
        }
      })
    },
    getCoupon(coupon){
      this.setData({
        coupon: coupon,
        couponPayFlag: true
      });
      this.calMoney();
    },
    onlyUseCoupon(coupon){
      this.setData({
        coupon: coupon,
        priType: '',
        couponPayFlag: true
      });
      this.calMoney();
    },
    changePritype(event){
      var {priType} = event.target.dataset,{coupon} = this.data;
      if(this.data.priType == priType){
        this.setData({
          priType: ''
        })
      }else{
        if(coupon.isAllowSuperposition == '0'){
          this.setData({
            priType: priType,
            coupon: '',
            couponPayFlag: false
          })
          this.props.onClearCoupon();
        }else{
          this.setData({
            priType: priType,
          })
        }
      }
      this.calMoney();
    },
    changeCouponFlag(){
      this.setData({
        couponPayFlag: !this.data.couponPayFlag
      });
      this.calMoney();
    },
    init() {
      var STORE_ACTIVE = this.props.STORE_ACTIVE , 
      SHARE_CARD , 
      INTERGRAL_DISCOUNT_ACT = {} , INTERGRAL_DEF_ACT = new Array(),consumeMoneys = new Array();
      SHARE_CARD = STORE_ACTIVE.data;
      SHARE_CARD.shareCardDiscount_ceil = accMul(Number(SHARE_CARD.shareCardDiscount ? SHARE_CARD.shareCardDiscount : 0),10);
      SHARE_CARD.money_ceil = accDiv(Number(SHARE_CARD.money),100);

      STORE_ACTIVE.lstBiIntegralactive.forEach(e => {
        if (e.discountType == 1) {
          INTERGRAL_DISCOUNT_ACT = e;
        } else if (e.discountType == 2) {
          INTERGRAL_DEF_ACT.push(e);
        }
      })
      INTERGRAL_DEF_ACT = INTERGRAL_DEF_ACT.sort(function(a,b){
        return a.consumeMoney - b.consumeMoney;
      })
      INTERGRAL_DEF_ACT.forEach(e => {
        consumeMoneys.push(e.consumeMoney);
      })
      this.setData({
        SHARE_CARD: SHARE_CARD,
        INTERGRAL_DISCOUNT_ACT: INTERGRAL_DISCOUNT_ACT,
        INTERGRAL_DEF_ACT: INTERGRAL_DEF_ACT,
        consumeMoneys: consumeMoneys,
        COUPON_LIST: STORE_ACTIVE.listCardcoupon
      });
      this.calMoney();
    },
    /**助商通满减或折扣活动金额计算*/
    judgeAlert(totalAmount) {
        var _self = this , 
        INTERGRAL_DISCOUNT_ACT = _self.data.INTERGRAL_DISCOUNT_ACT, 
        INTERGRAL_DEF_ACT = _self.data.INTERGRAL_DEF_ACT,
          discount , INTERGRAL_ACT = {};
        _self.def_status = 0;
        if (JSON.stringify(INTERGRAL_DISCOUNT_ACT) != '{}') {
          discount = Subtr(totalAmount,accMul(accMul(totalAmount,INTERGRAL_DISCOUNT_ACT.discountRate),0.1));
          if (Number(_self.data.USERINFO.totalmoney) >= discount) {
            INTERGRAL_ACT.actPay = Math.ceil(accMul(accMul(totalAmount,INTERGRAL_DISCOUNT_ACT.discountRate),10));
            INTERGRAL_ACT.discount = (_self.data.coupon && _self.data.couponPayFlag) ?
              Subtr(Subtr(accMul(totalAmount, 100), INTERGRAL_ACT.actPay),accMul(_self.data.coupon.couponMoney,100)) :
              Subtr(accMul(totalAmount, 100), INTERGRAL_ACT.actPay);
            INTERGRAL_ACT.disMsg = '享'+ accMul(INTERGRAL_DISCOUNT_ACT.discountRate,1) + '折';
            INTERGRAL_ACT.activeNum = INTERGRAL_DISCOUNT_ACT.id;
          } else {
            INTERGRAL_ACT.disMsg = '话呗余额不足';
            INTERGRAL_ACT.actPay = Math.ceil(accMul(totalAmount,100));
            INTERGRAL_ACT.discount = 0;
            INTERGRAL_ACT.activeNum = ''
          }
        } else if (INTERGRAL_DEF_ACT.length > 0) {
          try {
            if (Number(_self.data.USERINFO.totalmoney) >= Number(INTERGRAL_DEF_ACT[0].availableIntegral)) {      //判断话呗余额是否达到最低满减
              if (_self.data.act) {
                if (Number(_self.data.USERINFO.totalmoney) >= Number(_self.data.act.availableIntegral)) {
                  INTERGRAL_ACT.disMsg = "满" + _self.data.act.consumeMoney + "元减" + accMul(_self.data.act.availableIntegral,1) + "元";
                  INTERGRAL_ACT.actPay = Math.ceil(accMul(Subtr(Number(totalAmount),_self.data.act.availableIntegral),100));
                  INTERGRAL_ACT.discount = accMul(_self.data.act.availableIntegral,100);
                  INTERGRAL_ACT.activeNum = _self.data.act.id;
                } else {
                  _self.mapAct();
                }
              } else {
                var obj = INTERGRAL_DEF_ACT[_self.data.actIndex + 1];
                INTERGRAL_ACT.disMsg = "满" + obj.consumeMoney + "元减" + accMul(obj.availableIntegral,1) + "元,当前还差" + (obj.consumeMoney - Number(totalAmount)).toFixed(1) + '元';
                INTERGRAL_ACT.actPay = Math.ceil(accMul(totalAmount, 100));
                INTERGRAL_ACT.discount = 0;
                INTERGRAL_ACT.activeNum = '';
              }
            } else if (totalAmount) {                                  //余额不足最低满减 提醒余额不足选择充值或原价付
              INTERGRAL_ACT.disMsg = "话呗余额不足";
              INTERGRAL_ACT.actPay = Math.ceil(accMul(totalAmount, 100));
              INTERGRAL_ACT.discount = 0;
              INTERGRAL_ACT.activeNum = '';
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          INTERGRAL_ACT.disMsg = '';
          INTERGRAL_ACT.actPay = Math.ceil(accMul(totalAmount, 100));
          INTERGRAL_ACT.discount = 0;
          INTERGRAL_ACT.activeNum = '';
        }
        _self.setData({
          INTERGRAL_ACT: INTERGRAL_ACT
        })
    },
/** 匹配话呗余额适合的满减活动*/
    mapAct() {
        var _self = this,INTERGRAL_DEF_ACT = _self.data.INTERGRAL_DEF_ACT , act;
        try {
          if (INTERGRAL_DEF_ACT.length != 0) {
            var _reduAct = [];
            var _list = [];
            INTERGRAL_DEF_ACT.forEach(ele => {
              if (Number(_self.data.totalAmount >= ele.consumeMoney)) {
                _list.push(ele.availableIntegral);
                _reduAct.push(ele);
              }
            });
            if (_self.data.USERINFO.totalmoney) {
              _list.push(_self.data.USERINFO.totalmoney);
              _list = _list.sort(function (a, b) {
                return Number(a) - Number(b);
              });
              _reduAct = _reduAct.sort(function(a,b){
                return a.availableIntegral - b.availableIntegral;
              });
              var actIndex = _list.indexOf(Number(_self.data.USERINFO.totalmoney)) - 1;
              if (_reduAct[actIndex + 1].availableIntegral == _self.data.USERINFO.totalmoney) {
                actIndex = actIndex + 1
              }
              if (actIndex == -1) {
                act = '';
              } else {
                act = _reduAct[actIndex];
              }
              console.log(act)
              _self.setData({
                act: act
              })
              _self.calMoney();
            }
          }
        } catch (e) {
        }

    },
    /**
     * 自动匹配卡
     */
      mapCard(){
        var _self = this , SHARE_CARD_LIST = _self.props.SHARE_CARD_LIST;
        if(SHARE_CARD_LIST.length > 0){
          for(var i=0;i<SHARE_CARD_LIST.length;i++){
            var svipActPay = accMul(accMul(SHARE_CARD_LIST[i].shareCardDiscount,Number(_self.data.totalAmount)),100);
            if(SHARE_CARD_LIST[i].money >= svipActPay){
              return SHARE_CARD_LIST[i];
            }
          }
        }else{
          return false;
        }
      },

    /**
     * 计算各个活动最终付款金额
     * （总金额-优惠券）*活动折扣
     * */
      calMoney() {
        var _self = this , 
        SVIP = _self.data.SVIP , 
        INTERGRAL_ACT = _self.data.INTERGRAL_ACT , 
        COUPON_PAY = _self.data.COUPON_PAY , 
        totalAmount = _self.data.totalAmount,
        INTERGRAL_DEF_ACT = _self.data.INTERGRAL_DEF_ACT;
        if(_self.data.coupon && Number(Subtr(Number(totalAmount), Number(_self.data.coupon.couponMoney)) <=0) && _self.data.couponPayFlag){   //实付金额小于卡券优惠
          totalAmount = 0;
          SVIP.actPay = accMul(Number(totalAmount),100);
          SVIP.discount = 0;

          INTERGRAL_ACT.actPay = accMul(Number(totalAmount),100);
          INTERGRAL_ACT.discount = 0;
          _self.setData({
            INTERGRAL_ACT: INTERGRAL_ACT
          })

          COUPON_PAY.actPay = accMul(Number(totalAmount),100);
          COUPON_PAY.discount = accMul(Number(totalAmount),100);
        }else{
          totalAmount = (_self.data.coupon && _self.data.couponPayFlag) ? Subtr(Number(totalAmount), Number(_self.data.coupon.couponMoney)) : totalAmount;
          if (INTERGRAL_DEF_ACT != 0) {
            var _list = [],act;
            _self.data.consumeMoneys.forEach(e => {
              _list.push(e);
            });
            _list.push(Number(totalAmount));
            _list = _list.sort(function (a, b) {
              return Number(a) - Number(b);
            });
            var actIndex = _list.indexOf(Number(totalAmount)) - 1;
            if (_self.data.consumeMoneys[actIndex + 1] == totalAmount) {
              actIndex = actIndex + 1
            } else {
              actIndex = actIndex;
            }
            if (actIndex == -1) {
              act = '';
            } else {
              act = _self.data.INTERGRAL_DEF_ACT[actIndex];
            }
            _self.setData({
              actIndex: actIndex,
              act: act
            })
          }
          //卡主支付
          if(!_self.data.SHARE_CARD_ID){
            if(_self.mapCard()){
              _self.setData({
                SHARE_CARD: _self.mapCard()
              })
            }
            SVIP.actPay = Math.ceil(accMul(accMul(totalAmount, _self.data.SHARE_CARD.shareCardDiscount ? _self.data.SHARE_CARD.shareCardDiscount : 1), 100));
            SVIP.discount = (_self.data.coupon && _self.data.couponPayFlag) ? Subtr(Subtr(accMul(totalAmount, 100), SVIP.actPay),accMul(_self.data.coupon.couponMoney,100)) : Subtr(accMul(totalAmount, 100), SVIP.actPay);
          }else{
            SVIP.actPay = Math.ceil(accMul(accMul(totalAmount, _self.data.SHARE_CARD.shareCardDiscount ? _self.data.SHARE_CARD.shareCardDiscount : 1), 100));
            SVIP.discount = (_self.data.coupon && _self.data.couponPayFlag) ? Subtr(Subtr(accMul(totalAmount, 100), SVIP.actPay),accMul(_self.data.coupon.couponMoney,100)) : Subtr(accMul(totalAmount, 100), SVIP.actPay);
          }
          console.log(SVIP)
          //折扣满减
          _self.judgeAlert(totalAmount);
          INTERGRAL_ACT = _self.data.INTERGRAL_ACT;
      
          if (_self.data.coupon && _self.data.couponPayFlag) {                         //有优惠券时
            if (Number(_self.data.totalAmount) >= (Number(_self.data.coupon.consumeMoney) * 100 / 100)) {
              COUPON_PAY.actPay = Math.ceil(accMul(Number(totalAmount), 100));
              COUPON_PAY.discount = Subtr(accMul(Number(_self.data.totalAmount),100), COUPON_PAY.actPay);
            } else {
              _self.coupon = '';                      //金额未达到已选卡券,删除已选卡券,重计金额
            }
          } else {                                     //无优惠券时
            COUPON_PAY.actPay = Math.ceil(Number(_self.data.totalAmount) * 100);
            COUPON_PAY.discount = 0;
          }
        }
        SVIP.actPay_ceil = accDiv(SVIP.actPay,100);
        SVIP.discount_ceil = accDiv(SVIP.discount,100);
        INTERGRAL_ACT.actPay_ceil = accDiv(_self.data.INTERGRAL_ACT.actPay,100);
        INTERGRAL_ACT.discount_ceil = accDiv(_self.data.INTERGRAL_ACT.discount,100);
        COUPON_PAY.actPay_ceil = accDiv(COUPON_PAY.actPay,100);
        COUPON_PAY.discount_ceil = accDiv(COUPON_PAY.discount,100);
        this.setData({
          SVIP:SVIP,
          INTERGRAL_ACT: INTERGRAL_ACT,
          COUPON_PAY: COUPON_PAY
        })
        _self.priTypeEvent();
        
      },
      /**
       * 判断当前活动类型
       */
      priTypeEvent() {
        var _self = this , PAY_INFO = {};
        if (_self.data.priType == 1) {
          PAY_INFO.actPay = _self.data.SVIP.actPay<0 ? 0 : _self.data.SVIP.actPay;
          PAY_INFO.discount = Subtr(accMul(Number(_self.data.totalAmount),100),PAY_INFO.actPay);
        } else if (_self.data.priType == 2) {
          PAY_INFO.actPay = _self.data.INTERGRAL_ACT.actPay<0 ? 0 : _self.data.INTERGRAL_ACT.actPay;
          PAY_INFO.discount = Subtr(accMul(Number(_self.data.totalAmount),100),PAY_INFO.actPay);
          PAY_INFO.activeNum = _self.data.INTERGRAL_ACT.activeNum;
        } else if (_self.data.couponPayFlag && !_self.data.priType) {
          PAY_INFO.actPay = _self.data.COUPON_PAY.actPay<0 ? 0 : _self.data.COUPON_PAY.actPay;
          PAY_INFO.discount = _self.data.COUPON_PAY.discount;
        } else{
          PAY_INFO.actPay = accMul(_self.data.totalAmount, 100);
          PAY_INFO.discount = 0;
        }
        PAY_INFO.actPay_ceil = accDiv(PAY_INFO.actPay,100);
        PAY_INFO.discount_ceil = accDiv(PAY_INFO.discount,100);
        _self.setData({
          PAY_INFO: PAY_INFO
        })
      },
      clickPayEvent(){
        var _date = new Date() , _self = this , _data,activeType;
        switch (true){
          case (!Boolean(_self.data.priType) && _self.data.couponPayFlag && Boolean(_self.data.coupon)):
            activeType = 2;break;
          case (_self.data.priType == 1 && Boolean(_self.data.SHARE_CARD.id)):
            if(_self.data.couponPayFlag && _self.data.coupon){
              _self.data.PAY_INFO.actPay_ceil == 0 ? activeType = 2 : activeType = 4;  //金额为0使用优惠券支付
            }else{
              activeType = 3
            }
            break;
          case (_self.data.priType == 2 && Boolean(_self.data.INTERGRAL_ACT.activeNum)):
            if(_self.data.couponPayFlag && _self.data.coupon){
              activeType = 5;
            }else{
              activeType = 1;
            }
            break;
          default:
            activeType = 0;
        }
        var integralCount = (_self.data.coupon && _self.data.couponPayFlag) ? String(Subtr(accDiv(_self.data.PAY_INFO.discount, 100),_self.data.coupon.couponMoney)) :  String(accDiv(_self.data.PAY_INFO.discount, 100));
        _data = {
          userId: _self.data.USERINFO.id,
          iotAppId: app.store.appId.getStore().data,
          totalAmount: _self.data.totalAmount,
          amount: _self.data.PAY_INFO.actPay_ceil,
          cashierNum: app.store.cashierNum.getStore().data,
          storeId: app.store.storeId.getStore().data,
          activeType: activeType,
          phone: _self.data.USERINFO.realPhone ? _self.data.USERINFO.realPhone : '',
          orderType: 1,
          sharecardId: (activeType == 3 || activeType == 4) ? _self.data.SHARE_CARD.id : '',
          activeNum: (activeType == 1 || activeType == 5) ? _self.data.INTERGRAL_ACT.activeNum : '',
          couponId: (activeType == 2 || activeType == 5 || activeType == 4) ? _self.data.coupon.id : '',
          integralCount: (activeType == 1 || activeType == 5) ? integralCount : ''
        };
        app.API.placeorderCheck(_data).then(res => {
          if(res.state == 1){
            this.setData({
              bizNo: '' + _date.getTime()
            })
            if(_self.data.PAY_INFO.actPay_ceil == 0){
              _self.pay()
            }else{
              var CASHIER_OBJ = {
                    appName: 'cashier',
                    bizNo: _self.data.bizNo,
                    totalAmount: _self.data.PAY_INFO.actPay_ceil,
                    showScanPayResult: true,
                    faceLoadingTimeout: 5,
                    success: (r) => {
                      _self.pay(r);
                    }
              }
            my.ix.startApp(CASHIER_OBJ);
            }
          }
        })
      },
      pay(r){
        var _self = this, _data,activeType;
        switch (true){
          case (!Boolean(_self.data.priType) && _self.data.couponPayFlag && Boolean(_self.data.coupon)):
            activeType = 2;break;
          case (_self.data.priType == 1 && Boolean(_self.data.SHARE_CARD.id)):
            if(_self.data.couponPayFlag && _self.data.coupon){
              _self.data.PAY_INFO.actPay_ceil == 0 ? activeType = 2 : activeType = 4;  //金额为0使用优惠券支付
            }else{
              activeType = 3
            }
            break;
          case (_self.data.priType == 2 && Boolean(_self.data.INTERGRAL_ACT.activeNum)):
            if(_self.data.couponPayFlag && _self.data.coupon){
              activeType = 5;
            }else{
              activeType = 1;
            }
            break;
          default:
            activeType = 0;
        }
        var integralCount = (_self.data.coupon && _self.data.couponPayFlag) ? String(Subtr(accDiv(_self.data.PAY_INFO.discount, 100),_self.data.coupon.couponMoney)) :  String(accDiv(_self.data.PAY_INFO.discount, 100));
        _data = {
          paramsJsonStr: _self.data.PAY_INFO.actPay_ceil != 0 ? JSON.stringify(r) : '{}',
          userId: _self.data.PAY_INFO.actPay_ceil == 0 ? _self.data.USERINFO.id : '',
          iotAppId: app.store.appId.getStore().data,
          totalAmount: _self.data.totalAmount,
          amount: _self.data.PAY_INFO.actPay_ceil,
          phone: _self.data.USERINFO.realPhone ? _self.data.USERINFO.realPhone : '',
          cashierNum: app.store.cashierNum.getStore().data,
          storeId: app.store.storeId.getStore().data,
          activeType: activeType,
          orderType: 1,
          sharecardId: (activeType == 3 || activeType == 4) ? _self.data.SHARE_CARD.id : '',
          activeNum: (activeType == 1 || activeType == 5) ? _self.data.INTERGRAL_ACT.activeNum : '',
          couponId: (activeType == 2 || activeType == 5 || activeType == 4) ? _self.data.coupon.id : '',
          integralCount: (activeType == 1 || activeType == 5) ? integralCount : ''
        };
        app.API.facepay(_data).then(res => {
          if(res.state == 1)
          {
            my.reLaunch({url: '/pages/index/index'}); 
          }
        })
      }
  },
});
