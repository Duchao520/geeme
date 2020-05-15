<template>
  <div class="scanPay" @click="keyboardFlag=false">
    <!--<div class="bg"></div>-->
    <transition name="alertMsg">
      <div class="bounced" v-show="satisfyFlag || orderFlag || notDefFlag">
        <div class="order satisfy" v-if="satisfyFlag">
          <div class="type satisfy_type">
            <img :src="typeImg" alt="">
          </div>
          <div class="content">
            <p>本次支付金额 : <span id="pay">{{Number(totalMoney) * 100 / 100}}</span>元</p>
            <p id="tip">{{tip}}</p>
            <h2>实需支付 : <span id="actPay">{{Number(actPay) * 100 / 100}}</span>
              <div>元</div>
            </h2>
          </div>
          <button class="btns submit" @click.stop="pay">确认支付</button>
          <p class="adv" style="margin-bottom: .5rem">助商通,省的不是一点点</p>
          <div class="close" @click="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
        </div>

        <div class="deficiency order" v-if="orderFlag">
          <div class="type">
            <img src="@/assets/imgs/scanPay/type_3.png" alt="">
          </div>
          <div class="content">
            <p>本次支付金额 : <span id="def_pay">{{Number(totalMoney) * 100 / 100}}</span>元</p>
            <p>话呗抵扣 : <span id="def_discount">{{Number(def_discount) * 100 / 100}}</span>元</p>
            <h2>实需支付 : <span id="def_actPay">{{Number(actPay) * 100 / 100}}</span>
              <div>元</div>
            </h2>
            <p class="tips" v-if="user.totalmoney">话呗余额<span id="def_difference">{{Number(user.totalmoney) * 100 / 100}}</span>元,建议使用助商通话呗充值卡进行充值</p>
          </div>
          <div class="btnLine">
            <button class="btns submit" style="color: #FFFFFF" @click="pay">原价支付</button>
          </div>
          <p class="adv" style="margin-bottom: .5rem">助商通,省的不是一点点</p>
          <div class="close" @click="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
        </div>

        <div class="deficiency order" v-if="notDefFlag">
          <div class="type">
            <img src="@/assets/imgs/scanPay/type_3.png" alt="">
          </div>
          <div class="content">
            <p>本次支付金额 : <span>{{Number(totalMoney) * 100 / 100}}</span>元</p>
            <p>话呗抵扣 : <span>{{Number(def_discount) * 100 / 100}}</span>元</p>
            <h2>实需支付 : <span>{{Number(actPay) * 100 / 100}}</span>
              <div>元</div>
            </h2>
            <p class="tips">话呗余额<span>{{Number(user.totalmoney) * 100 / 100}}</span>元,是否匹配下一级满减</p>
          </div>
          <div class="btnLine">
            <button class="btns recharge" style="background: #f7094d;color: #FFFFFF" @click="mapAct">下一级满减</button>
            <button class="btns submit" style="color: #FFFFFF" @click="pay">原价支付</button>
          </div>
          <p class="adv" style="margin-bottom: .5rem">助商通,省的不是一点点</p>
          <div class="close" @click="close">
            <img src="@/assets/imgs/scanPay/close.png" alt="">
          </div>
        </div>
      </div>
    </transition>
    <div class="storeName">
      <img :src="logo" alt="" id="storeLogo">
      <span id="storeName">{{shopName}}</span>
    </div>
    <div class='show-account'>
      <div class="money">
        <input id="money_num" v-model="totalMoney" @click.stop="keyboardShow" type="text" placeholder="输入需要付款的金额"
               value="">
        <!--<img src="img/icon_cancel@2x.png" class="deleateNum" />-->
      </div>
      <div class="chooseTip" v-if="userAgentType == 'ZST'">
        选择支付方式
      </div>
      <div class="payWayContainer" v-if="userAgentType == 'ZST'">
        <div class="payway-item" :class="{active: ZSTPayWay == 2}" @click="changeWay(2)"><i
          class="iconfont icon-check"></i>微信支付
        </div>
        <div class="payway-item" :class="{active: ZSTPayWay == 1}" @click="changeWay(1)"><i
          class="iconfont icon-check"></i>支付宝支付
        </div>
      </div>
      <button class="sure_button" type="button" v-if="userAgentType !== 'ZST'" @click="isSubmit">确定</button>
      <button class="ZST_button" type="button" v-if="userAgentType == 'ZST'" @click="ZST_judgeAlert">确认支付</button>
    </div>
    <div class="storeActivities">
      <div class="moduleTitle">商家活动</div>
      <div class="activity-item" v-for="(item,index) in discountAct" :key="index"><img
        src="@/assets/imgs/scanPay/discount.png" alt="">话呗抵扣{{(item.discountRate*1).toFixed(1)}}折活动
      </div>
      <div class="activity-item" v-for="(item,index) in reduAct" :key="index"><img src="@/assets/imgs/scanPay/full.png"
                                                                                   alt="">会员享受消费满{{item.consumeMoney}}减{{item.availableIntegral}}活动
      </div>
    </div>
    <div style="text-align: center" id="suport">
      <span class="suport">本店支持卡主招募活动</span>
    </div>
    <ul class="keyboard" v-show="keyboardFlag">
      <li class="num" v-for="(item,index) in keyboard" @click.stop="keyboardEvent(item.num)" :key="index"><img
        :src="item.imgSrc" alt=""></li>
      <li class="del" @click.stop="del"><img src="@/assets/imgs/scanPay/delete.png" alt=""></li>
    </ul>
    <footer>
      <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.hh.csipsimple">下载助商通APP</a>
    </footer>
    <toast ref="toast" :tip="msg"></toast>
  </div>
