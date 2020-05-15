<template>
  <div class="page">
    <div class="accpt_address">
      <div class="acc_add_le">
        <i class="iconfont icon-dizhi_"></i>
      </div>
      <div class="acc_add_mid" v-if="showAdd" @click="goMyAddress">
        <div style="color:#9A9DA5;">请选择收货地址</div>
      </div>
      <div class="acc_add_mid" v-if="!showAdd" @click="goMyAddress">
        <div>收货人：{{consignee}}  {{phone}} </div>
        <div>收货地址：{{regionInfo}} {{detailAddress}}</div>
      </div>
      <div class="acc_add_ri">
        <i class="iconfont icon-youjiantou"></i>
      </div>
    </div>
    <div class="order_mes">
      <div class="order_me_le">
        <img :src="dataDetail.imgUrl" alt="">
      </div>
      <div class="order_me_ri">
        <div class="order_me_top">
          {{dataDetail.goodsName}}
        </div>
        <div class="order_me_top" style="font-size: 24rpx;">
          型号：{{dataDetail.specParamsName}}
        </div>
        <div class="order_me_bot">
          <span>￥{{dataDetail.originalPrice}}</span>
          <span style="float: right;">x{{dataDetail.goodsCount}}</span>
        </div>
      </div>
    </div>
    <div class="or_detail">
      <!-- 微信 包邮 ￥2999*1 -400 共一件商品 总额：￥2599 -->
      <div class="or_de_bot">
        <div class="or_de_le">支付类型</div>
        <div class="or_de_ri">微信</div>
      </div>
      <!--<div class="or_de_bot">-->
      <!--<div class="or_de_le">运费</div>-->
      <!--<div class="or_de_ri">{{freightPrice==0?'免邮':freightPrice}}</div>-->
      <!--</div>-->
      <div class="or_de_bot">
        <div class="or_de_le">商品金额</div>
        <div class="or_de_ri">+￥{{dataDetail.originalPrice}}</div>
      </div>
      <div class="or_de_bot">
        <div class="or_de_le">实付款</div>
        <div class="or_de_ri">共{{dataDetail.goodsCount}}件商品 总额：<span>￥{{zstGoodsFreeDrawShouldpayMoney}}</span></div>
      </div>
    </div>

    <div class="footer_btn">
      <div class="fot_le"></div>
      <div class="fot_ri" @click="go_buy">立即购买</div>
    </div>
  </div>
</template>

