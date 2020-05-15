<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">在线购卡</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
      <router-link to="/saleCardDetail" class="icon fc-r fz16" tag="span">购卡记录</router-link>
    </header>
    <div :style="'height:'+(status_bar_height+4)+'px'"></div>
    <!---->
    <div class="bg-f mb-5 card-info fz14">
      <div class="border-buttom clearfix">
        <span class="fl-l">购卡单价</span>
        <span class="fl-r">{{unitPrice}}元/张</span>
      </div>
      <div class="border-buttom clearfix">
        <span class="fl-l">购卡类型</span>
        <div class="fl-r">
          <input type="radio" name="payway" id="payway1" :checked="cardType == 0" value="0" v-model="cardType">
          <label for="payway1" class="radio">通用卡</label>
          <input type="radio" name="payway" id="payway2" :checked="cardType == 1" value="1" v-model="cardType">
          <label for="payway2" class="radio">定制卡</label>
        </div>
      </div>
      <div class="border-buttom clearfix">
        <span class="fl-l">支付方式</span>
        <div class="fl-r">
          <input type="radio" name="paytype" id="paytype1" :checked="payType==1" value="1" v-model="payType">
          <label for="paytype1" class="radio">支付宝</label>
          <input type="radio" name="paytype" id="paytype2" :checked="payType==2" value="2" v-model="payType">
          <label for="paytype2" class="radio">微信</label>
        </div>
      </div>
      <div class="border-buttom clearfix">
        <span class="fl-l">购卡数量({{minBuyNum}}张/份)</span>
        <div class="fl-r quantity-box">
          <span class="item  disabled border-right" @click="reduceNum">-</span>
          <span class="item border-right pd-lr-10">{{num*minBuyNum}}</span>
          <span class="item" @click="addNum">+</span>
        </div>
      </div>
      <router-link to='/shopList' tag="div" class="clearfix">
        <span class="fl-l">请选择商家</span>
        <span class="fl-r">{{shopName || "&nbsp"}}<i class="right-arrow"></i></span>
      </router-link>
    </div>
    <!--收货地址-->
    <router-link
      :to="{path:'/buyCardAddresss',query:{name:name,phone:phone,address:address,shopName:shopName,shopId:shopId}}"
      tag="div" class="mb-5 fz15 address relative">
      <p class="clearfix">
        <span class="fl-l">收货人：{{name || '&nbsp'}}</span>
        <span class="fl-r">{{phone || '&nbsp'}}</span>
      </p>
      <p>收货地址：{{address || '&nbsp'}}</p>
      <i class="right-arrow"></i>
    </router-link>
    <p class="mb-5 bg-f  pd-lr-10 num fz14">共{{num*minBuyNum}}张，单价{{unitPrice}}元 订单总金额：<span class="fc-r fw-6 fz17">{{num*minBuyNum*unitPrice}}元</span>
    </p>
    <!--<div class="bg-f border-buttom pd-lr-10 material-box">
            <p class="clearfix fz15">
                <span class="fl-l">提供设计素材</span>
                <span class="fl-r fc-c fz10">共5个素材<router-link to="material" tag='i' class="ico-add" ></router-link></span>
            </p>
            <p class="fc-c fz14">如logo矢量图，主题文字，主要卖点,产品图片等</p>
        </div>-->
    <div class="pd-lr-10 clearfix sample pd-tb-5">
      <p class="fz14">助商通样卡</p>
      <img class="fl-l" src="@/assets/imgs/partnerCenter/sample1.png" width="45%"/>
      <img class="fl-r" src="@/assets/imgs/partnerCenter/sample2.png" width="45%"/>
    </div>
    <!--立即支付-->
    <div style="height: 47px;"></div>
    <button type="button" class="fc-f bg-r btn-pay" @click="testForm">立即支付</button>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getBuyCard , getBuyCardUpd} from '@/assets/js/getData'
  import {getStore} from "@/assets/js/deal";
  import {postColor , postOrder} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        num: 1, //购卡的分量
        minBuyNum: 0, //最小购卡数
        unitPrice: 0, //售卡单价
        payway: 0, //默认支付方式
        name: this.$route.query.name, //收货人姓名
        phone: this.$route.query.phone, //收货人电话
        address: this.$route.query.address, //收货人地址
        timerState: false, //订单提交状态
        orderNum: '', //订单编号
        cardType: 0, //0通用，1定制
        payType: 1, //1支付宝，2微信
        shopName: this.$route.query.shopName,//所选择的商家名称
        shopId: this.$route.query.id, //商家id
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.push({path: '/partnerCenter'});
        // this.$router.go(-1);//返回上一层
      },
      //提交购卡订单
      getBuyCard() {
        let _self = this;
        let _totalMoney = _self.num * _self.minBuyNum * _self.unitPrice;
        let _cardCount = _self.num * _self.minBuyNum;
        let _time = Date.parse(new Date());
        let _data = {
          token: _self.token,
          totalMoney: _totalMoney, //订单总金额
          payType: _self.payType, //付款方式:1支付宝 2微信 3个人招商银行 4对公账户5pos机 6现金 4-1,5-2',
          createtime: _time / 1000, //购买时间戳
          cardCount: _cardCount, //购卡总数量
          unitPrice: _self.unitPrice, //卡单价
          cardType: _self.cardType,
          receiptPerson: _self.name, //收货人
          receiptPhone: _self.phone,  //收货人号码
          receiptAddress: _self.address, //收货人地址
          remark: '', //订单备注
          shopId: _self.shopId, //商家id
        }
        _self.$getSignIn(_data).then(sec => {
          getBuyCard(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              //提交订单成功，提醒app支付
              _self.timerState = true;
              _self.orderNum = _data.data;
              let _json = {
                orderNum: _data.data,
                payWay: _self.payType, //支付方式,1支付宝，2微信
                packagePrice: _totalMoney, //价格
                //packagePrice : 0.01 , //价格
              }
              postOrder(_json).then(state => {
                if(state == 1){
                  _self.$router.push({path: '/partnerCenter'});
                }
              });
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //点击立即支付时验证是否符合验证要求
      testForm() {
        let _self = this;
        if (_self.shopId) {
          _self.getBuyCard();
        } else {
          _self.toast('请选择商家');
        }
      },
      //增加购卡数量
      addNum() {
        this.num++;
      },
      //减少购卡数
      reduceNum() {
        this.num > 1 ? this.num-- : this.num = 1;
      },
      //修改订单状态
      getBuyCardUpd() {
        let _self = this;
        let _data = {
          token: _self.token,
          orderNum: _self.orderNum, // 订单编号
          payType: _self.payType //1支付宝支付，2微信支付
        };
        _self.$getSignIn(_data).then(sec => {
          getBuyCardUpd(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              //修改订单状态成功，跳转购卡记录页面
              _self.$router.push({path: '/saleCardDetail'});
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      }
    },
    created: function () {
      let _self = this;
      _self.timerState = false;
      _self.unitPrice = getStore('buyUnitPrice');// 购卡单价存入
      _self.minBuyNum = getStore('buyNumber'); //
    },
    mounted() {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
      });
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    },
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .icon {
    line-height: 45px;
  }

  .card-info {
    line-height: 60px;
  }

  .card-info > div {
    padding: 0 10px;
  }

  .num {
    text-align: right;
    line-height: 60px;
  }

  .btn-pay {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 47px;
    font-size: 18px;
  }

  .address {
    padding: 15px 22px 15px 36px;
    background: #fff url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAuCAMAAAB6WzuLAAAASFBMVEUAAAD/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phr/phqUr5/wAAAAF3RSTlMA8uEJcMMUTNC2o5mOYkEtNyeDV656HlVZoh4AAAEMSURBVDjLhdPrsoIwDATgTVsuitxE2fd/0zMDZ9qU0Pr9zqxNVqDt3Xf4fIZvt+OWDw2jJngYo2NGAnJtQ6NfoUzCG9IhWlgQZ1YWLTg5FgkOb1YMxzKsWgEMzIgw8wC8ZPeavV+Do9KiY9K0OPgHkxEvRg5Rz+gJdfkJ0ax6gMtDbIxAVKIy3I68oLzViNMXSJ5qpLn0YXrrdUMB0aZbWvI+Tq0w6nQkZcOhk/zvELLSxmUZPzylPYU1LVJMYkLqMR74EfNOdypwpnpjMo0ktjUvpYWTiTc2ZJ6VnyluJR4Xs93GCObyVkOlxy1nHmLM5iHWyH9fFL3MR1d4skONd6S0qNrJGT9sIy7+APyJTxmvhBShAAAAAElFTkSuQmCC) no-repeat left 10px center;
    background-size: 17px auto;
  }

  .address .right-arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -7px;
  }

  .address p {
    padding: 5px 0;
  }

  .material-box {
    padding: 10px;
    line-height: 2;
  }

  .ico-add {
    display: inline-block;
    width: 40px;
    height: 18px;
    vertical-align: middle;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAlBAMAAAAn0HPsAAAALVBMVEUAAADh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ovh5Ov////v8fRIESchAAAADHRSTlMA8o6e4bymWUwrGQmBSmZPAAAAvklEQVQ4y42UKw7CUBBFb1LR4FFQi6uoReKr0KyAVHQfIEhYAQaPw7YpDWKWQNkBe0C8Epp+z9Enk7w3d64c99XGeplvD2pwDmyQbP33rjbKXjV+MC5mqRyhTZA7z7NJot9ANNI3QCrpQsSFpISIpTSzDtXbOpzkMTHSjYlLHZn4VMjEXDsmPhQzsVArOZ+q5tVKkIyJxifGTCzwq/E/4s3gXeP08DwqIWKJbwZfIb1r3BS0e3ib8X7kjYs7/AuJVyP5JAsrnwAAAABJRU5ErkJggg==) no-repeat center;
    background-size: cover;
    margin-left: 10px;
  }

  .sample {
    line-height: 42px;
  }

  /*购买数量*/
  .quantity-box {
    border: 1px solid #9aa4c1;
    height: 24px;
    border-radius: 3px;
    line-height: 24px;
    margin-top: 18px;
  }

  .quantity-box .item {
    display: inline-block;
    min-width: 24px;
    text-align: center;
    height: 24px;
  }

  input[type="radio"]:checked + label {
    color: #0D0D0D;
  }

  .disabled {

  }
</style>
