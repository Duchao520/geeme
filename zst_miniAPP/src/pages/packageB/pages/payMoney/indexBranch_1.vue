<template>
  <div class="index" @click="isShowKeyboard(0); type = 0">
    <div class="shopInfo flex_box box_padding" style="padding: 38rpx 46rpx 0;">
      <div class="store_logo">
        <img :src="shopDetail.storeLogo" alt="">
      </div>
      <div class="flex_box flex_column justify_space_between" style="width: 550rpx;height: 90rpx;">
        <p class="fz-40 fc-ffffff txt-ellipsis">{{shopDetail.storeName}}</p>
        <p class="fz-24 fc-ffffff txt-ellipsis">{{shopDetail.address}}</p>
      </div>
    </div>
    <div class="pay">
      <div class="cat_card box_padding" style="padding: 152rpx 40rpx 0" v-if="allienceDiscountCard">
        <div class="flex_box justify_space_between" style="height: 40rpx;">
          <p class="fc-F7094D fz-24 font-weight">{{allienceDiscountCard.vipShareDiscountCardRate}}<span class="fz-20">折</span></p>
          <p class="fc-F7094D fz-24 font-weight">{{allienceDiscountCard.comShareDiscountCardRate}}<span class="fz-20">折</span></p>
        </div>
      </div>
      <div class="cat_logo" v-else>
        <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/17/9f3bdfd147c59abf5bfa4acf8829978a.png" alt="">
      </div>
      <div class="inputContainer" :class="{active: type == 1}">
        <div class="input flex_box align_center" @click.stop="stopActiveEvent(1)"><span
          v-if="totalMoney">{{totalMoney}}</span><i class="focus" :class="{'bg-F60F51': focusFlag1}"></i><span
          class="placeholder" v-if="!totalMoney">输入本次支付金额</span></div>
      </div>
      <div class="flex">
        <i class="iconfont icon-huiyishiqueren_huabanfuben" :class="{'bg_FDB300': discountInput}"
           @click.stop="discountInput = !discountInput"></i>
        <p>不参与打折金额</p>
      </div>
      <div class="inputContainer" v-if="discountInput" :class="{active: type == 2}">
        <div class="input flex_box align_center" @click.stop="stopActiveEvent(2)">
          <span v-if="notDisMoney">{{notDisMoney}}</span>
          <i class="focus" :class="{'bg-F60F51': focusFlag2}"></i>
          <span class="placeholder" v-if="!notDisMoney">输入不参与折扣金额</span></div>
      </div>
    </div>
    <div class="module">
      <div class="pay card" @click="priType = priType == 1 ? DEFAULT_PRITYPE : 1" v-if="svipIsShow">
        <div class="justify_content dashed">
          <div class="left">
            <div class="flex_card"><i class="iconfont icon-gou fc-8D8E98"
                                      :class="{'active-2': priType == 1}"></i>卡主支付<span>推荐使用</span></div>
            <span style="font-size: 26rpx">共享卡非会员也可使用，最低享{{minSvipDiscount}}折</span>
          </div>
          <div class="right fc-F7094D" @click="showCardList">-{{svipDiscount_ceil}}元 <span
            class="iconfont icon-iconfontjiantou5"></span></div>
        </div>
        <div class="justify_content box-padding">
          <div class="flex_box flex_column align_center">
            <p class="fz-30 txt-ellipsis" style="max-width: 150rpx;margin-bottom: 12rpx">{{cardDetail.realName}}</p>
            <p class="fz-24 fc-8D8E98">卡主</p>
          </div>
          <div class="flex_box flex_column align_center">
            <p class="fz-30" style="margin-bottom: 12rpx">{{cardDetail.consumeAmount}}次</p>
            <p class="fz-24 fc-8D8E98">使用次数</p>
          </div>
          <div class="flex_box flex_column align_center">
            <p class="fz-30" style="margin-bottom: 12rpx">{{cardDetail.money_ceil}}元</p>
            <p class="fz-24 fc-8D8E98">卡主余额</p>
          </div>
          <div class="flex_box flex_column align_center">
            <p class="fz-30" style="margin-bottom: 12rpx">{{cardDetail.shareCardDiscount_ceil}}折</p>
            <p class="fz-24 fc-8D8E98">折扣</p>
          </div>
        </div>
      </div>
      <div class="pay flex-box" @click="priType = priType == 3 ? DEFAULT_PRITYPE : 3" v-if="allienceDiscountCard">
        <i class="iconfont icon-gou fc-8D8E98" :class="{'active-2': priType == 3}"></i>
        <div class="right" style="width: 450rpx">
          <p class="fz-30">选择助商通联盟打折卡</p>
          <p class="fz-28 fc-8D8E98">本店享<span class="fc-F7094D">{{allienceDiscountCard.userRole ? allienceDiscountCard.vipShareDiscountCardRate : allienceDiscountCard.comShareDiscountCardRate}}</span>折</p>
        </div>
        <div class="flex_box flex_column">
          <p class="fc-8D8E98 fz-28" @click="goAllienceDesc">如何使用</p>
          <p class="fz-28 fc-F7094D">-{{ALLIENCE_PAY.allienceDiscount_ceil}}元</p>
        </div>
      </div>
      <div class="pay flex-box" @click="priType = priType == 2 ? DEFAULT_PRITYPE : 2" v-if="actIsShow">
        <i class="iconfont icon-gou fc-8D8E98" :class="{'active-2': priType == 2}"></i>
        <div class="right">
          <p class="fz-30">话呗抵扣活动<span class="btn_radius fc-ffffff"
                                    :class="{'bg-FB768D-FEC1A4': discountType == 1 , 'bg-36E9BB':discountType == 2}"
                                    v-if="discountType" style="font-size: 30rpx;padding: 0 6rpx">{{discountType == 1
            ? '折' : discountType == 2 ? '减' : ''}}</span></p>
          <p class="fz-28 fc-8D8E98">{{disMsg ? disMsg : biIntegralactiveCount ? '满减活动或折扣活动' : '暂无活动'}}</p>
          <p class="fz-28 fc-F7094D" v-if="notDefFlag">话呗余额不足当前满减以为您匹配下级满减活动</p>
        </div>
        <div class="fz-28 fc-F7094D">-{{defDiscount_ceil}}元</div>
      </div>
    </div>

    <div class="pay flex-box" style="justify-content: space-between" @click="chooseCouponFlag" v-if="couponIsShow">
      <div class="flex-box" style="padding: 0;width: 400rpx">
        <i class="iconfont icon-gou fc-8D8E98" :class="{'active-2': couponPayFlag}"></i>
        <div class="right">
          <p class="fz-30">选择优惠券</p>
          <p class="fz-28 fc-8D8E98">{{coupon_list_length ? '优惠券' : '暂无优惠券'}}</p>
        </div>
      </div>
      <span @click.stop="showCouponList" v-if="coupon_list_length" :class="{'fc-F7094D': coupon}">
        {{coupon ? '-' + couponDiscount_ceil + '元' : '共' + coupon_list_length + '张'}}
        <span class="iconfont icon-iconfontjiantou5" style="color: #8D8E98;opacity: .6;margin: 0"></span></span>
    </div>

    <div style="height: 225rpx"></div>
    <footer>
      <div class="vipDiscount flex_box"  v-if="!allienceDiscountCard.userRole && priType == 3 && !allienceDiscountCard.expire">
        <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/4/7c8ad9c8987ec754877924dad1c1adf1.png " alt="" style="margin-right: 15rpx;">
        <p class="fz-24 fc-ffffff">升级VIP再优惠{{ALLIENCE_PAY.levelUpDiscount}}元</p>
      </div>
      <div class="order flex_box align_center justify_space_between">
        <div class="pay_info flex_box align_center"><i>已优惠{{discount ? discount_ceil : 0}}元,</i>实需支付:{{actPay ? actPay_ceil :
          0}}元
        </div>
        <form @submit="priJudge" report-submit="true">
          <button form-type="submit">立即支付</button>
        </form>
      </div>
    </footer>

    <keyboard-num @keyDownEvent="keydown"
                  @backSpaceEvent="backSpace"
                  @closeKeyboardEvent=""
                  ref="keyboard">
    </keyboard-num>

    <card-picker ref="cardPicker"
                 :totalMoney="oneLevelMoney"
                 :priType="priType"
                 @handleListLength="getCouponLength"
                 @onlyChooseCoupon="onlyChooseCoupon"
                 @chooseCouponEvent="chooseCoupon">
    </card-picker>


      <div class="alert" v-if="remainDef">
        <div class="remainDef" v-if="remainDef">
          <div class="close" @click.stop="close">
            <img src="/static/img/close.png" alt="">
          </div>
          <div class="title">余额不足</div>
          <p>
            卡主余额不足
          </p>
          <div class="btns">
            <button @click.stop="close">放弃支付</button>
            <form @submit="originalPay" report-submit="true">
              <button form-type="submit">原价支付</button>
            </form>
          </div>
        </div>
      </div>
    <div class="alert" v-if="allienceTips">
      <div class="remainDef" v-if="allienceTips">
        <div class="close" @click.stop="allienceTips = false">
          <img src="/static/img/close.png" alt="">
        </div>
        <div class="title">提示</div>
        <p>
          您的联盟打折卡已过期 ，查看如何激活和续期打折卡
        </p>
        <div class="btns">
          <form @submit="originalPay" report-submit="true">
            <button form-type="submit">原价支付</button>
          </form>
          <button @click="goMySvipCard">查看详情</button>
        </div>
      </div>
    </div>
    <v-confirm :confirmTitle="'提示'"
               :confirmDesc="'卡主余额不足您可以使用优惠券支付'"
               :confirmSubmit="'确认'"
               ref="vConfirm"
               @PassEvent="couponPayFlag=true;priType=''"></v-confirm>
    <v-confirm :confirmTitle="'提示'"
               :confirmDesc="'共享卡不参与抵扣,你可以使用优惠券支付'"
               :confirmSubmit="'确认'"
               ref="vConfirm_1"
               @PassEvent="couponPayFlag=true;priType=''"></v-confirm>
  </div>
