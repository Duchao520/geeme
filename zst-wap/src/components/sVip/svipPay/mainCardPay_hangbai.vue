<template>
  <div class="index" @click="isShowKeyboard(0); type = 0">
    <toast ref="toast" :tip="tip"></toast>
    <div class="pay">
      <div class="store">
        <div class="store_logo">
          <img :src="shopDetail.supplierLogo" alt="">
        </div>
        <p>{{shopDetail.shopName}}</p>
      </div>
      <div class="inputContainer" :class="{active: type == 1}">
        <div class="input flex_box align_center"><span v-if="totalMoney">{{totalMoney}}</span><i class="focus" :class="{'bg-F60F51': focusFlag1}"></i><span
          class="placeholder" v-if="!totalMoney">输入本次需要支付金额</span></div>
      </div>
      <div class="flex">
        <i class="iconfont icon-huiyishiqueren_huabanfuben" :class="{'bg_FDB300': discountInput}"
           @click.stop="discountInput = !discountInput"></i>
        <p>不参与打折金额</p>
      </div>
      <div class="inputContainer" v-show="discountInput" :class="{active: type == 2}">
        <div class="input flex_box align_center">
          <span v-if="notDisMoney">{{notDisMoney}}</span>
          <i class="focus" :class="{'bg-F60F51': focusFlag2}"></i>
          <span class="placeholder" v-if="!notDisMoney">输入不参与折扣的金额</span></div>
      </div>
    </div>

    <div class="pay card box_padding">
      <div class="justify_content box-padding">
        <p>卡主:{{cardDetail.realName}}</p>
        <p>卡主余额:{{cardDetail.money ? accDiv(cardDetail.money,100) : 0}}元</p>
        <p>折扣:{{(discountRate*10).toFixed(1)}}折</p>
      </div>
    </div>

    <footer>
      <div class="order flex_box align_center justify_space_between">
        <div class="pay_info"><i>已优惠{{discount ? accDiv(discount,100) : 0}}元,</i>实需支付:{{actPay ? accDiv(actPay,100) : 0}}元</div>
        <button @click="isSubmit">立即支付</button>
      </div>
    </footer>

    <keyboard-num @keyDownEvent="keydown" @backSpaceEvent="backSpace" @closeKeyboardEvent="" ref="keyboard"></keyboard-num>


    <transition name="alertMsg">
      <div class="alert" v-show="remainDef || success">
        <div class="remainDef" v-if="remainDef">
          <div class="close" @click.stop="close">
            <img src="@/assets/imgs/common/close.png" alt="">
          </div>
          <div class="title">余额不足</div>
          <p>
            卡主余额不足,可在线下门店充值后享受优惠
          </p>
          <div class="btns">
            <button @click.stop="qrShow">续费</button>
            <button @click.stop="originalPay">原价支付</button>
          </div>
        </div>
        <div class="success" v-if="success">
          <div class="close" @click.stop="close">
            <img src="@/assets/imgs/common/close.png" alt="">
          </div>
          <div class="title">支付成功</div>
          <div class="order-item">支付方式：会员卡消费</div>
          <div class="order-item">SVIP卡余额：{{accDiv(cardDetail.money,100)}}元</div>
          <button @click.stop="close">关闭</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import toast from '@/components/common/toast';
  import keyboardNum from '@/components/common/keyboardNum';
  import {postTitle} from "@/assets/js/jsBridge";
  import {accDiv , accMul , accAdd , Subtr} from "@/assets/js/deal";
  import {secondCard, cardeDetail, mainCardPay} from "@/assets/js/comm";
  import {request, chineseFromUtf8Url, getSignIn, callAppMethod} from "@/assets/js/jsBridge";
  import {WBT} from "@/assets/js/socket";

  export default {
    name: "index",
    props: ['tokenPromise'],
    components: {
      toast,
      keyboardNum
    },
    data() {
      return {
        focusFlag1: false,
        focusFlag2: false,
        focusTimer: '',
        remainDef: false,
        success: false,
        discountInput: false,
        shopStoreId: '',
        shareCardId: '',
        cardDetail: '',
        token: '',
        shopDetail: '',
        tip: '',
        actPay: 0,            //实际支付金额
        totalMoney: '',        //总金额
        discount: '',         //优惠金额
        discountRate: '',     //折扣率
        disMoney: '',
        notDisMoney: '',      //不参与折扣金额
        type: '',
        refStoreId: this.$route.query.refStoreId,
        no: this.$route.query.no
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
      close() {
        var _self = this;
        _self.remainDef = false;
        _self.success = false;
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
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      init() {
        var _self = this;
        _self.urlStringInit();
        _self.getCardDetail();
        _self.concatHB();
      },
      urlStringInit() {
        var _self = this;
        _self.shopStoreId = _self.$route.query.shopStoreId;
        _self.shareCardId = _self.$route.query.shareCardId;
        _self.distance = _self.$route.query.distance;
        _self.attach = JSON.parse(decodeURIComponent(_self.$route.query.attach));
        _self.maincardId = _self.attach.mainCardId;
      },
      isSubmit() {
        var _self = this;
        _self.isShowKeyboard(0);
        if(Number(_self.totalMoney) < Number(_self.notDisMoney)){
          _self.toast("订单总金额请勿小于不参与折扣金额");
        }else if (_self.totalMoney) {
          _self.orderSubmit();
        } else if (isNaN(_self.totalMoney)) {
          _self.tip = '请输入正确金额';
          _self.$refs.toast.toast();
        } else {
          _self.tip = '请输入付费金额';
          _self.$refs.toast.toast();
        }
      },
      keydown(num){
        var _self = this;
        var regx =/^(([0-9][0-9]{0,9}[.])|([0-9][0-9]{0,9}[.][0-9]{1,2})|([0-9][0-9]{0,9})|([0][.][0-9]{1}[1-9]{1}))$/;
        /*总金额键盘输入*/
        if(_self.type == 1){
          var testData1 = _self.totalMoney + num;
          if(regx.test(testData1)){
            _self.totalMoney = testData1;
          }
        }
        /*不参与折扣金额键盘输入*/
        else if(_self.type == 2){
          var testData2 = _self.notDisMoney + num;
          if(regx.test(testData2)){
            _self.notDisMoney = testData2;
          }
        }
      },
      /**
       * 回车事件
       * */
      backSpace(){
        var _self = this;
        if(_self.type == 1){
          _self.totalMoney = _self.totalMoney.slice(0,-1);
        }
        else if(_self.type == 2){
          _self.notDisMoney = _self.notDisMoney.slice(0,-1);
        }
      },
      isShowKeyboard(status){
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
      stopActiveEvent(type){
        var _self = this;
        _self.type = type;
        _self.focus();
        _self.isShowKeyboard(1);
      },
      /**
       * 订单提交
       * */
      orderSubmit() {
        var _self = this;
        var _data = {
          token: _self.token,
          maincardId: String(_self.maincardId),
          totalMoney: String(accMul(_self.totalMoney , 100)),
          shouldMoney: String(Number(_self.actPay)),
          no: String(_self.no)
        };
        _self.$emit('showLoad',1);
        getSignIn(_data).then(sec => {
          mainCardPay(_data, sec).then(res => {
            _self.$emit('showLoad',0);
            if (res.data.state == 900255) {
              _self.close();
              setTimeout(() => {
                _self.remainDef = true;
              }, 200)
            } else if (res.data.state == 1) {
              _self.close();
              /*res.data.data ? _self.cardDetail =  res.data.data : _self.init();
              _self.totalMoney = '';
              _self.notDisMoney = '';
              _self.actPay = '';*/
              var date = new Date();
              let Y,M, D, h, m, s;
              Y = date.getFullYear();
              M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
              D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate() );
              h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours() );
              m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes() );
              s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds() );
              var orderTime = '' + Y + M + D + h + m + s;
              _self.$router.push({
                name: 'pay_success',
                query: {
                  shopStoreId: _self.shopStoreId,
                  totalAmount: String(_self._self.totalMoney),
                  amount: String(accDiv(Number(_self.actPay),100)),
                  notDisMoney: String(_self.notDisMoney),
                  payWay: 3,
                  orderTime: orderTime,
                  discount: String(accDiv(Number(_self.discount),100)),
                  discountType: 1
                }
              });
              /*setTimeout(() => {
                _self.success = true;
              }, 200)*/
            }else {
              _self.toast(res.data.msg);
            }
          }).catch(error => {
            _self.$emit('showLoad',0);
          })
        })
      },
      originalPay() {
        var _self = this;
        _self.$router.push({
          name: 'svipPayPay',
          query: {
            cardType: 1,
            isOriginPricePay: 1,
            maincardId: _self.maincardId,
            actPay: accMul(_self.totalMoney , 100),
            totalMoney: accMul(_self.totalMoney , 100),
          }
        })
      },
      /**
       * 获取卡门店详情
       **/
      getCardDetail() {
        var _self = this;
        var _data = {
          maincardId: String(_self.maincardId),
          token: _self.token,
        };
        getSignIn(_data).then(sec => {
          cardeDetail(_data, sec).then(res => {
            if (res.data.state == 1) {
              _self.shopDetail = res.data.data.shop;
              _self.cardDetail = res.data.data.card;
              _self.discountRate = res.data.data.card.discountRate;
            }else{
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      qrShow() {
        callAppMethod('14');
      },
      calMoney(){
        var _self = this;
        _self.disMoney = Subtr(_self.totalMoney,_self.notDisMoney);       //计算参与折扣金额
        _self.actPay = Math.ceil(accAdd(accMul(accMul(_self.disMoney,_self.discountRate),100),accMul(_self.notDisMoney,100)));
        _self.discount = Subtr(accMul(_self.totalMoney,100),_self.actPay);
      },

      /**
       * 连接航佰websocket
       */
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
              "th":_self.no
            };
            _self.WB.send(getorder_data);
          }
        })
      },

      /**
       * 获取航佰账单回调
       */
      returnorder(e){
        var _self = this;
        if(e.errcode == 0){
          var notDisMoney=0;
          var totalMoney = 0;
          e.cpinfo.forEach(ele => {
            if(ele.kz == '1'){
              notDisMoney += accMul(Number(ele.hyj),Number(ele.sl));
              totalMoney += accMul(Number(ele.hyj),Number(ele.sl))
            }else{
              totalMoney += accMul(Number(ele.dj),Number(ele.sl));
            }
          });
          _self.totalMoney = totalMoney;   //订单总金额
          _self.notDisMoney = Subtr(Number(_self.totalMoney),Number(notDisMoney));   //不参与折扣金额
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
    },
    watch: {
      totalMoney() {
        var _self = this;
        _self.calMoney();
      },
      notDisMoney() {
        var _self = this;
        if(Number(_self.notDisMoney > Number(_self.totalMoney))){
          _self.toast('订单总金额请勿小于不参与折扣金额');
          _self.notDisMoney = _self.notDisMoney.slice(0,-1)
        }
        _self.calMoney();
      },
      discountInput() {
        var _self = this;
        if(!_self.discountInput){
          _self.notDisMoney = '';
        }
      }
    },
    mounted() {
      var _self = this;
      callAppMethod('20');
      postTitle('在线支付');
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
      })
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
    background: #F1F1F1;
    box-sizing: border-box;
    padding: .28rem .15rem;

    .pay {
      width: 100%;
      background: #FFFFFF;
      margin-bottom: .24rem;
      border-radius: .1rem;
      box-sizing: border-box;
      padding: .19rem 0;
      .store{
        width: 100%;
        box-sizing: border-box;
        padding: 0 .45rem;
        display: flex;
        align-items: center;
        margin-bottom: .31rem;
        .store_logo{
          width: .8rem;
          height: .8rem;
          border-radius: 50%;
          overflow: hidden;
          margin-right: .16rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        p{
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
        .input{
          width: 100%;
          .placeholder{
            font-size: .4rem;
            color: #8D8E98;
            font-weight: lighter;
          }
          span{
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
      .active{
        box-shadow: 0 0 .4rem .1rem #D4DAFA;
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

    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: .15rem .34rem;
      background: #FFFFFF;
      .payWay{
        .payWay-item{
          .right {
            width: .3rem;
            height: .3rem;
            box-sizing: border-box;
            border: .02rem solid #D2D2D2;
            border-radius: 50%;
            padding: .04rem;
          }
          .right::before{
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #D2D2D2;
          }
          .active{
            border-color: #F3B949;
          }
          .active::before{
            background: #F3B949;
          }
        }
      }

      .order{
        height: 1rem;
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
          cursor: pointer;
        }
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
        padding: .88rem .28rem 0;

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

      .success {
        width: 6rem;
        height: 5.14rem;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: #FFFFFF;
        border-radius: .2rem;
        box-sizing: border-box;
        padding: .88rem .28rem 0;

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

        .order-item {
          font-size: .34rem;
          padding-left: .31rem;
        }

        button {
          display: block;
          width: 4rem;
          height: .8rem;
          background: #F7094D;
          color: #FFFFFF;
          font-size: .36rem;
          border-radius: .1rem;
          margin: 1.04rem auto 0;
        }
      }

    }
  }
</style>
