<template>
  <div class="index" @click="isShowKeyboard(0); type = 0">
    <toast ref="toast" :tip="tip"></toast>
    <div class="pay">
      <div class="store">
        <div class="store_logo">
          <img :src="shopDetail.storeLogo" alt="">
        </div>
        <p>{{shopDetail.storeName}}</p>
      </div>
      <div class="inputContainer" :class="{active: type == 1}">
        <div class="input flex_box align_center"><span v-if="totalMoney">{{totalMoney}}</span><i class="focus" :class="{'bg-F60F51': focusFlag1}"></i><span
          class="placeholder" v-if="!totalMoney">输入本次需要支付金额</span></div>
      </div>
      <div class="flex" v-show="priType == 1">
        <i class="iconfont icon-huiyishiqueren_huabanfuben" :class="{'bg_FDB300': discountInput}"></i>
        <p>不参与打折金额</p>
      </div>
      <div class="inputContainer" v-show="discountInput" :class="{active: type == 2}">
        <div class="input flex_box align_center">
          <span v-if="notDisMoney">{{notDisMoney}}</span>
          <i class="focus" :class="{'bg-F60F51': focusFlag2}"></i>
          <span class="placeholder" v-if="!notDisMoney">输入不参与折扣的金额</span></div>
      </div>
    </div>

    <div class="module">
      <div class="pay card" @click="priType = priType == 1 ? '' : 1" v-show="svipIsShow">
        <div class="justify_content dashed">
          <div class="left">
            <div class="flex_card"><i class="iconfont icon-gou fc-8D8E98"
                                      :class="{'active-2': priType == 1}"></i>卡主支付<span>推荐使用</span><img
              src="@/assets/imgs/scanPay/card_logo.png" alt=""></div>
            <span style="font-size: .26rem">共享卡非会员也可使用，最低享{{(minSvipDiscount*10).toFixed(1)}}折</span>
          </div>
          <div class="right fc-F7094D" @click="showCardList">-{{svipDiscount ? accDiv(svipDiscount,100) : 0}}元 <i
            class="iconfont icon-arrow-right"></i></div>
        </div>
        <div class="justify_content box-padding">
          <div class="flex_box flex_column align_center">
            <p class="fz-30 txt-ellipsis" style="max-width: 1.5rem;margin-bottom: .12rem">{{cardDetail.realName}}</p>
            <p class="fz-24 fc-8D8E98">卡主</p>
          </div>
          <div class="flex_box flex_column align_center">
            <p class="fz-30" style="margin-bottom: .12rem">{{cardDetail.consumeAmount}}次</p>
            <p class="fz-24 fc-8D8E98">使用次数</p>
          </div>
          <div class="flex_box flex_column align_center">
            <p class="fz-30" style="margin-bottom: .12rem">{{(accDiv(Number(cardDetail.money),100))}}元</p>
            <p class="fz-24 fc-8D8E98">卡主余额</p>
          </div>
          <div class="flex_box flex_column align_center">
            <p class="fz-30" style="margin-bottom: .12rem">{{accMul(Number(cardDetail.shareCardDiscount),10).toFixed(1)}}折</p>
            <p class="fz-24 fc-8D8E98">折扣</p>
          </div>
        </div>
      </div>
      <div class="pay flex-box" @click="priType = priType == 2 ? '' : 2" v-show="actIsShow">
        <i class="iconfont icon-gou fc-8D8E98" :class="{'active-2': priType == 2}"></i>
        <div class="right">
          <p class="fz-30">选择商家活动 <i class="btn_radius fc-ffffff" :class="{'bg-FB768D-FEC1A4': discountType == 1 , 'bg-36E9BB':discountType == 2}" v-show="discountType" style="font-size: .3rem;padding: 0 .06rem">{{discountType == 1 ? '折' : discountType == 2 ? '减' : ''}}</i></p>
          <p class="fz-28 fc-8D8E98">{{disMsg ? disMsg : '满减活动或折扣活动'}}</p>
          <p class="fz-28 fc-F7094D" v-show="notDefFlag">话呗余额不足当前满减以为您匹配下级满减活动</p>
        </div>
        <div class="fz-28 fc-F7094D">-{{defDiscount ? accDiv(defDiscount,100) : 0}}元</div>
      </div>
    </div>
    <div class="pay flex-box" style="justify-content: space-between" @click="chooseCouponFlag" v-show="couponIsShow">
      <div class="flex-box" style="padding: 0">
        <i class="iconfont icon-gou fc-8D8E98" :class="{'active-2': couponPayFlag}"></i>
        <div>
          <p class="fz-30">选择优惠券</p>
          <p class="fz-28 fc-8D8E98">{{coupon_list_length ? '优惠券' : '暂无优惠券'}}</p>
        </div>
      </div>
      <span @click.stop="showCouponList" v-if="coupon_list_length" :class="{'fc-F7094D': coupon}">{{coupon ? '-' + coupon.couponMoney + '元' : '共' + coupon_list_length + '张'}}<i
        class="iconfont icon-arrow-right" style="color: #8D8E98;opacity: .6;margin: 0"></i></span>
    </div>

    <footer>
      <div class="pay_info font-weight"><i>已优惠{{discount ? accDiv(discount,100) : 0}}元,</i>实需支付:{{actPay ? accDiv(actPay,100) : 0}}元</div>
      <button @click="priJudge">立即支付</button>
    </footer>

    <keyboard-num @keyDownEvent="keydown"
                  @backSpaceEvent="backSpace"
                  @closeKeyboardEvent=""
                  ref="keyboard">
    </keyboard-num>

    <card-picker ref="cardPicker"
                 :shopStoreId="storeId"
                 :openid="openid"
                 :totalMoney="oneLevelMoney"
                 @chooseCardEvent="chooseCard"
                 @handleListLength="getCouponLength"
                 @handleCardList="getCardList"
                 @chooseCouponEvent="chooseCoupon">
    </card-picker>


    <transition name="alertMsg">
      <div class="alert" v-show="remainDef || isSvipPayTip">
        <div class="remainDef" v-if="remainDef">
          <div class="close" @click.stop="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
          <div class="title">余额不足</div>
          <p>
            卡主余额不足
          </p>
          <div class="btns">
            <button @click.stop="close">放弃支付</button>
            <button @click.stop="originalPay">原价支付</button>
          </div>
        </div>
        <div class="remainDef" v-if="isSvipPayTip">
          <div class="close" @click.stop="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
          <div class="title">提示</div>
          <p>
            该商家支持卡主支付，非会员也能享受会员折扣，使用卡主付款更优惠！
          </p>
          <div class="btns">
            <button @click.stop="isSvipPay(0)">继续支付</button>
            <button @click.stop="isSvipPay(1)">选择卡主支付</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import toast from '@/components/toast';
  import keyboardNum from '@/components/common/keyboardNum';
  import {shopDetail} from "@/assets/js/comm";
  import {ZSTSweepCodePay, request, getSignIn, concatJsonData , accDiv , accMul , accAdd , Subtr } from "@/assets/js/jsBridge";
  import {regular_uri, ctxPath} from "@/assets/js/concact";
  import wx from "weixin-js-sdk";
  import axios from 'axios';
  import qs from 'qs';
  import cardPicker from '@/components/scanPay/card-picker'
  import {WBT} from "@/assets/js/socket";

  export default {
    name: "index",
    components: {
      toast,
      keyboardNum,
      cardPicker
    },
    data() {
      return {
        focusFlag1: false,
        focusFlag2: false,
        focusTimer: '',
        notDefFlag: '',
        mapCardFlag: true,    //自动匹配分享卡开关
        svipIsShow: false,             //卡主部分是否显示
        actIsShow: false,               //折扣满减活动是否显示
        couponIsShow: false,            //卡券活动是否显示
        userAgentType: '',              //打开应用类型
        mercId: this.$route.query.mercId,                   //商户编号
        orgid: this.$route.query.orgid,                    //机构号
        trmNO: this.$route.query.trmNO,
        deskNo: this.$route.query.no,
        shareuserId: this.$route.query.shareuserId ? this.$route.query.shareuserId : '',
        scanSrc: this.$route.query.scanSrc ? this.$route.query.scanSrc : '0',
        channelStoreNum: '',      //卡主支付mercId
        channelTrmNO: '',         //卡主支付trmNo
        suportSvip: this.$route.query.suportSvip,            //支持招募卡主字段
        code: '',                                           //微信网页认证code
        openid: '',              //账号openid
        user: '',                               //账户信息
        storeId: this.$route.query.storeId,                  //店铺storedId
        rate: '',                                            //折扣活动折扣率
        consumeMoney: '',                                   //满减活动满金额
        availableIntegral: '',                              //满减活动减金额
        activeNum: '',                                      //活动编号
        nowTime: '',
        allienceTips: '',
        ZSTPayWay: 2,
        tip: '',
        shopDetail: '',       //店铺详情
        miniAppId: '',        //小程序appId
        discountAct: [],      //折扣活动集合
        reduAct: [],          //满减活动集合
        discountType: '',
        consumeMoneys: [],   //满减要求金额集合
        act: '',            //当前满减活动
        actIndex: '',       //满减活动索引
        def_status: 0,
        remainDef: false,  //余额不足状态 true余额不足
        isSvipPayTip: false,                  //是否使用卡主支付弹框
        discountInput: true,
        cardDetail: '',    //分享卡详情
        minSvipDiscount: '',   //卡主最低折扣
        cardType: '',  //卡类型 1主卡 2分享卡
        shareCardCount: '',  //分享卡总数
        biIntegralactiveCount: '',  //满减活动总数
        shopPayChannelCount: '',   //是否开通支付通道
        cardList: '',
        totalMoney: '',     //总金额
        actPay: '',          //实际支付金额
        discount: '',       //优惠金额
        svipActPay: '',    //卡主实际支付金额
        svipDiscount: '',   //卡主优惠金额
        defActPay: '',      //满减折扣实际支付金额
        defDiscount: '',    //满减折扣优惠金额
        defActiveNum: '',   //满减活动编号
        couponActPay: '',   //卡券实际支付金额
        couponDiscount: '',  //卡券优惠金额
        couponActiveNum: '',  //卡券活动编号
        notDisMoney: '',   //不参与打折金额
        disMoney: '',      //参与打折金额
        oneLevelMoney: '',   //一级计算金额
        couponPayFlag: false,   //优惠券开关控制器
        type: '',        //输入框选择 1输入总订单金额 2输入不参与打折金额
        priType: 1,     //折扣方式 1卡主支付 2满减或折扣 3优惠券满减或折扣
        disMsg: '',    //抵扣提示信息
        //          卡券部分
        coupon_list_length: '',
        coupon: '',
        refStoreId: this.$route.query.refStoreId,
        WB: '',         //webSocket请求对象
        skinfo: '',      //航佰返回支付金额集合
        orderid: '',
        SVIP_PAY_CHANEL: '',   //卡主支付支付参数
        ACTIVE_PAY_CHANEL: '',  //商家活动支付支付参数
        allienceDiscountCard: '',

        ALLIENCE_PAY: {allienceActPay: '',allienceDiscount: '', allienceActPay_ceil: '',allienceDiscount_ceil: '' , levelUpDiscount: '',}  //联盟打折卡支付金额
      }
    },
    methods: {
      accDiv(num1,num2){
        return accDiv(num1,num2)
      },
      accAdd(num1,num2){
        return accAdd(num1,num2)
      },
      accMul(num1,num2){
        return accMul(num1,num2)
      },
      Subtr(num1,num2){
        return Subtr(num1,num2)
      },
      /**
       * 关闭所有弹窗
       * */
      close() {
        var _self = this;
        _self.remainDef = false;
        _self.isSvipPayTip = false;
      },


      /**UTF8中文解码*/
      chineseFromUtf8Url(strUtf8) {
        var bstr = decodeURIComponent(strUtf8);
        return bstr;
      },


      /** 提醒黑窗口弹出*/
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },

      /** 模拟input框获取焦点*/
      focus(){
        var _self = this;
        if(_self.type == 1){
          clearInterval(_self.focusTimer);
          _self.focusFlag2 = false;
          _self.focusTimer = setInterval(() => {
            _self.focusFlag1 = !_self.focusFlag1;
          },500)
        }else if(_self.type == 2){
          clearInterval(_self.focusTimer);
          _self.focusFlag1 = false;
          _self.focusTimer = setInterval(() => {
            _self.focusFlag2 = !_self.focusFlag2;
          },500)
        }
      },


      /**
       * 定义键盘事件
       * */
      keydown(num) {
        var _self = this;
        var regx = /^(([0-9][0-9]{0,9}[.])|([0-9][0-9]{0,9}[.][0-9]{1,2})|([0-9][0-9]{0,9})|([0][.][0-9]{1}[1-9]{1}))$/;
        /*参与折扣金额键盘输入*/
        if (_self.type == 1) {
          var testData1 = _self.totalMoney + num;
          if (regx.test(testData1) && Number(testData1) < 100000) {
            _self.totalMoney = testData1;
          }
        }
        /*不参与折扣金额键盘输入*/
        else if (_self.type == 2) {
          var testData2 = _self.notDisMoney + num;
          if (regx.test(testData2) && Number(testData2) < 100000) {
            _self.notDisMoney = testData2;
          }
        }
      },
      /**
       * 回车事件
       * */
      backSpace() {
        var _self = this;
        if (_self.type == 1) {
          _self.totalMoney = String(_self.totalMoney).slice(0, -1);
        } else if (_self.type == 2) {
          _self.notDisMoney = String(_self.notDisMoney).slice(0, -1);
        }
      },
      /**
       * 显示或关闭键盘
       * */
      isShowKeyboard(status) {
        var _self = this;
        if(status == 0){
          _self.focusFlag1 = false;
          _self.focusFlag2 = false;
          clearInterval(_self.focusTimer);
        }
        _self.$refs.keyboard.isShowKeyboard(status);
      },
      /**
       * 阻止系统键盘弹起
       * 判断input框类型
       * @param type 1 参与折扣input
       * @param type 2 不参与折扣input
       * */
      stopActiveEvent(type) {
        var _self = this;
        // document.activeElement.blur();
        _self.type = type;
        _self.focus();
        _self.isShowKeyboard(1);
      },


      /**初始化*/
      init() {
        var _self = this;
        _self.getUserAgentType();
        // _self.userAgentType = "WXPAY";
        if(_self.userAgentType == 'miniProgram'){
          _self.code = request['code'];
        }else if(_self.userAgentType == 'WXPAY'){
          _self.code = request['code'];
        }else if(_self.userAgentType == 'ALIPAY'){
          _self.code = _self.$route.query.auth_code;
        }
        _self.getUserInfo();
        _self.getStoreInfo();
        _self.getShopDetail();
        _self.getsvippayChannel();
        _self.concatHB();
        window.document.title = '助商通商家联盟';
      },
      /**判断APP类型*/
      getUserAgentType() {
        var _self = this;
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('AlipayClient') > -1) {
          _self.userAgentType = "ALIPAY";
        } else if (/.*micromessenger.*miniprogram.*/.test(userAgent.toLowerCase())) {
          _self.userAgentType = "miniProgram";
        } else if (userAgent.indexOf('MicroMessenger') > -1) {
          _self.userAgentType = "WXPAY";
        } else {
          // TODO 跳转到错误页
          _self.$router.push(
            {
              name: 'error'
            }
          )
        }
      },

      /** 满减活动按满足金额排序*/
      sortConsume(a, b) {
        return a.consumeMoney - b.consumeMoney;
      },

      /** 满减活动按优惠金额排序*/
      sortIntergal(a, b) {
        return a.availableIntegral - b.availableIntegral;
      },

      /**获取用户信息openId*/
      getUserInfo() {
        var _self = this;
        var _data = {
          code: String(_self.code)
        };
        // _self.$refs.cardPicker.getCouponList(_self.openid);
        if (_self.userAgentType == 'WXPAY' || _self.userAgentType == 'miniProgram') {
          axios.post(regular_uri.userInfo + _self.code).then(res => {
            if (res.data.state == 1) {
              _self.openid = res.data.openId;
              _self.user = res.data.user;
              _self.$refs.cardPicker.getCouponList(_self.openid,'');
            } else {
              _self.toast(decodeURIComponent(res.data.msg))
            }
          });
        }else if(_self.userAgentType == 'ALIPAY'){
          axios.post(regular_uri.userInfo + _self.code + '?shopStoreId=' + _self.storeId).then(res => {
            if (res.data.state == 1) {
              _self.user = res.data.user;
              _self.$refs.cardPicker.getCouponList('',_self.user.userId);
            } else {
              _self.toast(decodeURIComponent(res.data.msg))
            }
          });
        }
      },

      /**获取店铺信息*/
      getStoreInfo() {
        var _self = this;
        var _data = {
          storeId: String(_self.storeId)
        };

        axios.get(regular_uri.storeInfo + '?storeId=' + _self.storeId).then(res => {
          if (res.data.state == 1) {
            var _data = res.data.data;
            _data.forEach(e => {
              if (e.discountType == 1) {
                _self.discountAct.push(e);
                _self.rate = e.discountRate * 100 / 100;
                _self.discountType = 1;
              } else if (e.discountType == 2) {
                _self.discountType = 2;
                _self.reduAct.push(e);
              }
            });
            _self.reduAct = _self.reduAct.sort(_self.sortConsume);
            _self.reduAct.forEach(e => {
              _self.consumeMoneys.push(e.consumeMoney);
            })
          }
        }).catch(e => {
          console.log(e)
        })

      },

      getsvippayChannel(){
        var _self = this;
        var _data = qs.stringify({
          shopStoreId: String(_self.storeId)
        })
        axios({
          method: 'post',
          url: ctxPath + '/sapi/voip/shop/store/svippay/channel',
          data: _data
        }).then(res => {
          if(res.data.state == 1){
            _self.channelStoreNum = res.data.data.channelStoreNum;
            _self.channelTrmNO = res.data.data.channelTrmNO;
          }else{
            _self.toast(decodeURIComponent(res.data.msg))
          }
        })
      },

      concatHB(){
        var _self = this;
        var callbackObj = {
          returnorder: _self.returnorder,
          returnpay: _self.returnpay
        }
        _self.WB = new WBT('wss://www.myhbsoft.com/wssmzf/',callbackObj);
        _self.WB.initWs().then(res => {
          if(res == 1){
            var concat_data = {
              "Type":"connection",
              "storeid":_self.refStoreId
              // "storeid":'005800500046005F00560046'
            };
            _self.WB.send(concat_data);
            var getorder_data = {
              "Type":"getorder",
              "storeid":_self.refStoreId,
              // "storeid":'005800500046005F00560046',
              "th":_self.deskNo
            }
            _self.WB.send(getorder_data);
          }
        })


      },

      returnorder(e){
        var _self = this;
        if(e.errcode == 0){
          var notDisMoney=0;
          var totalMoney=0;
          e.cpinfo.forEach(ele => {
            if(ele.kz == '1'){
              notDisMoney += accMul(Number(ele.hyj),Number(ele.sl))   //参与折扣金额
            }
            totalMoney += accMul(Number(ele.dj),Number(ele.sl));
          });
          _self.totalMoney = totalMoney;   //订单总金额
          _self.notDisMoney = Subtr(Number(_self.totalMoney),Number(notDisMoney));   //不参与折扣金额
          _self.skinfo = e.skinfo;
          _self.orderid = e.zdinfo[0].djh;
        }else{
          _self.toast(decodeURIComponent(e.errmsg))
        }
      },

      returnpay(e){
        var _self = this;
        if(e.errcode == 0){

        }else{
          _self.toast(decodeURIComponent(e.errmsg))
        }
      },

      /**助商通内选择支付方式*/
      changeWay(payWay) {
        var _self = this;
        _self.ZSTPayWay = payWay;
      },

      /** 匹配话呗余额适合的满减活动*/
      mapAct() {
        var _self = this;
        try {
          if (_self.reduAct.length != 0) {
            var _reduAct = [];
            var _list = [];
            _self.reduAct.forEach(ele => {
              if (Number(_self.disMoney >= ele.consumeMoney)) {
                _list.push(ele.availableIntegral);
                _reduAct.push(ele);
              }
            });
            if (_self.user.totalmoney) {
              _list.push(_self.user.totalmoney);
              _list = _list.sort(function (a, b) {
                return Number(a) - Number(b);
              });
              _reduAct = _reduAct.sort(_self.sortIntergal);
              var actIndex = _list.indexOf(Number(_self.user.totalmoney)) - 1;
              if (_reduAct[actIndex + 1].availableIntegral == _self.user.totalmoney) {
                actIndex = actIndex + 1
              }
              if (actIndex == -1) {
                _self.act = '';
              } else {
                _self.act = _reduAct[actIndex];
              }
              _self.isSubmit();
            } else {
              _self.toast("暂无用户信息")
            }
          }
        } catch (e) {
          alert(e);
        }

      },

      /**判断支付宝和微信*/
      isSubmit() {
        var _self = this;
        // _self.totalMoney = _self.totalMoney ? Number(_self.totalMoney) : _self.totalMoney;
        if (_self.userAgentType == 'ALIPAY') {
          _self.judgeAlert();
        } else if (_self.userAgentType == 'WXPAY' || _self.userAgentType == 'miniProgram') {
          _self.judgeAlert();
        }
      },

      /**满减或折扣活动金额计算*/
      judgeAlert() {
        var _self = this;
        _self.def_status = 0;
        switch (true) {
          case (Boolean(_self.rate && _self.disMoney)) :
            _self.mapRate();
            break;
          case (Boolean(_self.reduAct.length != 0 && _self.disMoney)) :
            _self.mapDef();
            break;
          default :
            _self.disMsg = '';
            _self.defActPay = Math.ceil(accAdd(accMul(_self.disMoney,100),accMul(_self.notDisMoney,100)));
            _self.defDiscount = 0;
            _self.defActiveNum = '';
        }
      },

      /**
       * 匹配折扣信息
       */
      mapRate(){
        var _self = this;
        var discount;
        discount = Subtr(Number(_self.disMoney),accMul(accMul(Number(_self.disMoney),_self.rate),0.1));
        if (_self.user.totalmoney >= discount) {
          _self.defActPay = Math.ceil(accAdd(accMul(accMul(_self.disMoney,_self.rate),10),accMul(_self.notDisMoney,100)));
          _self.defDiscount = _self.coupon ?
            Subtr(Subtr(accMul(_self.totalMoney, 100), _self.defActPay),accMul(_self.coupon.couponMoney,100)) :
            Subtr(accMul(_self.totalMoney, 100), _self.defActPay);
          _self.disMsg = '享'+ accMul(_self.rate,1) + '折,' +'话呗抵扣 : ' + accDiv(_self.defDiscount, 100) + '元';
          _self.defActiveNum = _self.discountAct[0].id;
        } else {
          _self.disMsg = '话呗余额不足';
          _self.defActPay = Math.ceil(accAdd(accMul(_self.disMoney,100),accMul(_self.notDisMoney,100)));
          _self.defDiscount = 0;
          _self.defActiveNum = ''
        }
      },

      /**
       * 匹配满减信息
       */
      mapDef(){
        var _self = this;
        try {
          if (_self.user.totalmoney >= _self.reduAct[0].availableIntegral) {      //判断话呗余额是否达到最低满减
            if (_self.act) {
              if (_self.user.totalmoney >= _self.act.availableIntegral) {
                _self.disMsg = "满" + _self.act.consumeMoney + "元减" + accMul(_self.act.availableIntegral,1) + "元";
                _self.defActPay = Math.ceil(accMul(accAdd(Subtr(Number(_self.disMoney),_self.act.availableIntegral),_self.notDisMoney),100));
                _self.defDiscount = accMul(_self.act.availableIntegral,100);
                _self.defActiveNum = _self.act.id;
              } else {
                _self.notDefFlag = true;
                _self.mapAct();
              }
            } else {
              var obj = _self.reduAct[_self.actIndex + 1];
              _self.disMsg = "满" + obj.consumeMoney + "元减" + accMul(obj.availableIntegral,1) + "元,当前还差" + (obj.consumeMoney - Number(_self.disMoney)).toFixed(1) + '元';
              _self.defActPay = Math.ceil(accAdd(accMul(_self.disMoney, 100),accMul(_self.notDisMoney,100)));
              _self.defDiscount = 0;
              _self.defActiveNum = '';
            }
          } else if (_self.disMoney) {                                  //余额不足最低满减 提醒余额不足选择充值或原价付
            _self.disMsg = "话呗余额不足";
            _self.defActPay = Math.ceil(accAdd(accMul(_self.disMoney,100),accMul(_self.notDisMoney,100)));
            _self.defDiscount = 0;
            _self.defActiveNum = '';
          }
        } catch (e) {
          console.log(e);
        }
      },

      /**满减或折扣活动确认支付-APP类型判断*/
      pay() {
        var _self = this;
        if (_self.userAgentType == 'WXPAY') {
          _self.wxPay();
        }else if (_self.userAgentType == "ALIPAY") {
          _self.ALIPay();
        }else if(_self.userAgentType == 'miniProgram'){
          var _data = {
            storeId: _self.storeId,
            trmNo: _self.trmNO,
            mercId: _self.mercId,
            no: _self.deskNo,
            amount: _self.actPay<1 ? 1 : _self.actPay,
            totalAmount: Math.round(Number(accMul(_self.totalMoney,100))),
            shareuserId: _self.shareuserId,
            activeNum: _self.defActiveNum,
            isOriginPricePay: _self.defDiscount==0 ? '1' : '',
            integralCount: accDiv(_self.defDiscount,100),
            payType: '2'
          };
          var params = concatJsonData(_data);
          var redirect_url = '../../pages/webPay/main' + params;
          wx.miniProgram.navigateTo({url: redirect_url});
        }
      },

      /** 支付宝支付*/
      ALIPay() {
        var _self = this;
        var Reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        var _totalAmount = Math.round(_self.totalMoney * 100);
        var actPay = _self.actPay;
        if (actPay < 1) {
          actPay = 1;
        }
        if (Reg.test(_totalAmount) && _totalAmount > 0) {
          var _data = qs.stringify({
            'storeId': _self.storeId,
            'mercId': _self.mercId,
            'trmNo': _self.trmNO,
            'no': _self.deskNo,
            'amount': actPay,
            'totalAmount': _totalAmount,
            'shareuserId': _self.shareuserId,
            'scanSrc': _self.scanSrc,
            'activeNum': _self.defActiveNum,
            'integralCount': accDiv(_self.defDiscount,100),
            'userId': String(_self.user.userId),
            'isOriginPricePay': _self.defDiscount==0 ? '1' : '',
            'totalmoney': _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
          });
          _self.ALIPayConfig(_data);
        } else {
          alert("请输入正确金额")
        }
      },
      ALIPayConfig(data){
        axios({
          url: regular_uri.AliPay,
          method: 'post',
          data: data
        }).then(res => {
          if (res.data.state == 1) {
            window.location.href = res.data.aliPayUrl;
          } else {
            this.toast(decodeURIComponent(res.data.msg));
          }
        })
      },
      /**微信支付*/
      wxPay() {
        var _self = this;
        var discount = Number(_self.totalMoney)*100 - _self.actPay;
        var Reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        var _totalAmount = Math.round(_self.totalMoney * 100);
        if (Reg.test(_self.actPay) && _self.actPay > 0) {
          if (_self.userAgentType == 'WXPAY' || _self.userAgentType == 'miniProgram') {
            var url = regular_uri.wxPay + '?miniAppId=' + _self.miniAppId + '&storeId=' + _self.storeId + "&no=" + _self.deskNo +  '&trmNo=' +
              _self.trmNO + "&payWay=" + 'WXPAY' + "&amount=" + Math.round(_self.actPay) + "&totalAmount=" + _totalAmount + "&mercId=" +
              _self.mercId + "&integralCount=" + (accDiv(discount,100) || 0) + "&openid=" + _self.openid +  "&userId=" + _self.user.userId + '&subject=' + '用户扫码支付' +
              "&activeNum=" + _self.activeNum + "&shareuserId="+_self.shareuserId+"&scanSrc="+_self.scanSrc + "&totalmoney=" + _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '';
            axios.post(url).then(res => {
              _self.wxPayConfig(res.data)
            })
          }
        } else {
          //TODO 清空页面表单元素
          alert("付款金额有误");
        }
        // _self.close();
      },
      /**微信支付配置支付参数*/
      wxPayConfig(_data) {
        var _self = this;
        if (_data.state == 1) {
          var data = _data.data;
          var _appId = data.apiAppid;
          var timeStamp = data.apiTimestamp;
          var nonceStr = data.apiNoncestr;
          var package1 = data.apiPackage;
          var signType = data.apiSigntype;
          var paySign = data.apiPaysign;
          // var txn_amt = res.txn_amt;
          var pay_time = data.sysTime;
          var order_no = data.orderNo;

          // alert(package1)
          function onBridgeReady() {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": _appId, //公众号名称，由商户传入
                "timeStamp": timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": nonceStr, //随机串
                "package": package1,
                "signType": signType, //微信签名方式：
                "paySign": paySign //微信签名
              },
              function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  //TODO 成功后的页面跳转
                  _self.$router.replace({
                    name: 'pay_success',
                    query: {
                      logo: encodeURIComponent(_self.shopDetail.storeLogo),
                      storeName: _self.shopDetail.storeName,
                      address: _self.shopDetail.address,
                      totalAmount: _self.totalMoney,
                      amount: accDiv(_self.actPay,100),
                      notDisMoney: Number(_self.notDisMoney),
                      payWay: 2,
                      orderTime: pay_time,
                      discount: accDiv(_self.discount,100),
                      discountType: _self.priType,
                      suportSvip: _self.suportSvip,
                      totalmoney: Number(_self.user.totalmoney) - accDiv(_self.discount,100)
                    }
                  })
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                  _self.toast('取消支付')
                } else {
                  console.log(res.err_msg)
                  console.log(res.err_desc)
                  _self.$router.replace({
                    name: 'fail',
                    query: {
                      amount: accDiv(_self.actPay,100),
                      discount: accDiv(_self.discount,100),
                      orderTime: pay_time,
                      storeName: _self.shopName,
                      order_no: order_no,
                      err_msg: res.err_msg,
                      err_desc: res.err_desc,
                      def_status: _self.def_status,
                      def_money: Number(_self.user.totalmoney) - accDiv(_self.discount,100)
                    }
                  })
                }
              }
            );
          }

          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
          } else {
            onBridgeReady();
          }

        } else {
          //TODO 渠道下单失败
          _self.toast(decodeURIComponent(res.data.msg))

        }
      },

      /**
       * 获取SVIP卡信息
       * */
      getShopDetail() {
        var _self = this;
        var _data = {
          shopStoreId: String(_self.storeId)
        };
        axios({
          url: ctxPath + '/sapi/voip/offlinerorder/pay/page',
          method: 'get',
          header: {
            miniProgram:"ios",//新增的判断为安卓还是ios
          },
          params: _data
        }).then(res => {
          if (res.data.state == 1) {
            _self.shopPayChannelCount = res.data.shopPayChannelCount;
            _self.shareCardCount = res.data.shareCardCount;
            _self.cardDetail = res.data.data;
            _self.minSvipDiscount = res.data.data.shareCardDiscount;
            _self.shopDetail = res.data.bishopStore;
            _self.biIntegralactiveCount = res.data.biIntegralactiveCount;
            if(_self.shopPayChannelCount && _self.shareCardCount){             //有共享卡，开通收银
              _self.svipIsShow = true;
              _self.actIsShow = true;
              _self.couponIsShow = true;
              _self.priType = 1;
            }else if(_self.shopPayChannelCount && !_self.shareCardCount){       //没有有效的共享卡 ，开通收银
              _self.actIsShow = true;
              _self.couponIsShow = true;
              _self.priType = 2;
            }else if(!_self.shopPayChannelCount && _self.shareCardCount){         //有共享卡，没有开通收银
              _self.svipIsShow = true;
              _self.priType = 1;
            }else{                                                                  //没有有效的共享卡 ，没有开通收银
              _self.$router.replace({
                name: 'notPayChanel',
                logo: _self.shopDetail.storeLogo,
                storeName: _self.shopDetail.storeName
              })
            }
          } else {
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },

      /**
       * 接收子组件分享卡集合
       * @param data  分享卡集合
       */
      getCardList(data){
        this.cardList = data;
      },

      /**
       * 自动匹配分享卡
       */
      mapCard(){
        var _self = this;
        if(_self.cardList.length > 0){
          for(var i=0;i<_self.cardList.length;i++){
            var svipActPay = accMul(accMul(_self.cardList[i].shareCardDiscount,Number(_self.disMoney)),100)
            if(_self.cardList[i].money >= svipActPay){
              return _self.cardList[i];
            }
          }
        }else{
          return false;
        }
      },

      /** 显示分享卡列表*/
      showCardList() {
        var _self = this;
        _self.$refs.cardPicker.showCardList();
      },

      /**
       * 切换分享卡
       * @param card
       */
      chooseCard(card) {
        this.mapCardFlag = false;
        this.cardDetail = card;
      },

      /**
       * 卡主支付——按分享卡折扣——下单
       * */
      svipPay() {
        var _self = this;
        var _data;
        if (_self.userAgentType == 'ALIPAY') {
          _data = {
            storeId: '860000000000001',
            mercId: String(_self.channelStoreNum),
            trmNo: String(_self.channelTrmNO),
            no: String(_self.deskNo),
            amount: String(Number(_self.actPay)),
            totalAmount: String(Number(_self.totalMoney) * 100),
            nonPartakeMoney: String(Number(_self.notDisMoney) * 100),
            subject: _self.shopDetail.storeName + '卡主支付',
            sharecardId: String(_self.cardDetail.id),
            shareuserId: String(_self.shareuserId),
            scanSrc: String(_self.scanSrc),
            userId: String(_self.user.userId),
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
          };
          _self.svipALIPAY(_data);
        } else if (_self.userAgentType == 'WXPAY') {
          _data = {
            storeId: '860000000000001',
            mercId: String(_self.channelStoreNum),
            trmNo: String(_self.channelTrmNO),
            no: String(_self.deskNo),
            userId: String(_self.user.userId),
            openid: String(_self.openid),
            amount: String(Number(_self.actPay)),
            totalAmount: String(Number(_self.totalMoney) * 100),
            nonPartakeMoney: String(Number(_self.notDisMoney) * 100),
            subject: _self.shopDetail.storeName + '卡主支付',
            sharecardId: String(_self.cardDetail.id),
            shareuserId: String(_self.shareuserId),
            scanSrc: String(_self.scanSrc),
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
          };
          _self.svipWXPAY(_data);
        }else if(_self.userAgentType == 'miniProgram'){
          _data = {
            storeId: '860000000000001',
            trmNo: String(_self.channelTrmNO),
            mercId: String(_self.channelStoreNum),
            no: String(_self.deskNo),
            amount: String(Number(_self.actPay)),
            totalAmount: String(accMul(_self.totalMoney,100)),
            shareuserId: String(_self.shareuserId),
            sharecardId: String(_self.cardDetail.id),
            nonPartakeMoney: String(accMul(_self.notDisMoney,100)),
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
            payType: '1'
          };
          var params = concatJsonData(_data);
          var redirect_url = '../../pages/webPay/main' + params;
          wx.miniProgram.navigateTo({url: redirect_url});
        }
      },

      /**
       * 卡主支付——原价支付——下单
       */
      originalPay() {
        var _self = this;
        var _data;
        _self.actPay = accMul(_self.totalMoney,100);
        if (_self.userAgentType == 'ALIPAY') {
          _data = {
            storeId: '860000000000001',
            mercId: String(_self.channelStoreNum),
            trmNo: String(_self.channelTrmNO),
            no: String(_self.deskNo),
            amount: String(accMul(_self.totalMoney,100)),
            totalAmount: String(Number(_self.totalMoney) * 100),
            nonPartakeMoney: String(Number(_self.notDisMoney) * 100),
            subject: _self.shopDetail.storeName + '卡主支付',
            sharecardId: String(_self.cardDetail.id),
            shareuserId: String(_self.shareuserId),
            scanSrc: String(_self.scanSrc),
            isOriginPricePay: 1,
            userId: String(_self.user.userId),
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : ''
          };
          _self.svipALIPAY(_data);
        } else if (_self.userAgentType == 'WXPAY') {
          _data = {
            storeId: '860000000000001',
            mercId: String(_self.channelStoreNum),
            trmNo: String(_self.channelTrmNO),
            no: String(_self.deskNo),
            userId: String(_self.user.userId),
            openid: String(_self.openid),
            amount: String(accMul(_self.totalMoney,100)),
            totalAmount: String(Number(_self.totalMoney) * 100),
            nonPartakeMoney: String(Number(_self.notDisMoney) * 100),
            subject: _self.shopDetail.storeName + '卡主支付',
            sharecardId: String(_self.cardDetail.id),
            shareuserId: String(_self.shareuserId),
            scanSrc: String(_self.scanSrc),
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
            isOriginPricePay: 1
          };
          _self.svipWXPAY(_data);
        }else if(_self.userAgentType == 'miniProgram'){
          _data = {
            storeId: '860000000000001',
            trmNo: String(_self.channelTrmNO),
            mercId: String(_self.channelStoreNum),
            no: String(_self.deskNo),
            amount: String(accMul(_self.totalMoney,100)),
            totalAmount: String(accMul(_self.totalMoney,100)),
            shareuserId: String(_self.shareuserId),
            sharecardId: String(_self.cardDetail.id),
            nonPartakeMoney: String(accMul(_self.notDisMoney,100)),
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
            payType: '1',
            isOriginPricePay: '1'
          };
          var params = concatJsonData(_data);
          var redirect_url = '../../pages/webPay/main' + params;
          wx.miniProgram.navigateTo({url: redirect_url});
        }
      },

      /**
       * 卡主支付——支付宝
       * @param _data 实际支付
       */
      svipALIPAY(_data) {
        var _self = this;
        axios({
          method: 'post',
          url: regular_uri.svipAliPay,
          data: qs.stringify(_data)
        }).then(res => {
          if (res.data.state == 1) {
            window.location.href = res.data.aliPayUrl;
          } else if (res.data.state == 900260) {    //余额不足
            _self.remainDef = true;
          } else {
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },

      /**
       * 卡主支付——微信
       * @param _data 实际支付
       */
      svipWXPAY(_data) {
        var _self = this;
        axios({
          method: 'post',
          url: regular_uri.svipWxPay,
          data: qs.stringify(_data)
        }).then(res => {
          if (res.data.state == 1) {
            _self.wxPayConfig(res.data);
          } else if (res.data.state == 900260) {  //余额不足
            _self.remainDef = true;
          } else {
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },


      /**
       * 获取卡券总数量
       * @param length
       */
      getCouponLength(length) {
        this.coupon_list_length = length;
      },

      /**
       * 显示优惠券列表
       */
      showCouponList() {
        var _self = this;
        _self.$refs.cardPicker.showCouponList();
      },

      /**
       * 选择卡券
       * @param coupon
       */
      chooseCoupon(coupon) {
        var _self = this;
        _self.coupon = coupon;
      },

      /**
       * 使用优惠券下单支付
       */
      couponPay() {
        var _self = this;
        if (_self.userAgentType == 'ALIPAY') {
          _self.couponALIPAY();
        } else if (_self.userAgentType == 'WXPAY') {
          _self.couponWXPAY();
        }else if(_self.userAgentType == 'miniProgram'){
          var _data = {
            storeId: _self.storeId,
            trmNo: _self.trmNO,
            mercId: _self.mercId,
            no: _self.deskNo,
            amount: Number(_self.actPay),
            totalAmount: accMul(_self.totalMoney , 100),
            shareuserId: _self.shareuserId,
            activeNum: _self.coupon ? _self.coupon.cardCouponActiveId : '',
            couponId: _self.coupon ? _self.coupon.id : '',
            isOriginPricePay: _self.coupon ? '' : '1',
            integralCount: _self.coupon ? Math.round(_self.coupon.couponMoney * 100 / 100) : 0,
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
            payType: '2'
          };
          var params = concatJsonData(_data);
          var redirect_url = '../../pages/webPay/main' + params;
          wx.miniProgram.navigateTo({url: redirect_url});
        }
      },

      /**
       * 优惠券下单支付——支付宝支付
       */
      couponALIPAY() {
        var _self = this;
        var _data = qs.stringify({
          storeId: _self.storeId,
          mercId: _self.mercId,
          trmNo: _self.trmNO,
          no: _self.deskNo,
          amount: Number(_self.actPay),
          totalAmount: Number(_self.totalMoney * 100),
          activeNum: _self.coupon ? _self.coupon.cardCouponActiveId : '',
          couponId: _self.coupon ? _self.coupon.id : '',
          integralCount: _self.coupon ? Math.round(_self.coupon.couponMoney * 100 / 100) : 0,
          shareuserId: String(_self.shareuserId),
          scanSrc: String(_self.scanSrc),
          userId: String(_self.user.userId),
          totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
          isOriginPricePay: _self.coupon ? '' : '1'
        });
        _self.ALIPayConfig(_data);
      },

      /**
       * 优惠券下单支付——微信支付
       */
      couponWXPAY() {
        var _self = this;
        var _data = qs.stringify({
          storeId: _self.storeId,
          trmNo: _self.trmNO,
          payWay: 'WXPAY',
          amount: Math.round(Number(_self.actPay)),
          totalAmount: Math.round(Number(_self.totalMoney) * 100),
          mercId: _self.mercId,
          integralCount: _self.coupon ? Math.round(_self.coupon.couponMoney * 100 / 100) : 0,
          userId: String(_self.user.userId),
          openid: String(_self.openid),
          subject: _self.coupon ? '优惠券支付' : '原价支付',
          activeNum: _self.coupon ? _self.coupon.cardCouponActiveId : '',
          couponId: _self.coupon ? _self.coupon.id : '',
          shareuserId: String(_self.shareuserId),
          scanSrc: String(_self.scanSrc),
          totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
          no: String(_self.deskNo)
        });
        axios({
          method: 'post',
          url: regular_uri.wxPay,
          data: _data
        }).then(res => {
          _self.wxPayConfig(res.data)
        })
      },


      /** 原价支付*/
      originalPayPublic(){
        var _self = this;
        _self.actPay = Number(_self.totalMoney);
        if(_self.userAgentType == 'WXPAY'){
          _self.wxPay();
        }else if(_self.userAgentType == 'ALIPAY'){
          _self.ALIPay();
        }else if(_self.userAgentType == 'miniProgram'){
          var _data = {
            storeId: _self.storeId,
            trmNo: _self.trmNO,
            mercId: _self.mercId,
            no: _self.deskNo,
            amount: _self.actPay<1 ? 1 : accMul(_self.actPay,100),
            totalAmount: Math.round(Number(accMul(_self.totalMoney,100))),
            shareuserId: _self.shareuserId,
            activeNum: _self.defActiveNum,
            isOriginPricePay: _self.defDiscount==0 ? '1' : '',
            integralCount: accDiv(_self.defDiscount,100),
            totalmoney: _self.user.totalmoney ? accMul(_self.user.totalmoney,1) : '',
            payType: '2'
          };
          var params = concatJsonData(_data);
          var redirect_url = '../../pages/webPay/main' + params;
          wx.miniProgram.navigateTo({url: redirect_url});
        }
      },

      /**判断优惠活动类型,确认支付下单付款*/
      priJudge() {
        var _self = this;
        if (Number(_self.totalMoney)) {
          if (_self.priType == 1) {                    //卡主支付
            if(Number(_self.totalMoney) < Number(_self.notDisMoney)){
              _self.toast("订单总金额请勿小于不参与折扣金额");
            }else{
              _self.svipPay();
            }
          } else if (_self.priType == 2) {             //折扣或满减活动
            _self.pay();
          } else if (_self.couponPayFlag && !_self.priType) {             //优惠券折扣满减
            _self.couponPay();
          }else{                                     //原价支付
            _self.originalPayPublic();
          }
        } else if (isNaN(_self.totalMoney)) {
          _self.toast('请输入正确金额');
        } else {
          _self.toast('请输入付费金额');
        }
      },

      /**
       * 继续当前活动支付
       */
      isSvipPay(status){
        var _self = this;
        if(status){
          _self.priType = 1;
          _self.priTypeEvent();
          _self.svipPay();
        }else{
          if(_self.priType == 2){
            _self.pay();
          }else if(_self.priType == 3){
            _self.couponPay();
          }
        }
        _self.close();
      },


      /**
       * 计算各个活动最终付款金额
       * */
      calMoney() {
        var _self = this;
        if(_self.coupon && Number(Subtr(Number(_self.oneLevelMoney), _self.coupon.couponMoney)) <0 && (Number(_self.oneLevelMoney) > _self.coupon.consumeMoney || Number(_self.oneLevelMoney) == _self.coupon.consumeMoney)){
          _self.disMoney = 0;
          _self.svipActPay = accMul(Number(_self.notDisMoney),100);
          _self.svipDiscount = 0;
          _self.defActPay = accMul(Number(_self.notDisMoney),100);
          _self.defDiscount = 0;
          _self.couponActPay = accMul(Number(_self.notDisMoney),100);
          _self.couponDiscount = accMul(_self.oneLevelMoney,100);
        }else{
          if(Number(_self.oneLevelMoney)){
            _self.disMoney = _self.coupon ? Subtr(Number(_self.oneLevelMoney), _self.coupon.couponMoney) : _self.oneLevelMoney;
          }else{
            _self.disMoney = 0;
          }
          if (_self.reduAct.length != 0) {
            var _list = [];
            _self.consumeMoneys.forEach(e => {
              _list.push(e);
            });
            _list.push(Number(_self.disMoney));
            _list = _list.sort(function (a, b) {
              return Number(a) - Number(b);
            });
            var actIndex = _list.indexOf(Number(_self.disMoney)) - 1;
            if (_self.consumeMoneys[actIndex + 1] == _self.disMoney) {
              _self.actIndex = actIndex + 1
            } else {
              _self.actIndex = actIndex;
            }
            if (_self.actIndex == -1) {
              _self.act = '';
            } else {
              _self.act = _self.reduAct[_self.actIndex];
            }
          }
          //卡主支付
          if(_self.mapCardFlag){
            if(_self.mapCard()){

              _self.cardDetail = _self.mapCard();
              _self.svipActPay = Math.ceil(accAdd(accMul(accMul(_self.disMoney, _self.cardDetail.shareCardDiscount ? _self.cardDetail.shareCardDiscount : 0), 100), accMul(_self.notDisMoney, 100)));
              _self.svipDiscount = _self.coupon ? Subtr(Subtr(accMul(_self.totalMoney, 100), _self.svipActPay),accMul(_self.coupon.couponMoney,100)) : Subtr(accMul(_self.totalMoney, 100), _self.svipActPay);
            }else{
              _self.svipActPay = accMul(_self.disMoney,100);
              _self.svipDiscount = 0;
            }
          }else{
            _self.svipActPay = Math.ceil(accAdd(accMul(accMul(_self.disMoney, _self.cardDetail.shareCardDiscount ? _self.cardDetail.shareCardDiscount : 0), 100), accMul(_self.notDisMoney, 100)));
            _self.svipDiscount = _self.coupon ? Subtr(Subtr(accMul(_self.totalMoney, 100), _self.svipActPay),accMul(_self.coupon.couponMoney,100)) : Subtr(accMul(_self.totalMoney, 100), _self.svipActPay);
          }


          //折扣满减
          _self.judgeAlert();
          if (_self.coupon) {                         //有优惠券时
            if (Number(_self.oneLevelMoney) >= _self.coupon.consumeMoney * 100 / 100) {
              _self.couponActPay = Math.ceil(accMul(Subtr(Number(_self.totalMoney), _self.coupon.couponMoney), 100));
              _self.couponDiscount = Subtr(accMul(Number(_self.totalMoney),100), _self.couponActPay);
            } else {
              _self.$refs.cardPicker.updateCounponActIndex();
              _self.coupon = '';                      //金额未达到已选卡券,删除已选卡券,重计金额
            }
          } else {                                     //无优惠券时
            _self.couponActPay = Math.ceil(Number(_self.totalMoney) * 100);
            _self.couponDiscount = 0;
          }
        }


        _self.priTypeEvent();
      },

      /**
       * 判断当前活动类型
       */
      priTypeEvent() {
        var _self = this;
        if (_self.priType == 1) {
          _self.actPay = _self.svipActPay<0 ? 0 : _self.svipActPay;
          _self.discount = Subtr(accMul(Number(_self.totalMoney),100),_self.actPay);
        } else if (_self.priType == 2) {
          _self.actPay = _self.defActPay<0 ? 0 : _self.defActPay;
          _self.discount = Subtr(accMul(Number(_self.totalMoney),100),_self.actPay);
          _self.activeNum = _self.defActiveNum;
        } else if (_self.couponPayFlag && !_self.priType) {
          _self.actPay = _self.couponActPay<0 ? 0 : _self.couponActPay;
          _self.discount = _self.couponDiscount;
        } else{
          _self.actPay = accMul(_self.totalMoney, 100);
          _self.discount = 0;
        }
      },

      /**
       * 选择卡券类型
       */
      chooseCouponFlag(){
        this.couponPayFlag = !this.couponPayFlag;
        if(!this.couponPayFlag){
          this.coupon = '';
          this.priType ? this.priType = this.priType : this.priType = 1;
        }
      },

      /**获取当前时间yyyymmddhhmmss*/
      get_time() {
        var _self = this;
        var time = new Date();
        var year = "",
          month = "",
          day = "",
          hour = "",
          minute = "",
          second = "";
        year = time.getFullYear();
        month = _self.add_zero(time.getMonth() + 1);
        day = _self.add_zero(time.getDate());
        hour = _self.add_zero(time.getHours());
        minute = _self.add_zero(time.getMinutes());
        second = _self.add_zero(time.getSeconds());
        _self.nowTime = '' + year + month + day + hour + minute + second;
      },
      add_zero(temp) {
        if (temp < 10) {
          return "0" + temp;
        } else {
          return temp;
        }
      },
    },
    watch: {
      notDisMoney() {
        var _self = this;
        _self.oneLevelMoney = Subtr(Number(_self.totalMoney), Number(_self.notDisMoney));
        if (Number(_self.notDisMoney > Number(_self.totalMoney))) {
          _self.toast('订单总金额请勿小于不参与折扣金额');
          _self.notDisMoney = _self.notDisMoney.slice(0, -1)
        }
        _self.calMoney();
      },
      totalMoney() {
        var _self = this;
        _self.oneLevelMoney = Subtr(Number(_self.totalMoney), Number(_self.notDisMoney));
        _self.notDefFlag = false;
        _self.calMoney();
      },
      cardDetail:{
        handler(){
          var _self = this;
          _self.calMoney();
        },
        deep:true
      },
      /**
       * 监听用户选择优惠券变化
       */
      coupon:{
        handler() {
          var _self = this;
          _self.calMoney();
        },
        deep: true
      },
      /**
       * 监听用户选择活动类型变化
       */
      priType() {
        if(!this.couponPayFlag){
          this.priType ? this.priType = this.priType : this.priType = 1;
        }
        this.calMoney();
      }
    },
    mounted() {
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  .index {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F2F2F2;
    box-sizing: border-box;
    padding: .28rem .15rem;
    overflow: scroll;
    .module{
      background: #FFFFFF;
      border-radius: .1rem;
    }
    .pay {
      width: 100%;
      background: #FFFFFF;
      box-sizing: border-box;
      padding: .19rem 0;
      border-radius: .07rem;
      box-shadow: 0 .1rem .09rem 0 rgba(237, 237, 237, 0.31);
      margin-bottom: .44rem;

      .store {
        width: 100%;
        box-sizing: border-box;
        padding: 0 .45rem;
        display: flex;
        align-items: center;
        margin-bottom: .31rem;

        .store_logo {
          width: .8rem;
          height: .8rem;
          border-radius: 50%;
          overflow: hidden;
          margin-right: .16rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        p {
          font-size: .32rem;
          color: #0D0D0F;
        }
      }

      .flex {
        display: flex;
        box-sizing: border-box;
        padding: .18rem .45rem;
        font-size: .3rem;

        i {
          display: block;
          color: #D2D2D2;
          margin-right: .2rem;
        }

        .icon-wanchenggouxuan2 {
          background: #FFFFFF;
          font-size: .34rem;
          border: 0;
          color: #D2D2D2;
        }

        .bg_FDB300 {
          color: #FDB300;
        }

        p {
          color: #0D0D0F;
          font-size: .3rem;
        }
      }

      .box-padding {
        box-sizing: border-box;
        padding: .2rem .2rem 0 .45rem;
      }

      .dashed {
        border-bottom: 1px dashed #EEEEEE;
        padding-bottom: .29rem;
      }

      .business {
        font-size: .33rem;
        padding: .22rem .45rem .48rem;
      }

      .remainMoney {
        font-size: .25rem;
        color: #0D0D0F;
        box-sizing: border-box;
        padding: 0 .45rem .5rem;
      }

      .inputContainer {
        width: 6.79rem;
        margin: 0 auto;
        border-bottom: .02rem solid #EBECEE;
        box-sizing: border-box;
        padding: .29rem .32rem;
        display: flex;
        font-size: .4rem;
        align-items: flex-end;
        font-weight: bold;
        border-radius: .05rem;

        .input {
          width: 100%;

          .placeholder {
            font-size: .4rem;
            color: #8D8E98;
            font-weight: lighter;
          }

          span {
            font-size: .5rem;
            font-weight: lighter;
          }
        }

        input {
          font-size: .5rem;
          display: block;
          width: 100%;
        }

        input::placeholder {
          font-size: .4rem;
        }
      }

      .active {
        box-shadow: 0 0 .4rem .1rem #D4DAFA;
      }

      .payMoney {
        font-size: .3rem;
        color: rgba(13, 13, 15, 1);
        padding: .22rem .5rem .65rem;
      }

      .affirm {
        width: 6.69rem;
        height: .91rem;
        border-radius: .07rem;
        display: block;
        background: rgba(247, 9, 77, 1);
        color: #FFFFFF;
        font-size: .41rem;
        margin: 0 auto;
        margin-top: .5rem;
      }

      .notice_text {
        font-size: .3rem;
        padding: 0 0.22rem;
        margin-top: 0.3rem;
      }
    }

    .card {
      padding: .26rem;
      margin-bottom: .22rem;

      .justify_content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          display: flex;
          flex-direction: column;
          align-content: center;

          span {
            color: #8D8E98;
            font-size: .28rem;
            text-align: center;
            box-sizing: border-box;
            padding-left: .3rem;
          }

          .flex_card {
            display: flex;
            align-items: center;
            padding-top: 0;
            padding-bottom: 0;
            font-size: .3rem;

            i {
              font-size: .34rem;
              padding-right: .18rem;
            }

            span {
              background: linear-gradient(268deg, rgba(214, 146, 92, 1), rgba(214, 155, 109, 1), rgba(243, 214, 179, 1));
              color: #FFFFFF;
              font-size: .24rem;
              margin-left: .11rem;
              margin-right: .18rem;
              padding-left: 0;
            }

            img {
              display: block;
              width: .3rem;
              height: .3rem;
            }
          }
        }

        .right {
          font-size: .3rem;
        }


        p {
          font-size: .28rem;
          color: #99623E;
        }
      }
    }

    .fc-F7094D {
      color: #F7094D;
    }

    .flex-box {
      display: flex;
      align-items: center;
      padding: .26rem;
      margin-bottom: .22rem;

      i {
        font-size: .34rem;
        margin-right: .18rem;
      }

      .right {
        width: 5rem;
      }

      .mapActBtn {
        width: 1.5rem;
        height: .6rem;
        background: #F7094D;
        border-radius: .1rem;
        font-size: .26rem;
        color: #FFFFFF;
      }

      span {
        font-size: .28rem;
      }
    }

    .fc-D2D2D2 {
      color: #D2D2D2;
    }

    .active-2 {
      color: #F60F51;
    }

    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1rem;
      box-sizing: border-box;
      padding: .15rem .34rem;
      background: #FFFFFF;

      .pay_info {
        font-size: .3rem;

        i {
          color: #F7094D;
        }
      }

      button {
        width: 2.06rem;
        height: .7rem;
        background: #F7094D;
        color: #FFFFFF;
        border-radius: .1rem;
        letter-spacing: .04rem;
        font-size: .32rem;
      }
    }

    .alert {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(12, 12, 12, .5);

      .remainDef {
        width: 6rem;
        height: 4.36rem;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: #FFFFFF;
        border-radius: .2rem;
        box-sizing: border-box;
        padding: .57rem .28rem 0;

        .close {
          width: .55rem;
          height: .54rem;
          position: absolute;
          top: -.79rem;
          right: -.28rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .title {
          font-size: .38rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: .51rem;
        }

        p {
          box-sizing: border-box;
          padding: 0 .31rem;
          font-size: .34rem;
          margin-bottom: .37rem;
          text-align: center;
        }

        .btns {
          width: 100%;
          display: flex;
          justify-content: space-between;

          button {
            display: block;
            width: 2.5rem;
            height: .8rem;
            border-radius: .1rem;
            font-size: .36rem;
            color: #FFFFFF;
          }

          button:first-child {
            background: #FEB623;
          }

          button:last-child {
            background: #F7094D;
          }
        }
      }
    }
  }
</style>
