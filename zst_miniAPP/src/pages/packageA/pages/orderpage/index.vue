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
        <img :src="imgUrl" alt="">
      </div>
      <div class="order_me_ri">
        <div class="order_me_top">
          {{na}} {{selType}}
        </div>
        <div class="order_me_bot">
          <span>￥{{price}}</span>
          <span style="float: right;">x{{number}}</span>
        </div>
      </div>
    </div>
    <div class="or_detail">
      <!-- 微信 包邮 ￥2999*1 -400 共一件商品 总额：￥2599 -->
      <div class="or_de_bot">
        <div class="or_de_le">支付类型</div>
        <div class="or_de_ri">微信</div>
      </div>
      <div class="or_de_bot">
        <div class="or_de_le">运费</div>
        <div class="or_de_ri">{{freightPrice==0?'免邮':freightPrice}}</div>
      </div>
      <div class="or_de_bot">
        <div class="or_de_le">商品金额</div>
        <div class="or_de_ri">{{ price }}*{{number}}</div>
      </div>
      <div class="or_de_bot">
        <div class="or_de_le">话呗抵扣</div>
        <div class="or_de_ri">-{{descPrice}}</div>
      </div>
      <div class="or_de_bot">
        <div class="or_de_le">总额</div>
        <div class="or_de_ri">共{{number}}件商品 总额：<span>￥{{allPrice}}</span></div>
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
      }
    },
    mounted(){
      // 地址参数处理
      var par = getQuery();
      if(JSON.stringify(par)  != '{}') {
        this.showAdd = false;
        this.consignee = par.consignee;
        this.phone = par.phone;
        this.regionInfo = par.regionInfo;
        this.detailAddress = par.detailAddress;
        this.id = par.detailAddress;
        this.areaCode = par.areaCode;
      }else{
        this.getaddress();
        this.showAdd = true;
      }
      //订单数据处理
      const host = this.$store.state;
      this.goodsId = host.goodsId;
      this.selType = host.selType;
      this.price = host.price;
      this.descPrice = host.descPrice;
      this.number = host.number;
      this.freightPrice = host.freightPrice;
      this.imgUrl = host.imgUrl;
      this.na = host.name;
      var allM = this.$store.state.totalMoney;
      //现价
      var singlePrice = this.$store.state.singlePrice;
      /**
       * 如果话呗足够一件的自然会有抵扣  如果不够抵扣为0
       * 如果全部够的话
       * **/
      if(allM >= this.descPrice){
        if(allM>=this.descPrice*this.number){
          // this.allPrice =  (this.price - this.descPrice) * this.number;   //现在将所有的加减变成现价
          this.allPrice =  singlePrice * this.number;   //现在将所有的加减变成现价
          this.descPrice = this.descPrice * this.number;
        }else{
          var  mmm = Math.floor(allM/this.number);  //就够这么多件的
          var nnn = singlePrice * mmm; //这是那几件有抵扣的钱  其他的按照原价
          var ccc = this.price * (this.number - mmm); //这是那几件原价购买的钱
          this.allPrice = nnn +ccc;
          this.descPrice = this.descPrice * mmm;
        }
      }else{
        this.allPrice = this.price * this.number;
        this.descPrice = 0;
      }
      //分割线
      this.shopId = host.shopId;
    },
    methods:{
      getaddress(){
        var _this = this;
        var _data = {
          token:this.$store.state.token
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getaddress(_data,sec).then(res=>{
            if(res.state==1 && res.data[0].isDefault == 1){
              let par = res.data[0];
              this.consignee = par.consignee;
              this.phone = par.phone;
              this.regionInfo = par.regionInfo;
              this.detailAddress = par.detailAddress;
              this.id = par.detailAddress;
              this.areaCode = par.areaCode;
              this.showAdd = false;
            }else{
              this.showAdd = true;
            }
          })
        })
      },
      goMyAddress(){
        const url = '../myaddress/main';
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
          arr = this.$store.state.selType;
          var par = this.getTextByJs(arr);
          var phone = this.phone;
          var ot = phone.replace(/(^\s*)|(\s*$)/g, "");
          var goodName = this.$store.state.name.replace(/\+/g, ' ');
          var specParamsName = par.replace(/\+/g, ' ');
          var _data = {
            token:this.$store.state.token,
            receiverName:this.consignee,
            receiverPhone:ot,
            receiverAddress:`${this.regionInfo} ${this.detailAddress}`,
            goodsCount:this.number,
            shopId:this.shopId,
            receiverCityId:this.areaCode,
            freight:this.freightPrice ,
            goodsTotalPrice: this.allPrice ,
            orderTotalPrice: this.freightPrice + this.allPrice ,   //实际付的钱
            goodsId:this.$store.state.goodsId,
            goodsItemNO:this.$store.state.goodsItemNO,
            goodsName: goodName ,
            singlePrice: this.$store.state.singlePrice ,
            costPrice:this.$store.state.costPrice,
            orderRemark:'',
            usedIntegralCount:this.descPrice,   //优惠了多少钱
            usedThirdPayment:this.allPrice,
            specParamsIds:this.$store.state.spacPaeam,
            isBuyLimited:this.$store.state.isBuyLimited,
            specParamsName:specParamsName,
            payWay:'2',
            originalPrice:this.$store.state.price,   //原价
            tradeType:'JSAPI',
            openid:this.$store.state.openId,
            maxBuyNum:this.$store.state.maxBuyNum,
            appid:'wx5e11922e81e3951d',
            shareUserId:this.$store.state.shareUserId ? this.$store.state.shareUserId:'',
            shareUsername:this.$store.state.shareUsername ? this.$store.state.shareUsername:'',
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
      .order_me_top{
        margin-bottom:34rpx;
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