</template>

<script>
  import {getUserInfo, getStoreInfo} from "@/assets/js/comm";
  import {ZSTSweepCodePay, request} from "@/assets/js/jsBridge";
  import {regular_uri} from "@/assets/js/concact";
  import wx from "weixin-js-sdk";
  import axios from 'axios';
  import toast from "@/components/toast";

  export default {
    name: "index",
    components: {
      toast
    },
    data() {
      return {
        satisfyFlag: false,
        orderFlag: false,
        notDefFlag: false,
        keyboardFlag: false,
        userAgentType: false,
        totalMoney: '',
        keyboard: [
          {num: 1, imgSrc: require('@/assets/imgs/scanPay/1.png')},
          {num: 2, imgSrc: require('@/assets/imgs/scanPay/2.png')},
          {num: 3, imgSrc: require('@/assets/imgs/scanPay/3.png')},
          {num: 4, imgSrc: require('@/assets/imgs/scanPay/4.png')},
          {num: 5, imgSrc: require('@/assets/imgs/scanPay/5.png')},
          {num: 6, imgSrc: require('@/assets/imgs/scanPay/6.png')},
          {num: 7, imgSrc: require('@/assets/imgs/scanPay/7.png')},
          {num: 8, imgSrc: require('@/assets/imgs/scanPay/8.png')},
          {num: 9, imgSrc: require('@/assets/imgs/scanPay/9.png')},
          {num: '.', imgSrc: require('@/assets/imgs/scanPay/11.png')},
          {num: 0, imgSrc: require('@/assets/imgs/scanPay/0.png')}
        ],
        shopName: this.chineseFromUtf8Url(this.$route.query.storeName),
        mercId: this.$route.query.mercId,
        orgid: this.$route.query.orgid,
        trmNO: this.$route.query.trmNO,
        wxAppId: this.$route.query.wxAppId,
        wxAppIdKey: this.$route.query.wxAppIdKey,
        deskNo: this.$route.query.no,
        logo: decodeURIComponent(this.$route.query.logo),
        suportSvip: this.$route.query.suportSvip,
        code: '',
        openid: '',
        user: '',
        storeId: this.$route.query.storeId,
        rate: '',
        discountType: false,
        consumeMoney: '',
        availableIntegral: '',
        activeNum: '',
        redirect_uri: '',
        nowTime: '',
        ZSTPayWay: 2,
        backParams: '',
        actPay: '',
        typeImg: require('@/assets/imgs/scanPay/type.png'),
        tip: '',
        def_discount: '',
        miniAppId: '',
        discountAct: [],
        reduAct: [],
        consumeMoneys: [],
        act: '',
        actIndex: '',
        def_status: 0,
        msg: ''
      }
    },
    methods: {
      /**初始化*/
      init() {
        var _self = this;
        _self.code = request['code'];
        // _self.getUserAgentType();
        _self.userAgentType = "ZST";
        _self.getUserInfo();
        _self.getStoreInfo();
        window.document.title = '助商通商家联盟';
      },
      /**关闭订单弹窗*/
      close() {
        var _self = this;
        _self.satisfyFlag = false;
        _self.orderFlag = false;
        _self.notDefFlag = false;
      },
      /**UTF8中文解码*/
      chineseFromUtf8Url(strUtf8) {
        var bstr = decodeURIComponent(strUtf8);
        return bstr;
      },
      /**判断APP类型*/
      getUserAgentType() {
        var _self = this;
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('AlipayClient') > -1) {
          _self.userAgentType = "ALIPAY";
        } else if (/.*micromessenger.*miniprogram.*/.test(userAgent.toLowerCase())) {
          _self.userAgentType = "miniProgram";
          _self.miniAppId = 'wx5e11922e81e3951d';
        } else if (userAgent.indexOf('MicroMessenger') > -1) {
          _self.userAgentType = "WXPAY";
        } else if (userAgent.indexOf('zst-ios-broswer') > -1 || userAgent.indexOf('zst-android-broswer') > -1) {
          _self.userAgentType = "ZST";
        } else {
          // TODO 跳转到错误页
          _self.$router.push(
            {
              name: 'error'
            }
          )
        }
        // alert(_self.userAgentType)
      },
      /**定义键盘*/
      keyboardEvent(num) {
        var _self = this;
        var regx =/^(([0-9][0-9]{0,9}[.])|([0-9][0-9]{0,9}[.][0-9]{1,2})|([0-9][0-9]{0,9})|([0][.][0-9]{1}[1-9]{1}))$/;
        _self.keyboardFlag = true;
        var str = '' + _self.totalMoney + num;
        if(regx.test(str) && str<100000){
          _self.totalMoney = str;
        }
      },
      /**显示键盘*/
      keyboardShow() {
        var _self = this;
        document.activeElement.blur();
        _self.keyboardFlag = true
      },
      /**键盘退格键*/
      del() {
        var _self = this;
        _self.keyboardFlag = true;
        _self.totalMoney = String(_self.totalMoney).slice(0, -1);
      },
      /**获取用户信息openId*/
      getUserInfo() {
        var _self = this;
        var _data = {
          code: String(_self.code)
        };
        if (_self.userAgentType == 'WXPAY' || _self.userAgentType == 'ZST' || _self.userAgentType == 'miniProgram') {
          axios.post(regular_uri.userInfo + _self.code).then(res => {
            if (res.data.state == 1) {
              _self.openid = res.data.openId;
              _self.user = res.data.user;
            } else {
              alert(decodeURI(res.data.msg))
            }
          });
        }
      },

      /** 满减活动按满足金额排序*/
      sortConsume(a, b) {
        return a.consumeMoney - b.consumeMoney;
      },

      /** 满减活动按优惠金额排序*/
      sortIntergal(a, b){
        return a.availableIntegral - b.availableIntegral;
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
                  _self.rate = e.discountRate;
                } else if (e.discountType == 2) {
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
      /**判断支付宝和微信*/
      isSubmit() {
        var _self = this;
        _self.totalMoney = Number(_self.totalMoney);
        if (_self.userAgentType == 'ALIPAY') {
          _self.ALI_judegeAlert();
        } else if (_self.userAgentType == 'WXPAY' || _self.userAgentType == 'miniProgram') {
          _self.judgeAlert();
        } else if(_self.userAgentType == "ZST"){
          _self.ZST_judgeAlert();
        }
      },
      /**助商通内选择支付方式*/
      changeWay(payWay) {
        var _self = this;
        _self.ZSTPayWay = payWay;
      },
      /**助商通内弹框订单*/
      ZST_judgeAlert() {
        var _self = this;
        try {
          if (isNaN(_self.totalMoney)) {
            alert('付款金额有误')
          } else {
            var discount = 6 / _self.rate * 10 - 6 / _self.rate * 10 * _self.rate * 0.1;
            _self.def_status = 0;
            if (parseInt(_self.rate)) {
              if (_self.totalMoney < 6 / _self.rate * 10) {
                _self.satisfyFlag = true;
                _self.tip = '满' + (6 / _self.rate * 10).toFixed(2) + '元可抵扣' + discount.toFixed(2) + '元,还差' + (6 / _self.rate * 10 - Number(_self.totalMoney)).toFixed(2) + '元';
                _self.typeImg = require('@/assets/imgs/scanPay/type_2.png')
                // $("#tip").html(tip).css("background", "#ffe2ec");
                _self.actPay = Number(_self.totalMoney).toFixed(2);
              } else {
                if (_self.rate) {
                  discount = _self.totalMoney - _self.totalMoney * _self.rate * 0.1;
                  if (_self.user.totalmoney >= discount) {
                    _self.satisfyFlag = true;
                    _self.tip = '话呗抵扣 : ' + (_self.totalMoney - _self.totalMoney * _self.rate * 0.1).toFixed(2) + '元';
                    _self.actPay = (_self.totalMoney * _self.rate * 0.1).toFixed(2);
                  } else if (discount < 50 && !user.userId) {
                    _self.satisfyFlag = true;
                    _self.tip = '话呗抵扣 : ' + (_self.totalMoney - _self.totalMoney * _self.rate * 0.1).toFixed(2) + '元';
                    _self.actPay = (_self.totalMoney * _self.rate * 0.1).toFixed(2);
                  } else {
                    _self.def_status = 1;
                    _self.orderFlag = true;
                    _self.def_discount = (_self.totalMoney - _self.totalMoney * _self.rate * 0.1).toFixed(2);
                    _self.actPay = Number(_self.totalMoney).toFixed(2);
                  }
                } else {
                  _self.tip = '话呗抵扣 : ' + 0 + '元';
                  _self.actPay = Number(_self.totalMoney).toFixed(2);

                }
              }
            } else if (_self.reduAct.length != 0) {
              if(_self.user.totalmoney >= _self.reduAct[0].availableIntegral){      //判断话呗余额是否达到最低满减
                if (_self.act) {
                  if(_self.user.totalmoney >= _self.act.availableIntegral){
                    _self.tip = "满" + _self.act.consumeMoney + "元减" + _self.act.availableIntegral*10/10 + "元";
                    _self.actPay = (Number(_self.totalMoney)*10 - _self.act.availableIntegral*10)/10;
                    _self.activeNum = _self.act.id;
                    _self.satisfyFlag = true;
                  }else {
                    _self.notDefFlag = true;
                    _self.def_status = 1;
                    _self.def_discount = _self.act.availableIntegral.toFixed(2);
                    _self.actPay = _self.totalMoney * 100/100;
                  }
                } else {
                  var obj = _self.reduAct[_self.actIndex + 1];
                  _self.tip = "满" + obj.consumeMoney + "元减" + obj.availableIntegral*100/100 + "元,当前还差" + (obj.consumeMoney - Number(_self.totalMoney)).toFixed(1) + '元';
                  _self.actPay = Number(_self.totalMoney);
                  _self.activeNum = '';
                  _self.satisfyFlag = true;
                }
              } else {                                  //余额不足最低满减 提醒余额不足选择充值或原价付
                _self.orderFlag = true;
                _self.def_status = 1;
                _self.def_discount = _self.reduAct[0].consumeMoney.toFixed(2);
                _self.actPay = _self.totalMoney * 100/100;
              }
            } else {
              _self.actPay = _self.totalMoney;
              _self.pay();
            }
          }
        } catch (e) {
          alert(e)
        }
      },
      /**微信内弹框订单*/
      judgeAlert() {
        var _self = this;
        if (isNaN(_self.totalMoney)) {
          alert('付款金额有误')
        } else if (!_self.totalMoney) {
          alert('请输入付款金额')
        } else {
          var tip = '';
          var discount = (6 / _self.rate * 10 - 6 / _self.rate * 10 * _self.rate * 0.1) || 0;
          _self.def_status = 0;
          if (parseInt(_self.rate)) {
            if (_self.totalMoney < 6 / _self.rate * 10) {
              _self.satisfyFlag = true;
              _self.tip = '满' + (6 / _self.rate * 10).toFixed(2) + '元可抵扣' + discount.toFixed(2) + '元,还差' + (6 / _self.rate * 10 - Number(_self.totalMoney)).toFixed(2) + '元';
              _self.typeImg = require('@/assets/imgs/scanPay/type_2.png')
              // $("#tip").html(tip).css("background", "#ffe2ec");
              _self.actPay = Number(_self.totalMoney) * 100/100;
            } else {
              if (_self.rate) {
                _self.activeNum = _self.discountAct[0].id;
                discount = Number(_self.totalMoney) - Number(_self.totalMoney) * _self.rate * 0.1;
                if (_self.user.totalmoney >= discount) {
                  _self.satisfyFlag = true;
                  _self.tip = '话呗抵扣 : ' + (Number(_self.totalMoney) - Number(_self.totalMoney) * _self.rate * 0.1).toFixed(2) + '元';
                  _self.actPay = (Number(_self.totalMoney) * _self.rate * 0.1).toFixed(2);
                } else if (discount < 50 && !_self.user.userId) {
                  _self.satisfyFlag = true;
                  _self.tip = '话呗抵扣 : ' + (Number(_self.totalMoney) - Number(_self.totalMoney) * _self.rate * 0.1).toFixed(2) + '元';
                  _self.actPay = (Number(_self.totalMoney) * _self.rate * 0.1).toFixed(2);
                } else {
                  _self.orderFlag = true;
                  _self.def_status = 1;
                  _self.def_discount = (Number(_self.totalMoney) - Number(_self.totalMoney) * _self.rate * 0.1).toFixed(2);
                  _self.actPay = Number(_self.totalMoney) * 100/100;
                }
              } else {
                _self.tip = '话呗抵扣 : ' + 0 + '元';
                _self.actPay = Number(_self.totalMoney) * 100/100;
              }
            }
          } else if (_self.reduAct.length != 0) {
            if(_self.user.totalmoney >= _self.reduAct[0].availableIntegral){      //判断话呗余额是否达到最低满减
              if (_self.act) {
                if(_self.user.totalmoney >= _self.act.availableIntegral){
                  _self.tip = "满" + _self.act.consumeMoney + "元减" + _self.act.availableIntegral*10/10 + "元";
                  _self.actPay = (Number(_self.totalMoney)*10 - _self.act.availableIntegral * 10)/10;
                  // console.log(_self.act.availableIntegral * 100 / 100);
                  _self.activeNum = _self.act.id;
                  _self.satisfyFlag = true;
                }else {
                  _self.notDefFlag = true;
                  _self.def_status = 1;
                  _self.def_discount = _self.act.availableIntegral.toFixed(2);
                  _self.actPay = _self.totalMoney * 100/100;
                }
              } else {
                var obj = _self.reduAct[_self.actIndex + 1];
                _self.tip = "满" + obj.consumeMoney + "元减" + obj.availableIntegral*10/10 + "元,当前还差" + (obj.consumeMoney - Number(_self.totalMoney)).toFixed(1) + '元';
                _self.actPay = Number(_self.totalMoney);
                _self.activeNum = '';
                _self.satisfyFlag = true;
              }
            } else {                                  //余额不足最低满减 提醒余额不足选择充值或原价付
              _self.orderFlag = true;
              _self.def_status = 1;
              _self.def_discount = _self.reduAct[0].consumeMoney.toFixed(2);
              _self.actPay = Number(_self.totalMoney) * 10/10;
            }
          } else {
            _self.actPay = Number(_self.totalMoney) * 100/100;
            _self.pay();
          }
        }
      },

      /** 支付宝订单处理*/
      ALI_judegeAlert(){
        var _self = this;
        if (isNaN(_self.totalMoney)) {
          alert('付款金额有误')
        } else if (!_self.totalMoney) {
          alert('请输入付款金额')
        } else {
          if (parseInt(_self.rate)) {
            _self.actPay = Number(Math.round(_self.totalMoney * _self.rate * 0.1)) * 100/100;
            _self.pay();
          } else if (_self.reduAct.length != 0) {
            if (_self.act) {
              _self.tip = "满" + _self.act.consumeMoney + "元减" + _self.act.availableIntegral + "元";
              _self.actPay = Number(_self.totalMoney) - _self.act.availableIntegral * 100/100;
              _self.activeNum = _self.act.id;
              _self.satisfyFlag = true;
            } else {
              var obj = _self.reduAct[_self.actIndex + 1];
              _self.tip = "满" + obj.consumeMoney + "元减" + obj.availableIntegral + "元,当前还差" + (obj.consumeMoney - Number(_self.totalMoney)).toFixed(1) + '元';
              _self.actPay = Number(_self.totalMoney) * 100/100;
              _self.activeNum = '';
              _self.satisfyFlag = true;
            }
          } else {
            _self.actPay = _self.totalMoney * 100/100;
            _self.pay();
          }
        }
      },

      /**确认支付-判断微信和助商通*/
      pay() {
        var _self = this;
        if (_self.userAgentType == 'ZST') {
          _self.zstPay();
        } else if (_self.userAgentType == 'WXPAY') {
          _self.wxPay();
        } else if (_self.userAgentType == 'miniProgram') {
          var discount = _self.totalMoney - _self.actPay;
          var params = 'mercId=' + _self.mercId + '&orgid=' + _self.orgid + '&trmNo=' + _self.trmNO + '&storeId=' + _self.storeId + '&storeName=' + _self.shopName + '&activeNum=' +
            _self.activeNum + '&suportSvip=' + _self.suportSvip + '&totalAmount=' + Math.round(_self.totalMoney * 100) + "&amount=" + Math.round(_self.actPay * 100) + '&integralCount=' + (discount || 0) + '&rate=' + _self.rate;
          var redirect_url = '../../pages/payPage/main?' + params;
          wx.miniProgram.navigateTo({url: redirect_url});
        } else if(_self.userAgentType == "ALIPAY"){
          _self.ALIPay();
        }
      },
      /** 支付宝支付*/
      ALIPay(){
        var _self = this;
        var Reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        var _totalAmount = Math.round(_self.totalMoney * 100);
        var actPay = Math.round(_self.actPay * 100);
        if (actPay < 1) {
          actPay = 1;
        }
        if (Reg.test(_totalAmount) && _totalAmount > 0) {
          var _data = {
            'storeId': _self.storeId,
            'mercId': _self.mercId,
            'trmNo': _self.trmNO,
            'no': _self.deskNo,
            'amount': actPay,
            'totalAmount': _totalAmount
          };
          var url = regular_uri.AliPay + "?storeId=" + _self.storeId + "&mercId=" + _self.mercId + "&trmNo=" + _self.trmNO + "&no=" + _self.deskNo + "&amount=" + actPay + "&totalAmount=" + _totalAmount;
          console.log(url);
          axios.post(url).then(res => {
            if (res.data.state == 1) {
              window.location.href = res.data.aliPayUrl;
            } else {
              alert(decodeURIComponent(res.data.msg));
            }
          });
        }else {
          alert("请输入正确金额")
        }
      },
      /**微信支付*/
      wxPay() {
        var _self = this;
        var discount = _self.totalMoney - _self.actPay;
        var Reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        var _totalAmount = Math.round(_self.totalMoney * 100);
        if (Reg.test(_self.actPay) && _self.actPay > 0) {
          if (_self.userAgentType == 'WXPAY' || _self.userAgentType == 'miniProgram') {
            var url = regular_uri.wxPay + '?miniAppId=' + _self.miniAppId + '&storeId=' + _self.storeId + '&trmNo=' +
              _self.trmNO + "&payWay=" + 'WXPAY' + "&amount=" + Math.round(_self.actPay * 100) + "&totalAmount=" + _totalAmount + "&mercId=" +
              _self.mercId + "&integralCount=" + (discount || 0) + "&openid=" + _self.openid + '&subject=' + '用户扫码支付' + "&activeNum=" + _self.activeNum;
            console.log(url);
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
        // wx.miniProgram.navigateTo({url: '../../pages/payPage/main'});
        // alert(data.returnCode)
        // alert(JSON.stringify(_data))
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
                var discount = _self.totalMoney - _self.actPay;
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  //TODO 成功后的页面跳转
                  _self.$router.push({
                    name: 'success',
                    query: {
                      amount: _self.actPay,
                      discount: discount,
                      orderTime: pay_time,
                      storeName: _self.shopName,
                      order_no: order_no,
                      def_status: _self.def_status,
                      def_money: Number(_self.user.totalmoney) - discount
                    }
                  })
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                  WeixinJSBridge.invoke('closeWindow', {}, function (res) {

                  });
                } else {
                  console.log(res.err_msg)
                  console.log(res.err_desc)
                  _self.$router.push({
                    name: 'fail',
                    query: {
                      amount: _self.actPay,
                      discount: discount,
                      orderTime: pay_time,
                      storeName: _self.shopName,
                      order_no: order_no,
                      err_msg: res.err_msg,
                      err_desc: res.err_desc,
                      def_status: _self.def_status,
                      def_money: Number(_self.user.totalmoney) - discount
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
          alert(decodeURIComponent(res.data.msg))

        }
      },
      /**助商通支付*/
      zstPay() {
        var _self = this;
        var _totalAmount = _self.totalMoney;
        var discount = _self.totalMoney - _self.actPay;
        var Reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
        if (Reg.test(_self.actPay) && _self.actPay > 0) {
          var _data = {
            activeNum: String(_self.activeNum),
            payWay: String(_self.ZSTPayWay),
            storeId: _self.storeId,
            integralCount: discount,
            totalMoney: String(_totalAmount),
            shouldPayMoney: String(_self.actPay)
          };
          ZSTSweepCodePay(_data).then(res => {
            _self.get_time();
            if (res) {
              _self.$router.push({
                name: 'success',
                query: {
                  amount: _self.actPay,
                  discount: discount,
                  orderTime: _self.nowTime,
                  storeName: _self.shopName,
                  order_no: res,
                  def_status: _self.def_status,
                  def_money: Number(_self.user.totalmoney) - discount
                }
              });
            } else {
              _self.$router.push({
                name: 'fail',
                query: {
                  amount: _self.actPay,
                  discount: discount,
                  orderTime: _self.nowTime,
                  storeName: _self.shopName,
                  order_no: res,
                  def_status: _self.def_status,
                  def_money: Number(_self.user.totalmoney) - discount
                }
              });
            }
          });
        } else {
          //TODO 清空页面表单元素
          alert("付款金额有误");
        }
      },

      /** 匹配话呗余额适合的满减活动*/
      mapAct(){
        var _self = this;
        try {
          if(_self.reduAct.length != 0){
            var _reduAct = [];
            var _list = [];
            _self.reduAct.forEach(ele => {
              if(Number(_self.totalMoney >= ele.consumeMoney)){
                _list.push(ele.availableIntegral);
                _reduAct.push(ele);
              }
            });
            if(_self.user.totalmoney){
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
              _self.close();
              _self.isSubmit();
            }else{
              _self.toast("暂无用户信息")
            }
          }
        }catch (e) {
          alert(e);
        }

      },

      toast(msg){
        var _self = this;
        _self.msg = msg;
        _self.$refs.toast.toast()
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
      }
    },
    watch: {
      totalMoney() {
        var _self = this;

        if (_self.reduAct.length != 0) {
          var _list = [];
          _self.consumeMoneys.forEach(e => {
            _list.push(e);
          });
          _list.push(Number(_self.totalMoney));
          _list = _list.sort(function (a, b) {
            return Number(a) - Number(b);
          });
          var actIndex = _list.indexOf(Number(_self.totalMoney)) - 1;
          if (_self.consumeMoneys[actIndex + 1] == _self.totalMoney) {
            _self.actIndex = actIndex + 1
          } else {
            _self.actIndex = actIndex;
          }
          if (_self.actIndex == -1) {
            _self.act = '';
          } else {
            _self.act = _self.reduAct[_self.actIndex];
          }
        } else {

        }
      },
      act() {
        // console.log(this.act);
      }
    },
    mounted() {
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  .scanPay {
    .container * {
      position: relative;
    }

    .container {
      position: relative;
      overflow: hidden;
      width: 96%;
      background-color: rgba(253, 249, 249, 1);
      box-shadow: .01rem .05rem .02rem -.02rem rgba(227, 208, 196, 1);
      margin-left: 0.2rem;
      margin-right: 0.2rem;
      /*margin-top: 0.35rem;
        margin-bottom: 0.35rem;*/
      padding-bottom: .15rem;
      border-radius: .08rem;
    }

    .show-account {
      background-color: #fff;
      z-index: 99;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      /*height: 2.28rem;*/
      padding-bottom: .37rem;
      /*margin-bottom: .22rem;*/
    }

    .show-account img {
      width: .22rem;
      height: .22rem;
    }

    .show-account .chooseTip {
      font-size: .24rem;
      text-align: center;
      margin-bottom: .5rem;
    }


    .money {
      font-size: .18rem;
      width: 4.94rem;
      background: #fff;
      position: relative;
      text-align: left;
      text-indent: .2rem;
      height: .75rem;
      border-bottom: .01rem solid #e5e5e5;
      margin-bottom: .64rem;
    }

    .money p {
      font-size: .12rem;
      font-family: STHeitiSC-Light;
      color: rgba(24, 24, 24, 1);
      line-height: .12rem;
      margin-top: .15rem;
    }

    .money img {
      position: absolute;
      /*margin-left: 10px;*/
      padding: .1rem;
      height: 0.40rem;
      width: 0.48rem;
      right: .05rem;
      top: 0.32rem;
      z-index: 11;
    }

    .money span {
      font-size: .24rem;
      line-height: 1.52rem;
    }


    #money_num {
      /*padding: 0.26rem 0px 0.26rem 0px !important;*/
      display: block;
      font-size: .6rem;
      width: 100%;
      border: none;
      font-family: STHeitiSC-Medium;
      color: #333333;
      letter-spacing: .0051rem;
      background: transparent;
      text-align: center;
      line-height: .75rem;
    }

    ::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: #CECECE;
      font-size: .33rem;
    }

    :-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #CECECE;
      font-size: .33rem;
    }

    ::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #CECECE;
      font-size: .33rem;
    }

    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #CECECE;
      font-size: .33rem;
    }

    #money_num:focus {
      outline: none;
      border: none;
    }

    .sure_button, .ZST_button {
      width: 90%;
      margin: 0 auto;
      height: .7rem;
      border: none;
      font-size: .35rem;
      color: #FFFFFF;
      background-color: #feb623;
      border-radius: .08rem;
      opacity: 0.5;
    }

    .ZST_button {
      width: 90%;
      margin: 0 auto;
    }

    .disabled {
      cursor: not-allowed;
      background-color: #CECECE;
      color: #fff;
    }


    .bg {
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: -1;
      /*background: #f2f2f2;*/
      /*background-image: url(img/pay_money1_bg.png);
            background-repeat: no-repeat;
            background-size: cover;*/
    }

    header {
      width: 100%;
      height: .9rem;
      box-sizing: border-box;
      padding: 0 .23rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      position: fixed;
      top: 0;
    }

    header .back {
      width: .22rem;
      height: .4rem;
    }

    header .back img {
      width: 100%;
      height: 100%;
      color: #343c53;
    }

    header .title {
      font-size: .36rem;
      color: #0d0d0f;
    }

    .tips {
      text-align: center;
      color: #f7094d;
      font-size: .23rem;
    }

    .introduce {
      width: 100%;
      /*height: 8.56rem;*/
      background: #FFFFFF;
      padding-top: .26rem;
    }

    .introduce main {
      width: 6.8rem;
      height: auto;
      margin: 0 auto;
    }

    .swiper-container {
      width: 100%;
      height: 2.02rem;
      /*background: red;*/
      /*box-sizing: border-box;
            padding: 0 .36rem;*/
      margin-bottom: .53rem;
    }

    .swiper-container .swiper-pagination {
      bottom: .05rem;
    }

    .swiper-container .swiper-pagination .swiper-pagination-bullet-active {
      background: #F5F5F5;
    }

    .swiper-slide {
      box-sizing: border-box;
      padding: 0 .36rem;
      overflow: hidden;
    }

    .swiper-slide img {
      width: 100%;
      height: 100%;
      border-radius: .08rem;
    }

    .introduce main h2 {
      font-size: .33rem;
      margin-bottom: .53rem;
    }

    .introduce main .activityLists {
      width: 100%;
    }

    .introduce main .activityLists .list-item {
      font-size: .28rem;
      color: #0d0d0f;
      display: flex;
      line-height: .6rem;
    }

    .introduce main .activityLists .list-item .icon {
      width: .14rem;
      height: 100%;
      margin-right: .14rem;
    }

    .introduce main .activityLists .list-item .icon span {
      width: .14rem;
      height: .14rem;
      border-radius: 50%;
      background-color: #feb623;
      display: block;
      margin-top: .22rem;
    }

    .introduce main .activityLists .list-item p {
      display: block;
    }

    .keyboard {
      width: 100%;
      /*height: 4.24rem;*/
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
      position: fixed;
      bottom: 0;
      z-index: 2;
      background: #FFFFFF;
    }

    .keyboard li {
      width: 33.3%;
      height: 1.05rem;
      /*text-align: center;
            line-height: 1.05rem;*/
      font-size: .37rem;
      font-family: STHeitiSC-Medium;
      background-color: #FFFFFF;
      /*border-bottom: .01rem solid #e8e8e8;
            border-right: .01rem solid #e8e8e8;*/
    }

    .keyboard li img {
      width: 100%;
      height: 100%;
      /*display: block;*/
    }

    .keyboard .hot {
      background-color: #e8e8e8;
    }

    footer {
      width: 100%;
      height: .98rem;
      position: fixed;
      bottom: 0;
      background-color: #f7094d;
      line-height: .98rem;
      text-align: center;
      font-size: .35rem;
      /*color: #FFFFFF;*/
      z-index: 1;
    }

    footer a {
      display: block;
      color: #FFFFFF;
    }

    .bounced {
      background-color: rgba(0, 0, 0, 0.6);
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
    }

    .bounced .order {
      width: 5.5rem;
      /*height: 6rem;*/
      background: #FFFFFF;
      border-radius: .18rem;
      position: absolute;
      /*top: 0;
            bottom: 0;*/
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      top: 3rem;
      padding-bottom: .3rem;
    }

    .bounced .order .type {
      width: 100%;
      height: 1.24rem;
    }

    .bounced .order .type img {
      width: 100%;
      height: 100%;
    }

    .bounced .order .content {
      box-sizing: border-box;
      padding: .6rem .9rem;
    }

    .bounced .order .content p {
      font-size: .27rem;
      margin-bottom: .34rem;
    }

    .bounced .order .content h2 {
      font-size: .36rem;
      margin-top: .54rem;
    }

    .bounced .order .content h2 span {
      color: #e70545;
    }

    .bounced .order .content h2 div {
      display: inline;
      color: #e70545;
    }

    .btns {
      display: block;
      width: 3.89rem;
      height: .66rem;
      background-color: #feb623;
      border: none;
      outline: none;
      color: #FFFFFF;
      font-size: .3rem;
      margin: 0 auto;
      border-radius: .08rem;
      margin-bottom: .2rem;
    }

    .bounced .deficiency .btnLine {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .bounced .deficiency .content {
      padding-bottom: 0;
    }

    .bounced .deficiency .content .tips {
      font-size: .22rem;
      color: #9a9da5;
      text-align: left;
      margin-top: .16rem;
    }

    .bounced .deficiency .btnLine .btns {
      width: 2.34rem;
      height: .66rem;
      color: #FFFFFF;
    }

    .adv {
      text-align: center;
      font-size: .23rem;
      color: #9a9da5;
      margin-bottom: .5rem;
    }

    .bounced .order .close {
      width: .55rem;
      height: .55rem;
      position: absolute;
      top: -0.55rem;
      right: -0.55rem;
    }

    .bounced .order .close img {
      width: 100%;
      height: 100%;
    }

    .payWayContainer {
      width: 100%;
      box-sizing: border-box;
      padding: 0 1.3rem;
      display: flex;
      justify-content: space-between;
      font-size: .28rem;
    }

    .payWayContainer .payway-item i {
      font-size: .24rem;
      color: #d2d2d2;
    }

    .payWayContainer .active i {
      color: #feb623;
    }

    .storeName {
      width: 100%;
      box-sizing: border-box;
      padding: .21rem .28rem;
      background: rgba(222, 222, 222, .2);
      display: flex;
      align-items: center;
      margin-bottom: .3rem;
    }

    .storeName img {
      display: block;
      width: .7rem;
      height: .7rem;
      margin-right: .14rem;
      /*background: #007aff;*/
    }

    .storeName span {
      font-size: .34rem;
    }

    .storeActivities {
      width: 90%;
      margin: 0 auto;
      background: rgba(222, 222, 222, .2);
      border-radius: .1rem;
      box-sizing: border-box;
      padding: .4rem .24rem .27rem;
      margin-bottom: .22rem;
    }

    .storeActivities .moduleTitle {
      font-size: .34rem;
      color: #0D0D0F;
      margin-bottom: .34rem;
    }

    .storeActivities .activity-item {
      width: 100%;
      display: flex;
      align-items: center;
      font-size: .24rem;
      margin-bottom: .08rem;
    }

    .storeActivities .activity-item img {
      display: block;
      width: .32rem;
      height: .32rem;
      margin-right: .15rem;
    }

    .suport {
      font-size: .28rem;
      margin: 0 auto;
      color: rgba(13, 13, 15, 1);
      background: linear-gradient(0deg, rgba(214, 142, 103, 1) 0.2685546875%, rgba(164, 103, 56, 1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .suport::after {
      content: '';
      display: block;
      width: 40%;
      height: .02rem;
      background: linear-gradient(90deg, rgba(214, 142, 103, 1), rgba(127, 80, 44, 1));
      border-radius: .01rem;
      margin: 0 auto;
    }
  }
</style>