</template>

<script>
  import cardPicker from './components/card-picker';
  import vConfirm from './components/vConfirm';
  import keyboardNum from './components/keyboardNum';
  import Tips from '@/common/js/tips';
  import floatTo from '@/common/js/floatTo';
  import {getSignIn , calDistance , getQuery} from "@/common/js/comm";
  import { mapMutations } from 'vuex';
  import { SHARECARDID}  from '@/store/mutation-types'

  export default {
    name: "indexBranch",
    components: {
      keyboardNum,
      vConfirm,
      cardPicker
    },
    data() {
      return {
        token: '',                    //口令
        focusFlag1: false,
        focusFlag2: false,
        focusTimer: '',
        notDefFlag: '',
        svipIsShow: false,             //卡主部分是否显示
        actIsShow: false,               //折扣满减活动是否显示
        couponIsShow: false,            //卡券活动是否显示
        distance: '',     //与门店距离
        lngtitude: '',                        //精度
        latitude: '',                         //纬度
        storeId: '',                  //店铺storedId
        shareuserId: '',
        no: '',
        shopId: '',
        scanSrc: '',
        user: {totalmoney: ''},                               //账户信息
        rate: '',                                            //折扣活动折扣率
        consumeMoney: '',                                   //满减活动满金额
        availableIntegral: '',                              //满减活动减金额
        activeNum: '',                                      //活动编号
        nowTime: '',
        allienceTips: '',
        payWay: 2,
        DEFAULT_PRITYPE: '',   //默认折扣类型
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
        discountInput: false,
        cardDetail: '',    //分享卡详情
        minSvipDiscount: '',   //卡主最低折扣
        cardList: [],       //分享卡集合
        cardType: '',  //卡类型 1主卡 2分享卡
        shareCardCount: '',  //分享卡总数
        biIntegralactiveCount: '',  //满减活动总数
        shopPayChannelCount: '',   //是否开通支付通道
        totalMoney: '',     //总金额
        actPay: '',          //实际支付金额
        discount: '',       //优惠金额
        actPay_ceil: '',    //实际支付金额/元
        discount_ceil: '',    //优惠金额/元
        svipActPay: '',    //卡主实际支付金额
        svipDiscount: '',   //卡主优惠金额
        svipActPay_ceil: '',   //卡主实际支付金额/元
        svipDiscount_ceil: '',   //卡主优惠金额/元
        defActPay: '',      //满减折扣实际支付金额
        defDiscount: '',    //满减折扣优惠金额
        defActPay_ceil: '',      //满减折扣实际支付金额/元
        defDiscount_ceil: '',    //满减折扣优惠金额/元
        defActiveNum: '',   //满减活动编号
        couponActPay: '',   //卡券实际支付金额
        couponDiscount: '',  //卡券优惠金额
        couponActPay_ceil: '',   //卡券实际支付金额/元
        couponDiscount_ceil: '',  //卡券优惠金额/元
        couponActiveNum: '',  //卡券活动编号
        notDisMoney: '',   //不参与打折金额
        disMoney: '',      //参与打折金额
        oneLevelMoney: '',   //一级计算金额
        type: '',        //输入框选择 1输入总订单金额 2输入不参与打折金额
        priType: '',     //折扣方式 1卡主支付 2满减或折扣 3优惠券满减或折扣,
        couponPayFlag: false,   //优惠券开关控制器
        disMsg: '',    //抵扣提示信息
        //          卡券部分
        coupon_list_length: '',
        coupon: '',

        SVIP_PAY_CHANEL: '',   //卡主支付支付参数
        ACTIVE_PAY_CHANEL: '',  //商家活动支付支付参数
        allienceDiscountCard: '',

        ALLIENCE_PAY: {allienceActPay: '',allienceDiscount: '', allienceActPay_ceil: '',allienceDiscount_ceil: '' , levelUpDiscount: '',}  //联盟打折卡支付金额
      }
    },
    methods: {
      ...mapMutations({
        shareCardMes:'SHARECARDID'
      }),
      accDiv(num1, num2) {
        return floatTo.divide(num1, num2)
      },
      accAdd(num1, num2) {
        return floatTo.add(num1, num2)
      },
      accMul(num1, num2) {
        return floatTo.multiply(num1, num2)
      },
      Subtr(num1, num2) {
        return floatTo.subtract(num1, num2)
      },
      /**
       * 未登录前往登录
       */
      goLogin(){
        if(!this.$store.state.token){
          var par = getQuery();
          if (par.scene) {
            this.scene = par.scene;
            const url = `../../../../pages/loginpage/main?scene=${par.scene}`;
            wx.navigateTo({url})
          }else if(par.q){
            this.q = par.q;
            const url = `../../../../pages/loginpage/main?q=${par.q}`;
            wx.navigateTo({url})
          }else{
            const url = `../../../../pages/loginpage/main`;
            wx.navigateTo({url})
          }
        }

      },

      goMySvipCard(){
        var url = `/pages/packageD/pages/mySvipcard/main`;
        wx.navigateTo({url});
      },

      /**
       * 关闭所有弹窗
       * */
      close() {
        var _self = this;
        _self.remainDef = false;
      },


      /** 提醒黑窗口弹出*/
      toast(tip) {
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },

      /** 模拟input框获取焦点*/
      focus() {
        var _self = this;
        if (_self.type == 1) {
          clearInterval(_self.focusTimer);
          _self.focusFlag2 = false;
          _self.focusTimer = setInterval(() => {
            _self.focusFlag1 = !_self.focusFlag1;
          }, 500)
        } else if (_self.type == 2) {
          clearInterval(_self.focusTimer);
          _self.focusFlag1 = false;
          _self.focusTimer = setInterval(() => {
            _self.focusFlag2 = !_self.focusFlag2;
          }, 500)
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

      goAllienceDesc(){
        var url = '/pages/packageA/pages/allienceDesc/main';
        wx.navigateTo({url});
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
        if (status == 0) {
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
        _self.type = type;
        _self.focus();
        _self.isShowKeyboard(1);
      },


      /**初始化*/
      init() {
        var _self = this;
        try {
          if(this.$store.state.token){
            _self.$refs.cardPicker.getCouponList(_self.storeId);
          }
          _self.getUserInfo();
          _self.getStoreInfo();
          _self.getViplist();
          _self.getShopDetail();
          _self.getPayChanel();
        }catch (e) {
          console.log(e);
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
        if(this.$store.state.token){
          var _data = {
            token: String(_self.token)
          };
          getSignIn(_data).then(sec => {
            _self.$http.getBalance(_data, sec).then(res => {
              if (res.state == 1) {
                _self.user.totalmoney = res.data.totalMoney;
              } else {
                Tips.toast(decodeURIComponent(res.msg),'none')
              }
            })
          });
        }
      },

      /**
       * 获取支付通道号
       */
      getPayChanel(){
        var _self = this;
        var _data = {
          token: _self.$store.state.token ? _self.$store.state.token : '',
          shopStoreId: _self.storeId,
        }
        getSignIn(_data).then(sec => {
          _self.$http.payMoney(_data,sec).then(res => {
            if(res.state == 1){
              _self.SVIP_PAY_CHANEL = res.data;
              _self.ACTIVE_PAY_CHANEL = res.activeBiShoppaychannel;
            }else{
              Tips.toast(decodeURIComponent(res.msg),'none')
            }
          })
        })
      },

      /**获取店铺信息*/
      getStoreInfo() {
        var _self = this;
        var _data = {
          token:this.$store.state.token ? this.$store.state.token : '',
          storeId:this.storeId,
        }
        getSignIn(_data).then(sec => {
          _self.$http.getActiveDetail(_data,sec).then(res => {
            if (res.state == 1) {
              var _data = res.data;
              _data.forEach(e => {
                if (e.discountType == 1) {
                  _self.discountAct.push(e);
                  _self.rate = e.discountRate * 100 / 100;
                  _self.discountType = 1;
                } else if (e.discountType == 2) {
                  _self.discountType = 2;
                  _self.reduAct.push(e);
                }
                /*if (CARDPAGE.totalMoney) {
                  _self.totalMoney = CARDPAGE.totalMoney;
                }
                if (CARDPAGE.notDisMoney) {
                  _self.notDisMoney = CARDPAGE.notDisMoney;
                }
                if (CARDPAGE.discountInput) {
                  _self.discountInput = CARDPAGE.discountInput;
                }*/
              });
              _self.reduAct = _self.reduAct.sort(_self.sortConsume);
              _self.reduAct.forEach(e => {
                _self.consumeMoneys.push(e.consumeMoney);
              })
            }else{
              Tips.toast(decodeURIComponent(res.msg),'none')
            }
          }).catch(e => {
            console.log(e)
          })
        })


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
              _self.judgeAlert();
            } else {
              _self.toast("暂无用户信息")
            }
          }
        } catch (e) {
          alert(e);
        }

      },



      /**助商通满减或折扣活动金额计算*/
      judgeAlert() {
        var _self = this;
        var discount;
        _self.def_status = 0;
        if (_self.rate && _self.disMoney) {
          discount = _self.Subtr(Number(_self.disMoney),_self.accMul(_self.accMul(Number(_self.disMoney),_self.rate),0.1));
          if (_self.user.totalmoney >= discount) {
            _self.defActPay = Math.ceil(_self.accAdd(_self.accMul(_self.accMul(_self.disMoney,_self.rate),10),_self.accMul(_self.notDisMoney,100)));

            _self.defDiscount = _self.coupon ?
              _self.Subtr(_self.Subtr(_self.accMul(_self.totalMoney, 100), _self.defActPay),_self.accMul(_self.coupon.couponMoney,100)) :
              _self.Subtr(_self.accMul(_self.totalMoney, 100), _self.defActPay);
            _self.disMsg = '享'+ _self.accMul(_self.rate,1) + '折,' +'话呗抵扣 : ' + _self.accDiv(_self.defDiscount, 100) + '元';
            _self.defActiveNum = _self.discountAct[0].id;
          } else {
            _self.disMsg = '话呗余额不足';
            _self.defActPay = Math.ceil(_self.accAdd(_self.accMul(_self.disMoney,100),_self.accMul(_self.notDisMoney,100)));
            _self.defDiscount = 0;
            _self.defActiveNum = ''
          }
        } else if (_self.reduAct.length != 0 && _self.disMoney) {
          try {
            if (_self.user.totalmoney >= _self.reduAct[0].availableIntegral) {      //判断话呗余额是否达到最低满减
              if (_self.act) {
                if (_self.user.totalmoney >= _self.act.availableIntegral) {
                  _self.disMsg = "满" + _self.act.consumeMoney + "元减" + _self.accMul(_self.act.availableIntegral,1) + "元";
                  _self.defActPay = Math.ceil(_self.accAdd(_self.accMul(_self.Subtr(Number(_self.disMoney),_self.act.availableIntegral),100),_self.accMul(_self.notDisMoney,100)));
                  _self.defDiscount = _self.accMul(_self.act.availableIntegral,100);
                  _self.defActiveNum = _self.act.id;
                } else {
                  _self.notDefFlag = true;
                  _self.mapAct();
                }
              } else {
                var obj = _self.reduAct[_self.actIndex + 1];
                _self.disMsg = "满" + obj.consumeMoney + "元减" + _self.accMul(obj.availableIntegral,1) + "元,当前还差" + (obj.consumeMoney - Number(_self.disMoney)).toFixed(1) + '元';
                _self.defActPay = Math.ceil(_self.accAdd(_self.accMul(_self.disMoney, 100),_self.accMul(_self.notDisMoney,100)));
                _self.defDiscount = 0;
                _self.defActiveNum = '';
              }
            } else if (_self.disMoney) {                                  //余额不足最低满减 提醒余额不足选择充值或原价付
              _self.disMsg = "话呗余额不足";
              _self.defActPay = Math.ceil(_self.accAdd(_self.accMul(_self.disMoney,100),_self.accMul(_self.notDisMoney,100)));
              _self.defDiscount = 0;
              _self.defActiveNum = '';
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          _self.disMsg = '';
          _self.defActPay = Math.ceil(_self.accAdd(_self.accMul(_self.disMoney,100),_self.accMul(_self.notDisMoney,100)));
          _self.defDiscount = 0;
          _self.defActiveNum = '';
        }
      },




      submitScanPay(_data){
        var _self = this;
        getSignIn(_data).then(sec => {
          _self.$http.unifiedpay(_data,sec).then(res => {
            if (res.state == 1) {
              if(_data.amount==0){
                Tips.toast(`付款成功`, 'none');
                wx.navigateTo({
                  url: `../../pages/paySuc/main?orderNum=${res.orderNum}&shopStoreId=${_self.storeId}`
                })
              }else{
                wx.requestPayment({
                  timeStamp: res.data.apiTimestamp,
                  nonceStr: res.data.apiNoncestr,
                  package: res.data.apiPackage,
                  signType: res.data.apiSigntype,
                  paySign: res.data.apiPaysign,
                  success: function (cc) {
                    Tips.toast(`付款成功`, 'none');
                    wx.navigateTo({
                      url: `../../pages/paySuc/main?orderNum=${res.orderNum}&shopStoreId=${_self.storeId}`
                    })
                  },
                  fail: function (res) {
                    if(res.errMsg == 'requestPayment:fail cancel'){
                    }
                  },
                  complete: function (res) {
                  }
                })
              }
            }else {
              Tips.toast(decodeURIComponent(res.msg), 'none');
            }
          })
        })
      },
      formatTimeStamp(date,time='0:0:0'){
        return Date.parse(new Date(`${date} ${time}`))||Date.parse(new Date(`${date.replace(/-/g,'/')} ${time}`))
      },
      /**
       * 获取SVIP卡信息
       * */
      getShopDetail() {
        var _self = this;
        var _data;
        if (_self.$store.state.shareCardId) {
          _data = {
            token: String(_self.token),
            shopStoreId: String(_self.storeId),
            shareCardId: String(_self.$store.state.shareCardId),
            wxUnionId:_self.$store.state.unionid? _self.$store.state.unionid :'',
          }
        } else {
          _data = {
            token: String(_self.token),
            shopStoreId: String(_self.storeId),
            wxUnionId:_self.$store.state.unionid? _self.$store.state.unionid :'',
          };
        }

        getSignIn(_data).then(sec => {
          _self.$http.getPayDetail(_data, sec).then(res => {
            if (res.state == 1) {
              _self.shopPayChannelCount = res.shopPayChannelCount;
              _self.shareCardCount = res.shareCardCount;
              _self.cardDetail = res.data;
              _self.cardDetail.money_ceil = _self.accDiv(Number(_self.cardDetail.money),100);
              _self.cardDetail.shareCardDiscount_ceil = _self.accMul(Number(_self.cardDetail.shareCardDiscount ? _self.cardDetail.shareCardDiscount : 0),10);
              _self.shopId = res.bishopStore.shopId;
              _self.shopDetail = res.bishopStore;
              _self.biIntegralactiveCount = res.biIntegralactiveCount;
              _self.distance = calDistance(_self.lngtitude, _self.latitude, _self.shopDetail.longitude, _self.shopDetail.latitude);
              _self.allienceDiscountCard = res.allienceDiscountCard ? res.allienceDiscountCard : '';    //联盟打折卡
              if(_self.allienceDiscountCard){
                var time = Date.parse(new Date())/1000;
                if(time > _self.allienceDiscountCard.shareDiscountCardExpireTime){
                  _self.allienceDiscountCard.expire = 1;
                }
              }
              if (_self.shopPayChannelCount && _self.shareCardCount) {             //有共享卡，开通收银
                _self.svipIsShow = true;
                _self.biIntegralactiveCount ? _self.actIsShow=true : _self.actIsShow=false;
                _self.couponIsShow = true;
                _self.DEFAULT_PRITYPE = '';
                _self.priType = 1;
              } else if (_self.shopPayChannelCount && !_self.shareCardCount) {       //没有有效的共享卡 ，开通收银
                _self.biIntegralactiveCount ? _self.actIsShow=true : _self.actIsShow=false;
                _self.couponIsShow = true;
                _self.DEFAULT_PRITYPE = '';
                _self.allienceDiscountCard ? _self.priType=3 : _self.priType=_self.DEFAULT_PRITYPE;
              } else if (!_self.shopPayChannelCount && _self.shareCardCount) {         //有共享卡，没有开通收银
                _self.svipIsShow = true;
                _self.DEFAULT_PRITYPE = '';
                _self.priType = 1;
              } else {                                                                  //没有有效的共享卡 ，没有开通收银
                wx.redirectTo({
                  url:`/pages/packageD/pages/noticeMes/main?storeLogo=${_self.shopDetail.storeLogo}&storeName=${_self.shopDetail.storeName}`
                })
              }
            } else {
              Tips.toast(decodeURIComponent(res.data.msg),'none');
            }
          })
        })
      },

      /** 显示分享卡列表*/
      showCardList() {
        var _self = this;
        if(this.$store.state.token){
          wx.navigateTo({
            url: `../../pages/svipCard/main?shopStoreId=${_self.storeId}&totalMoney=${_self.totalMoney}`
          })
        }else{
          this.goLogin();
        }

      },


      /**
       * 获取分享卡列表
       */
      getViplist() {
        var _self = this;
        if(this.$store.state.token){
          var _data = {
            token: this.token,
            shopStoreId: String(this.storeId),
            distance: 0,
            LONG: String(this.lngtitude),
            LAT: String(this.latitude)
          };

          getSignIn(_data).then(sec => {
            _self.$http.recomShare(_data, sec).then(res => {
              if (res.state == 1) {
                _self.cardList = res.data;
                _self.minSvipDiscount = (res.data[0].shareCardDiscount*10).toFixed(1);
                _self.cardList.forEach(ele => {
                  ele.money_ceil = _self.accDiv(Number(ele.money),100);
                  ele.shareCardDiscount_ceil = _self.accMul(Number(ele.shareCardDiscount),10);
                });
                _self.calMoney();
              } else {
                Tips.toast(decodeURIComponent(res.data.msg),'none');
              }
            })
          })
        }

      },

      /**
       * 自动匹配分享卡
       */
      mapCard(){
        var _self = this;
        if(_self.cardList.length > 0){
          for(var i=0;i<_self.cardList.length;i++){
            var svipActPay = _self.accMul(_self.accMul(_self.cardList[i].shareCardDiscount,Number(_self.disMoney)),100);
            if(_self.cardList[i].money >= svipActPay){
              return _self.cardList[i];
            }
          }
        }else{
          return false;
        }
      },




      /**
       * 卡主支付——APP支付
       * @param _data
       */
      submitSvipPay(_data) {
        var _self = this;
        getSignIn(_data).then(sec => {
          _self.$http.unifiedpay(_data, sec).then(res => {
            if (res.state == 1) {
              if(_data.amount == 0){
                Tips.toast(`付款成功`, 'none');
                wx.navigateTo({
                  url: `../../pages/paySuc/main?orderNum=${res.orderNum}&shopStoreId=${_self.storeId}`
                })
              }else{
                if(res.data.resultCode != -1) {
                  wx.requestPayment({
                    timeStamp: res.data.apiTimestamp,
                    nonceStr: res.data.apiNoncestr,
                    package: res.data.apiPackage,
                    signType: res.data.apiSigntype,
                    paySign: res.data.apiPaysign,
                    success: function (cc) {
                      Tips.toast(`付款成功`, 'none');
                      wx.navigateTo({
                        url: `../../pages/paySuc/main?orderNum=${res.orderNum}&shopStoreId=${_self.storeId}&shareCardId=${_self.cardDetail.id ? _self.cardDetail.id : ''}`
                      })
                    },
                    fail: function (res) {
                      if (res.errMsg == 'requestPayment:fail cancel') {

                      }
                    },
                    complete: function (res) {
                    }
                  })
                }else{
                  Tips.toast(`${res.data.message}`, 'none');
                }
              }
            } else if (res.state == 900260) {
              if(_self.coupon && _self.priType == 1){
                _self.$refs.vConfirm.showConfirm();
              }else{
                _self.remainDef = true;
              }
            } else {
              Tips.toast(decodeURIComponent(res.msg), 'none');
            }
          })
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
        _self.couponPayFlag = true;
      },

      onlyChooseCoupon(coupon){
        this.coupon = coupon;
        this.couponPayFlag=true;
        this.priType=''
      },


      /**
       * 卡主支付——按分享卡折扣——下单
       * */
      svipPay(formId) {
        var _self = this;
        var _data;
        _data = {
          storeId: _self.SVIP_PAY_CHANEL.shopStoreId,
          trmNo: _self.SVIP_PAY_CHANEL.channelTrmNO,
          mercId: _self.SVIP_PAY_CHANEL.channelStoreNum,
          consumeShopId: _self.shopId,
          consumeStoreId: _self.storeId,
          no: 0,
          openid: _self.$store.state.openId ? _self.$store.state.openId : '',
          amount: String(_self.actPay),
          totalAmount: String(_self.accMul(_self.totalMoney, 100)),
          subject: encodeURI(`${_self.shopDetail.storeName}共享卡付款`),
          shareuserId:String(_self.shareuserId),
          sharecardId: String(_self.cardDetail.id),
          userId: _self.$store.state.userLiId ? _self.$store.state.userLiId : '',
          miniAppId: 'wx5e11922e81e3951d',
          wxUnionId: _self.$store.state.unionid ? _self.$store.state.unionid : '',
          nonPartakeMoney: String(_self.accMul(Number(_self.notDisMoney), 100)),
          couponId:_self.coupon ? _self.coupon.id : '',
          formId: formId,
          payWay: 2
        };
        _self.submitSvipPay(_data);
      },

      /**满减或折扣活动确认支付-APP类型判断*/
      pay(formId) {
        var _self = this;
        var _data,integralCount;
        if(_self.activeNum || _self.coupon){
          integralCount = _self.coupon ? String(_self.Subtr(_self.accDiv(_self.discount, 100),_self.coupon.couponMoney)) :  String(_self.accDiv(_self.discount, 100));
          _data = {
            storeId: _self.ACTIVE_PAY_CHANEL.shopStoreId,
            trmNo: _self.ACTIVE_PAY_CHANEL.channelTrmNO,
            mercId: _self.ACTIVE_PAY_CHANEL.channelStoreNum,
            consumeShopId: _self.shopId,
            consumeStoreId: _self.storeId,
            no: 0,
            openid: _self.$store.state.openId ? _self.$store.state.openId : '',
            amount:_self.actPay,
            totalAmount: _self.accMul(_self.totalMoney,100),
            subject: encodeURI(`${_self.shopDetail.storeName}`),
            userId: _self.$store.state.userLiId ? _self.$store.state.userLiId : '',
            miniAppId: 'wx5e11922e81e3951d',
            wxUnionId: _self.$store.state.unionid ? _self.$store.state.unionid : '',
            nonPartakeMoney:String(_self.accMul(Number(_self.notDisMoney), 100)),
            activeNum:String(_self.activeNum) ? String(_self.activeNum) : '',
            couponId:_self.coupon ? _self.coupon.id : '',
            integralCount:integralCount,
            totalmoney:_self.user.totalmoney?_self.user.totalmoney:'',
            formId: formId,
            payWay: 2
          };
          _self.submitSvipPay(_data);
        }else{
          _self.originalPay(formId);
        }

      },

      /**
       * 联盟打折卡支付
       */
      alliencePay(formId){
        var _self = this;
        var _data;
        _data = {
          storeId: _self.ACTIVE_PAY_CHANEL.shopStoreId,
          trmNo: _self.ACTIVE_PAY_CHANEL.channelTrmNO,
          mercId: _self.ACTIVE_PAY_CHANEL.channelStoreNum,
          consumeShopId: _self.shopId,
          consumeStoreId: _self.storeId,
          no: 0,
          openid: _self.$store.state.openId ? _self.$store.state.openId : '',
          amount:_self.actPay,
          totalAmount: _self.accMul(_self.totalMoney,100),
          subject: encodeURI(`${_self.shopDetail.storeName}`),
          userId: _self.$store.state.userLiId ? _self.$store.state.userLiId : '',
          miniAppId: 'wx5e11922e81e3951d',
          wxUnionId: _self.$store.state.unionid ? _self.$store.state.unionid : '',
          nonPartakeMoney:String(_self.accMul(Number(_self.notDisMoney), 100)),
          couponId:_self.coupon ? _self.coupon.id : '',
          totalmoney:_self.user.totalmoney?_self.user.totalmoney:'',
          payWay: '2',
          formId: formId,
          isShareDiscountCard: 1
        };
        _self.submitSvipPay(_data);
      },

      /**
       * 使用优惠券下单支付
       */
      couponPay(formId) {
        var _self = this;
        var _data;
        if(_self.coupon){
          _data = {
            storeId: _self.ACTIVE_PAY_CHANEL.shopStoreId,
            trmNo: _self.ACTIVE_PAY_CHANEL.channelTrmNO,
            mercId: _self.ACTIVE_PAY_CHANEL.channelStoreNum,
            consumeShopId: _self.shopId,
            consumeStoreId: _self.storeId,
            no: 0,
            openid: _self.$store.state.openId ? _self.$store.state.openId : '',
            amount:_self.actPay,
            totalAmount: _self.accMul(_self.totalMoney,100),
            subject: encodeURI(`${_self.shopDetail.storeName}`),
            userId: _self.$store.state.userLiId ? _self.$store.state.userLiId : '',
            miniAppId: 'wx5e11922e81e3951d',
            wxUnionId: _self.$store.state.unionid ? _self.$store.state.unionid : '',
            nonPartakeMoney:String(_self.accMul(Number(_self.notDisMoney), 100)),
            couponId:_self.coupon ? _self.coupon.id : '',
            payWay: '2',
            formId: formId,
            totalmoney:_self.user.totalmoney?_self.user.totalmoney:'',
          };
          _self.submitSvipPay(_data);
        }else{
          _self.originalPay(formId);
        }
      },

      /**
       * 卡主支付——原价支付——下单
       */
      originalPay(formId) {
        var _self = this;
        _self.actPay = _self.accMul(_self.totalMoney, 100);
        _self.discount = 0;
        _self.svipDiscount = 0;
        var _data = {
          storeId: _self.ACTIVE_PAY_CHANEL ? _self.ACTIVE_PAY_CHANEL.shopStoreId : _self.SVIP_PAY_CHANEL.shopStoreId,
          trmNo: _self.ACTIVE_PAY_CHANEL ? _self.ACTIVE_PAY_CHANEL.channelTrmNO :_self.SVIP_PAY_CHANEL.channelTrmNO,
          mercId: _self.ACTIVE_PAY_CHANEL ? _self.ACTIVE_PAY_CHANEL.channelStoreNum :_self.SVIP_PAY_CHANEL.channelStoreNum,
          consumeShopId: _self.shopId,
          consumeStoreId: _self.storeId,
          no: 0,
          openid: _self.$store.state.openId ? _self.$store.state.openId : '',
          amount: String(_self.accMul(_self.totalMoney, 100)),
          totalAmount: String(_self.accMul(_self.totalMoney, 100)),
          subject: encodeURI(`${_self.shopDetail.storeName}共享卡付款`),
          shareuserId:String(_self.shareuserId),
          userId: _self.$store.state.userLiId ? _self.$store.state.userLiId : '',
          miniAppId: 'wx5e11922e81e3951d',
          wxUnionId: _self.$store.state.unionid ? _self.$store.state.unionid : '',
          payWay: '2',
          formId: formId,
          isOriginPricePay: '1'
        };
        _self.submitSvipPay(_data);
      },

      /**判断优惠活动类型,确认支付下单付款*/
      priJudge(e) {
        var _self = this;
        var formId = e.mp.detail.formId;
        if (Number(_self.totalMoney)) {
          if (_self.priType == 1) {                    //卡主支付
            if (Number(_self.totalMoney) < Number(_self.notDisMoney)) {
              Tips.toast("订单总金额请勿小于不参与折扣金额",'none');
            } else {
              if(_self.svipDiscount == 0 && _self.couponPayFlag){
                _self.$refs.vConfirm_1.showConfirm();
              }else{
                _self.svipPay(formId);
              }
            }
          } else if (_self.priType == 2) {             //折扣或满减活动
            _self.pay(formId);
          } else if (_self.priType == 3) {
            if(_self.allienceDiscountCard.expire){
              _self.allienceTips = true;
            }else{
              _self.alliencePay(formId);
            }
          } else if (_self.couponPayFlag && !_self.priType) {             //优惠券折扣满减
            _self.couponPay(formId);
          } else {                                     //原价支付
            _self.originalPay(formId);
          }
        } else if (isNaN(_self.totalMoney)) {
          Tips.toast('请输入正确金额','none');
        } else {
          Tips.toast('请输入付费金额','none');
        }
      },



      /**
       * 计算各个活动最终付款金额
       * */
      calMoney() {
        var _self = this;
        if(_self.coupon && Number(_self.Subtr(Number(_self.oneLevelMoney), _self.coupon.couponMoney)) <0 && (Number(_self.oneLevelMoney) >= _self.coupon.consumeMoney)){   //实付金额小于卡券优惠
          _self.disMoney = 0;
          _self.svipActPay = _self.accMul(Number(_self.notDisMoney),100);
          _self.svipDiscount = 0;

          _self.defActPay = _self.accMul(Number(_self.notDisMoney),100);
          _self.defDiscount = 0;

          _self.couponActPay = _self.accMul(Number(_self.notDisMoney),100);
          _self.couponDiscount = _self.accMul(_self.oneLevelMoney,100);

          _self.ALLIENCE_PAY.levelUpDiscount = 0;
          _self.ALLIENCE_PAY.allienceActPay = _self.accMul(Number(_self.notDisMoney),100);
          _self.ALLIENCE_PAY.allienceDiscount = 0;
        }else{
          if(Number(_self.oneLevelMoney)){
            _self.disMoney = _self.coupon ? _self.Subtr(Number(_self.oneLevelMoney), _self.coupon.couponMoney) : _self.oneLevelMoney;
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
          if(!_self.$store.state.shareCardId){
            if(_self.mapCard()){
              _self.cardDetail = _self.mapCard();

            }
            _self.svipActPay = Math.ceil(_self.accAdd(_self.accMul(_self.accMul(_self.disMoney, _self.cardDetail.shareCardDiscount ? _self.cardDetail.shareCardDiscount : 0), 100), _self.accMul(_self.notDisMoney, 100)));
            _self.svipDiscount = _self.coupon ? _self.Subtr(_self.Subtr(_self.accMul(_self.totalMoney, 100), _self.svipActPay),_self.accMul(_self.coupon.couponMoney,100)) : _self.Subtr(_self.accMul(_self.totalMoney, 100), _self.svipActPay);
          }else{
            console.log(_self.cardDetail);
            _self.svipActPay = Math.ceil(_self.accAdd(_self.accMul(_self.accMul(_self.disMoney, _self.cardDetail.shareCardDiscount ? _self.cardDetail.shareCardDiscount : 0), 100), _self.accMul(_self.notDisMoney, 100)));
            _self.svipDiscount = _self.coupon ? _self.Subtr(_self.Subtr(_self.accMul(_self.totalMoney, 100), _self.svipActPay),_self.accMul(_self.coupon.couponMoney,100)) : _self.Subtr(_self.accMul(_self.totalMoney, 100), _self.svipActPay);
          }

          //折扣满减
          _self.judgeAlert();

          //联盟打折卡
          var ALLIENCE_VIP_ACTPAY = Math.ceil(_self.accAdd(_self.accMul(_self.disMoney,_self.accMul(Number(_self.allienceDiscountCard.vipShareDiscountCardRate),10)),_self.accMul(_self.notDisMoney, 100)));
          var ALLIENCE_USER_ACTPAY = Math.ceil(_self.accAdd(_self.accMul(_self.disMoney,_self.accMul(Number(_self.allienceDiscountCard.comShareDiscountCardRate),10)),_self.accMul(_self.notDisMoney, 100)));
          var ALLIENCE_VIP_DISCOUNT = _self.coupon ? _self.Subtr(_self.Subtr(_self.accMul(_self.totalMoney, 100),ALLIENCE_VIP_ACTPAY),_self.accMul(_self.coupon.couponMoney,100)) : _self.Subtr(_self.accMul(_self.totalMoney, 100), ALLIENCE_VIP_ACTPAY);
          var ALLIENCE_USER_DISCOUNT = _self.coupon ? _self.Subtr(_self.Subtr(_self.accMul(_self.totalMoney, 100),ALLIENCE_USER_ACTPAY),_self.accMul(_self.coupon.couponMoney,100)) : _self.Subtr(_self.accMul(_self.totalMoney, 100), ALLIENCE_USER_ACTPAY);
          _self.ALLIENCE_PAY.levelUpDiscount = _self.accDiv(_self.Subtr(ALLIENCE_VIP_DISCOUNT,ALLIENCE_USER_DISCOUNT),100);
          // _self.ALLIENCE_PAY.levelUpDiscount = Number(_self.ALLIENCE_PAY.levelUpDiscount) < 0 ? 0 : _self.ALLIENCE_PAY.levelUpDiscount;
          if(_self.allienceDiscountCard.userRole){
            _self.ALLIENCE_PAY.allienceActPay = ALLIENCE_VIP_ACTPAY;
            _self.ALLIENCE_PAY.allienceDiscount = ALLIENCE_VIP_DISCOUNT;
          }else{
            _self.ALLIENCE_PAY.allienceActPay = ALLIENCE_USER_ACTPAY;
            _self.ALLIENCE_PAY.allienceDiscount = ALLIENCE_USER_DISCOUNT;
          }

          if (_self.coupon) {                         //有优惠券时
            if (Number(_self.oneLevelMoney) >= _self.coupon.consumeMoney * 100 / 100) {
              _self.couponActPay = Math.ceil(_self.accMul(_self.Subtr(Number(_self.totalMoney), _self.coupon.couponMoney), 100));
              _self.couponDiscount = _self.Subtr(_self.accMul(Number(_self.totalMoney),100), _self.couponActPay);
            } else {
              _self.$refs.cardPicker.updateCounponActIndex();
              _self.coupon = '';                      //金额未达到已选卡券,删除已选卡券,重计金额
            }
          } else {                                     //无优惠券时
            _self.couponActPay = Math.ceil(Number(_self.totalMoney) * 100);
            _self.couponDiscount = 0;
          }
        }
        _self.svipActPay_ceil = _self.accDiv(_self.svipActPay,100);
        _self.svipDiscount_ceil = _self.accDiv(_self.svipDiscount,100);
        _self.defActPay_ceil = _self.accDiv(_self.defActPay,100);
        _self.defDiscount_ceil = _self.accDiv(_self.defDiscount,100);
        _self.couponActPay_ceil = _self.accDiv(_self.couponActPay,100);
        _self.couponDiscount_ceil = _self.accDiv(_self.couponDiscount,100);
        _self.ALLIENCE_PAY.allienceActPay_ceil = _self.accDiv(_self.ALLIENCE_PAY.allienceActPay,100);
        _self.ALLIENCE_PAY.allienceDiscount_ceil = _self.accDiv(_self.ALLIENCE_PAY.allienceDiscount,100);
        _self.priTypeEvent();

      },

      /**
       * 判断当前活动类型
       */
      priTypeEvent() {
        var _self = this;
        if (_self.priType == 1) {
          _self.actPay = _self.svipActPay<0 ? 0 : _self.svipActPay;
          _self.discount = _self.Subtr(_self.accMul(Number(_self.totalMoney),100),_self.actPay);
        } else if (_self.priType == 2) {
          _self.actPay = _self.defActPay<0 ? 0 : _self.defActPay;
          _self.discount = _self.Subtr(_self.accMul(Number(_self.totalMoney),100),_self.actPay);
          _self.activeNum = _self.defActiveNum;
        } else if (_self.priType == 3) {
          _self.actPay = _self.ALLIENCE_PAY.allienceActPay<0 ? 0 : _self.ALLIENCE_PAY.allienceActPay;
          _self.discount = _self.Subtr(_self.accMul(Number(_self.totalMoney),100),_self.actPay);
        } else if (_self.couponPayFlag && !_self.priType) {
          _self.actPay = _self.couponActPay<0 ? 0 : _self.couponActPay;
          _self.discount = _self.couponDiscount;
        } else{
          _self.actPay = _self.accMul(_self.totalMoney, 100);
          _self.discount = 0;
        }
        _self.actPay_ceil = _self.accDiv(_self.actPay,100);
        _self.discount_ceil = _self.accDiv(_self.discount,100);
      },

      /**
       * 选择卡券类型
       */
      chooseCouponFlag(){
        if(this.$store.state.token){
          this.couponPayFlag = !this.couponPayFlag;
          if(!this.couponPayFlag){
            this.coupon = '';
            this.priType ? this.priType = this.priType : this.priType = this.DEFAULT_PRITYPE;
          }
        }else{
          this.goLogin();
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
        return '' + year + month + day + hour + minute + second;
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
        _self.oneLevelMoney = _self.Subtr(Number(_self.totalMoney), Number(_self.notDisMoney));
        if (Number(_self.notDisMoney > Number(_self.totalMoney))) {
          Tips.toast('订单总金额请勿小于不参与折扣金额','none');
          _self.notDisMoney = _self.notDisMoney.slice(0, -1)
        }
        _self.calMoney();
      },
      totalMoney() {
        var _self = this;
        _self.oneLevelMoney = _self.Subtr(Number(_self.totalMoney), Number(_self.notDisMoney));
        _self.notDefFlag = false;
        _self.calMoney();
      },
      discountInput() {
        var _self = this;
        if (!_self.discountInput) {
          _self.notDisMoney = '';
        }
      },
      cardDetail: {
        handler() {
          var _self = this;
          _self.calMoney();
        },
        deep: true
      },
      /**
       * 监听用户选择优惠券变化
       */
      coupon: {
        handler() {
          var _self = this;
          _self.calMoney();
          if(!_self.coupon){
            _self.$refs.cardPicker.updateCounponActIndex();
          }
        },
        deep: true
      },
      /**
       * 监听用户选择活动类型变化
       */
      priType() {
        if(this.priType == 2){
          if(this.$store.state.token){
            if(this.coupon.isAllowSuperposition == '0'){
              this.priType ? this.coupon = '' : ''
            }
            this.calMoney();
          }else{
            this.goLogin();
          }
        }else{
          if(this.coupon.isAllowSuperposition == '0'){
            this.priType ? this.coupon = '' : ''
          }
          this.calMoney();
        }

      },
      /**
       * 优惠券监听
       */
      couponPayFlag(){

      }
    },
    onShow(){
      this.storeId ? this.getShopDetail() : '';
      this.$refs.cardPicker.close();
      this.$refs.cardPicker.updateCounponActIndex();
    },
    mounted() {
      var _self = this;
      _self.token = _self.$store.state.token;
      var par = getQuery();
      par.sharecardId ? _self.shareCardMes(par.sharecardId) : _self.shareCardMes('');
      if (par.scene) {
        this.scene = par.scene;
        par.scene = decodeURIComponent(par.scene);
        var newArr = par.scene.split(',');
        this.storeId = newArr[1];
      }else if(par.q){
        par.q = decodeURIComponent(par.q);
        var newObj = par.q.split('?');
        var newObjMes = newObj[1].split(',');
        this.storeId = newObjMes[1];
      }else{
        this.storeId = String(par.shopStoreId);
      }
      this.shareuserId = par.inviterId ? par.inviterId : par.shareuserId ? par.shareuserId : '';
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
    padding: 154rpx 17rpx 28rpx;
    overflow-y: scroll;
    .shopInfo{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 220rpx;
      background: #F71B5A;
      box-shadow:0 2rpx 10rpx 0 rgba(221,64,81,0.54);
      z-index: -1;
      .store_logo {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 16rpx;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .module{
      background: #FFFFFF;
      border-radius: 20rpx;
    }
    .pay {
      width: 100%;
      background: #FFFFFF;
      box-sizing: border-box;
      padding: 19rpx 0;
      border-radius: 20rpx;
      box-shadow: 0 10rpx 9rpx 0 rgba(237, 237, 237, 0.31);
      margin-bottom: 44rpx;
      position: relative;
      .cat_logo{
        width: 217rpx;
        height: 183rpx;
        position: absolute;
        top: 47rpx;
        right: 40rpx;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .cat_card{
        width: 272rpx;
        height: 204rpx;
        background: url("https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/3/aa0be092230e18a22fd38f7295eb705c.png") center center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 6rpx;
        right: 11rpx;
      }
      .store {
        width: 100%;
        box-sizing: border-box;
        padding: 0 45rpx;
        display: flex;
        align-items: center;
        margin-bottom: 31rpx;



        p {
          font-size: 32rpx;
          color: #0D0D0F;
        }
      }

      .flex {
        display: flex;
        box-sizing: border-box;
        padding: 18rpx 45rpx;
        font-size: 30rpx;

        i {
          display: block;
          color: #D2D2D2;
          margin-right: 20rpx;
        }

        .icon-wanchenggouxuan2 {
          background: #FFFFFF;
          font-size: 34rpx;
          border: 0;
          color: #D2D2D2;
        }

        .bg_FDB300 {
          color: #FDB300;
        }

        p {
          color: #0D0D0F;
          font-size: 30rpx;
        }
      }

      .box-padding {
        box-sizing: border-box;
        padding: 20rpx 20rpx 0 45rpx;
      }

      .dashed {
        border-bottom: 1px dashed #EEEEEE;
        padding-bottom: 29rpx;
      }

      .business {
        font-size: 33rpx;
        padding: 22rpx 45rpx 48rpx;
      }

      .remainMoney {
        font-size: 25rpx;
        color: #0D0D0F;
        box-sizing: border-box;
        padding: 0 45rpx 50rpx;
      }

      .inputContainer {
        width: 433rpx;
        margin-left: 16rpx;
        border-bottom: 2rpx solid #EBECEE;
        box-sizing: border-box;
        padding: 29rpx 32rpx;
        display: flex;
        font-size: 40rpx;
        align-items: flex-end;
        font-weight: bold;
        border-radius: 5rpx;

        .input {
          width: 100%;

          .placeholder {
            font-size: 40rpx;
            color: #8D8E98;
            font-weight: lighter;
          }

          span {
            font-size: 40rpx;
            font-weight: lighter;
          }
        }

        input {
          font-size: 50rpx;
          display: block;
          width: 100%;
        }

        input::placeholder {
          font-size: 40rpx;
        }
      }

      .active {
        box-shadow: 0 0 40rpx 10rpx #D4DAFA;
      }

      .payMoney {
        font-size: 30rpx;
        color: rgba(13, 13, 15, 1);
        padding: 22rpx 50rpx 65rpx;
      }

      .affirm {
        width: 669rpx;
        height: 91rpx;
        border-radius: 7rpx;
        display: block;
        background: rgba(247, 9, 77, 1);
        color: #FFFFFF;
        font-size: 41rpx;
        margin: 0 auto;
        margin-top: 50rpx;
      }

      .notice_text {
        font-size: 30rpx;
        padding: 0 22rpx;
        margin-top: 30rpx;
      }
    }

    .card {
      padding: 26rpx;
      margin-bottom: 22rpx;

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
            font-size: 28rpx;
            text-align: center;
            box-sizing: border-box;
            padding-left: 30rpx;
          }

          .flex_card {
            display: flex;
            align-items: center;
            padding-top: 0;
            padding-bottom: 0;
            font-size: 30rpx;

            i {
              font-size: 34rpx;
              padding-right: 18rpx;
            }

            span {
              background: linear-gradient(268deg, rgba(214, 146, 92, 1), rgba(214, 155, 109, 1), rgba(243, 214, 179, 1));
              color: #FFFFFF;
              font-size: 24rpx;
              margin-left: 11rpx;
              margin-right: 18rpx;
              padding-left: 0;
            }

            img {
              display: block;
              width: 30rpx;
              height: 30rpx;
            }
          }
        }

        .right {
          font-size: 30rpx;
        }
      }
    }

    .fc-F7094D {
      color: #F7094D;
    }

    .flex-box {
      display: flex;
      align-items: center;
      padding: 26rpx;
      margin-bottom: 22rpx;

      i {
        font-size: 34rpx;
        margin-right: 18rpx;
      }

      .right {
        width: 500rpx;


      }

      .mapActBtn {
        width: 150rpx;
        height: 60rpx;
        background: #F7094D;
        border-radius: 10rpx;
        font-size: 26rpx;
        color: #FFFFFF;
      }

      span {
        font-size: 28rpx;
      }
    }

    .fc-D2D2D2 {
      color: #D2D2D2;
    }

    .active-2 {
      color: #F60F51;
    }

    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 15rpx 34rpx;
      background: #FFFFFF;
      z-index: 1;
      .vipDiscount{
        width:320rpx;
        height:53rpx;
        background:#1B1B1B;
        border-radius:25rpx 25rpx 0 0;
        position: absolute;
        top: -58rpx;
        right: 29rpx;
        box-sizing: border-box;
        padding: 13rpx 23rpx;
        z-index: -1;
        img{
          display: block;
          width: 42rpx;
          height: 29rpx;
        }
      }
      .allienceDiscount{
        width: 720rpx;
        height:60rpx;
        background:#FFD76C;
        border-radius:30rpx;
        position: absolute;
        top: -73rpx;
        left: 10rpx;
      }
      .payWay {
        .payWay-item {
          .right {
            width: 30rpx;
            height: 30rpx;
            box-sizing: border-box;
            border: 2rpx solid #D2D2D2;
            border-radius: 50%;
            padding: 4rpx;
          }

          .right::before {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #D2D2D2;
          }

          .active {
            border-color: #F3B949;
          }

          .active::before {
            background: #F3B949;
          }
        }
      }

      .order {
        height: 100rpx;

        .pay_info {
          font-size: 30rpx;

          i {
            color: #F7094D;
          }
        }

        button {
          width: 206rpx;
          height: 70rpx;
          background: #F7094D;
          margin: 0;
          color: #FFFFFF;
          border-radius: 10rpx;
          letter-spacing: 4rpx;
          font-size: 32rpx;
        }
      }
    }

    .alert {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(12, 12, 12, .5);

      .remainDef {
        width: 600rpx;
        height: 436rpx;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: #FFFFFF;
        border-radius: 20rpx;
        box-sizing: border-box;
        padding: 57rpx 28rpx 0;

        .close {
          width: 55rpx;
          height: 54rpx;
          position: absolute;
          top: -79rpx;
          right: -28rpx;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .title {
          font-size: 38rpx;
          font-weight: bold;
          text-align: center;
          margin-bottom: 51rpx;
        }

        p {
          box-sizing: border-box;
          padding: 0 31rpx;
          font-size: 34rpx;
          margin-bottom: 37rpx;
          text-align: center;
        }

        .btns {
          width: 100%;
          display: flex;
          justify-content: space-between;

          button {
            display: block;
            width: 250rpx;
            height: 80rpx;
            border-radius: 10rpx;
            font-size: 36rpx;
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