<script>
    import { getQuery , getSignIn } from '@/common/js/comm'
    import Tips  from '@/common/js/tips'
    import floatTo from '@/common/js/floatTo'
    import { mapMutations } from 'vuex'
    import { GOODSTYPE }  from '@/store/mutation-types'

    export default {
        name: "index",
        data(){
            return {
                na:'',
                allPrice:'',
                goodsId: '',
                selType:'',
                price:'',
                descPrice: '',
                number:'',
                freightPrice:'',
                imgUrl:'',
                showAdd:true,
                consignee:'',
                phone:'',
                regionInfo:'',
                detailAddress:'',
                id:'',
                areaCode:'',
                totalMoney:'',   //话呗余额
                orderNum:'',
                dataDetail:'',
                receiptId:'',
                zstGoodsFreeDrawShouldpayMoney:'',
            }
        },
        mounted(){
            // 地址参数处理
            var par = getQuery();
            this.orderNum = par.orderNum;
            if(JSON.stringify(par)  != '{}') {
              console.log(par);
              this.showAdd = false;
              this.consignee = par.consignee;
              this.phone = par.phone;
              this.regionInfo = par.regionInfo;
              this.detailAddress = par.detailAddress;
              this.id = par.id;
              this.receiptId = par.id;
              this.areaCode = par.areaCode;
              this.getaddress(1);
            }else{
              this.getaddress();
              this.showAdd = true;
            }
        },
        methods:{
            ...mapMutations({
                goodsType:'GOODSTYPE'
            }),
            getaddress(par){
                var _this = this;
                var _data = {
                    token:_this.$store.state.token,
                    // token:'0bcb3f032cbf48e285d59ade85e1dc67',
                    orderNum:_this.$store.state.orderNum,
                }
                getSignIn(_data).then(sec=>{
                    _this.$http.getOrderDetail(_data,sec).then(res=>{
                        if(res.state==1 && res.receiptAddress[0].isDefault == 1){
                            if(par!=1) {
                                let par = res.receiptAddress[0];
                                _this.receiptId = res.receiptAddress[0].id;
                                _this.consignee = par.consignee;
                                _this.phone = par.phone;
                                _this.regionInfo = par.regionInfo;
                                _this.detailAddress = par.detailAddress;
                                _this.id = par.detailAddress;
                                _this.areaCode = par.areaCode;
                                _this.showAdd = false;
                            }
                            _this.dataDetail = res.data;
                            _this.zstGoodsFreeDrawShouldpayMoney = res.zstGoodsFreeDrawShouldpayMoney;
                        }else{
                            if(_this.detailAddress!='') {
                                _this.dataDetail = res.data;
                                _this.zstGoodsFreeDrawShouldpayMoney = res.zstGoodsFreeDrawShouldpayMoney;
                                this.showAdd = false;
                            }else{
                                _this.dataDetail = res.data;
                                _this.zstGoodsFreeDrawShouldpayMoney = res.zstGoodsFreeDrawShouldpayMoney;
                                this.showAdd = true;
                            }

                        }
                    })
                })
            },
            goMyAddress(){
                const url = `../myaddress/main?frompage=payLottery&orderNum=${this.orderNum}`;
                wx.redirectTo({ url });
            },
            getTextByJs(arr) {
                var str = "";
                for (var i = 0; i < arr.length; i++) {
                    str += arr[i]+ "|";
                }
                if (str.length > 0) {
                    str = str.substr(0, str.length - 1);
                }
                return str;
            },
            getNonceStr(len) {
                len = len || 32
                var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
                var maxPos = $chars.length
                var str = ''
                for (var i = 0; i < len; i++) {
                    str += $chars.charAt(Math.floor(Math.random() * maxPos))
                }
                return str
            },
            go_buy(){
                var _this = this;
                if(this.showAdd == false) {
                    //ok  开始买东西了
                    var arr= [];
                    var DM = this.dataDetail;
                    var phone = DM.receiverPhone;
                    var ot = phone.replace(/(^\s*)|(\s*$)/g, "");
                    var goodName = DM.goodsName.replace(/\+/g, ' ');
                    var specParamsName = DM.specParamsName.replace(/\+/g, ' ');
                    this.goodsType(DM.goodsType);
                    var _data = {
                        token:this.$store.state.token,
                        receiverName:DM.receiverName,
                        receiverPhone:ot,
                        receiverAddress:DM.receiverAddress,
                        goodsCount:DM.goodsCount,
                        shopId:DM.shopId,
                        receiverCityId:_this.receiptId,
                        freight:DM.freight ,
                        goodsTotalPrice: DM.goodsTotalPrice ,
                        orderTotalPrice: _this.zstGoodsFreeDrawShouldpayMoney,   //实际付的钱
                        goodsId:DM.goodsId,
                        goodsItemNO:DM.goodsItemNO,
                        goodsName: goodName ,
                        singlePrice: DM.singlePrice ,
                        costPrice:DM.costPrice,
                        orderRemark:'',
                        usedIntegralCount:DM.usedIntegralCount,   //优惠了多少钱
                        usedThirdPayment:DM.usedThirdPayment,
                        specParamsIds:DM.specParamsIds,
                        isBuyLimited:DM.isBuyLimited,
                        specParamsName:specParamsName,
                        payWay:'2',
                        originalPrice:DM.originalPrice,   //原价
                        tradeType:'JSAPI',
                        openid:this.$store.state.openId,
                        maxBuyNum:DM.maxBuyNum,
                        appid:'wx5e11922e81e3951d',
                        orderSource:2,
                    }
                    getSignIn({"data":JSON.stringify(_data)}).then(sec=> {
                        _this.$http.postOrder("data=" + encodeURI(JSON.stringify(_data)), sec).then(res => {
                            //这里是提示信息
                            if (res.state == 1) {
                                var payObj = {
                                    timeStamp: res.data.apiSigntype,
                                    nonceStr: res.data.apiNoncestr,
                                    package: res.data.apiPackage,
                                    signType: res.data.apiSigntype,
                                    paySign: res.data.apiPaysign,
                                }
                                wx.requestPayment({
                                    timeStamp: res.data.apiTimestamp,
                                    nonceStr: res.data.apiNoncestr,
                                    package: res.data.apiPackage,
                                    signType: res.data.apiSigntype,
                                    paySign: res.data.apiPaysign,
                                    success: function (rescc) {
                                        Tips.toast(`付款成功`, 'none');
                                        wx.navigateTo({
                                            url: `/pages/packageA/pages/orderSuc/main?selOrderNo=${res.data.selOrderNo}&orderTotalPrice=${_data.orderTotalPrice}&usedIntegralCount=${_data.usedIntegralCount}&originalPrice=${_data.originalPrice}`
                                        })
                                    },
                                    fail: function (rescc) {
                                        console.log(rescc)
                                    },
                                    complete: function (res) {

                                    }
                                })
                            }else{
                                Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                            }
                        })
                    })
                }else{
                    Tips.toast('请选择你的地址','none');
                    return false;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;
    background:#f6f6f6;
    overflow: hidden;
  }
  .accpt_address{
    width:100%;
    /*height:186rpx;*/
    background:#fff;
    margin-bottom:10rpx;
    padding:10rpx 0;
    @include jcsa;
    .acc_add_le{
      i{
        font-size: 40rpx;
      }
    }
    .acc_add_mid{
      width:564rpx;
      /*height:124rpx;*/
    }
    .acc_add_ri{

    }
  }
  .order_mes{
    width:710rpx;
    margin-bottom:10rpx;
    background:#fff;
    overflow: hidden;
    //@include jcsa();
    padding:24rpx 20rpx;
    .order_me_le{
      overflow: hidden;
      @include inwh(160rpx , 160rpx);
      border-right:1px solid $backColor;
      margin-right:22rpx;
      float: left;
      /*margin-top:23rpx;*/
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .order_me_ri{
      overflow: hidden;
      .order_me_top{
        margin-bottom:34rpx;
        font-size:30rpx;
      }
    }
    .order_me_bot{
      span{
        color:$iconColor;
      }
    }
  }
  .or_detail{
    width:94%;
    padding:0 3%;
    background:#fff;
    .or_de_bot{
      width:100%;
      height:84rpx;
      border-bottom:2rpx solid $backColor;
      font-size: 28rpx;
      @include jcsb;
      .or_de_ri{
        span{
          color:$iconColor;
          font-weight: 700;
        }
      }
    }
  }
  .footer_btn{
    @include poFix(0,0);
    width:100%;
    @include jcsb;
    height:104rpx;
    z-index:999;
    .fot_le{
      flex:1;
      height:100%;
      background:$btnle;
      @include jcc;
      color:#fff;
    }
    .fot_ri{
      height:100%;
      flex: 1;
      background:$btnri;
      @include jcc;
      color:#fff;
    }
  }
</style>
