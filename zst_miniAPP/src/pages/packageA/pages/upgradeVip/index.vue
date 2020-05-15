<template>
  <div class="index">
    <div class="banner">
      <img src="http://zst-test.tenzhao.com:10087/zst-wap/vipRecharge/static/img/banner.88afafa.png" alt="">
      <div class="marquee">
        <!--<my-marquee :lists="lists"></my-marquee>-->
      </div>
    </div>
    <div class="title">
      <i></i>
      <span>您将获得以下权限</span>
      <i></i>
    </div>
    <div class="card">
      <div class="first">
        <div class="card-item">
          <i>
            <img src="../../static/img/huabei.png" alt="">
          </i>
          <div class="right">
            <p>获得2000话呗</p>
            <span>话呗可打电话和购物抵扣</span>
          </div>
        </div>
        <div class="card-item">
          <i>
            <img src="../../static/img/award.png" alt="">
          </i>
          <div class="right">
            <p>免费抽大奖</p>
            <span>每天一次抽奖机会,精彩大奖等你来拿</span>
          </div>
        </div>
      </div>
      <div class="second">
        <div class="card-item">
          <i>
            <img src="../../static/img/qrCode.png" alt="">
          </i>
          <div class="right">
            <p>获得推广码推广新人资格</p>
            <span>推广新人升级成为VIP最高可获得40元/人奖金</span>
            <span>推广新人线上购物最高可获得30%购物奖金</span>
          </div>
        </div>
      </div>
      <div class="first">
        <div class="card-item">
          <i>
            <img src="../../static/img/shopPer.png" alt="">
          </i>
          <div class="right">
            <p>获得购买资格</p>
            <span>获得助商通话呗对换区VIP特价商品购买资格</span>
          </div>
        </div>
        <div class="card-item">
          <i>
            <img src="../../static/img/travel.png" alt="">
          </i>
          <div class="right">
            <p>免费游</p>
            <span>获得全国10000+家景点免费游资格</span>
          </div>
        </div>
      </div>
      <div class="second">
        <div class="card-item">
          <i>
            <img src="../../static/img/circle-1.png" alt="">
          </i>
          <div class="right">
            <p>属于自己的招商代理产品秀</p>
            <span>免费赠送5个产品位</span>
            <span>获得精准的客户、代理或合作资源,越早发布曝光越大</span>
          </div>
        </div>
      </div>
    </div>
    <div class="pay">
      <div class="pay-item">
        <div class="left">
          <div class="desc"><img src="../../static/img/shopCar.png" alt="" style="width: 39rpx">购买方式<span>付费购买</span></div>
        </div>
        <div class="right">
          <div class="way" @click="changePayWay(2)">
            <span style="float: right;margin-left:10rpx;">微信</span>
            <i class="iconfont icon-ziyuan" style="float: right;":class="{'active':payWay==2}"></i>
          </div>
        </div>
      </div>
      <div class="pay-item">
        <div class="left">
          <div class="desc">
            <img src="../../static/img/time.png" alt="" style="width: 37rpx">购买年限<span>{{package.effectiveMonth}}月</span></div>
        </div>
      </div>
      <div class="pay-item">
        <div class="left">
          <div class="desc"><img src="../../static/img/amount.png" alt="" style="width: 37rpx;height: 28rpx">应付金额<span>￥{{package.packagePrice}}</span></div>
        </div>
      </div>
      <button :class="{notAgree:!agree}" @click="submit">立即升级</button>
      <div class="deal">
          <i @click="changeAgree">
            <img src="../../static/img/no.png" alt="" v-if="!agree">
            <img src="../../static/img/yes.png" alt="" v-if="agree">
          </i>开通助商通VIP会员即视为同意<span> 助商通协议 </span></div>
    </div>
  </div>
</template>

<script>
  import { getSignIn }  from '@/common/js/comm'
  import Tips  from '@/common/js/tips'
  import { mapMutations } from 'vuex'
  import {LEFTDATE , TOTALDATE ,USERROLE} from  '@/store/mutation-types'
  export default {
    name: "index",
    components:{
    },
    data (){
      return {
        lists: [],
        rank: [],
        travel: [],
        goods:'',
        goodsLists:[],
        swiperOption: {
          autoplay: true,
          speed: 500,
          loop: true
        },
        vipgoods: '',
        package:'',
        payWay: 2,
        agree: true,
        timer : null , //支付成功跳转定时器
        timerState : false , //提交购买后再去得app放回的支付结果,
        category: [
          {name: '今日排行榜',dateType:1},
          {name: '本周排行榜',dateType:2},
          {name: '本月排行榜',dateType:3},
        ],
        dateType: 1
      }
    },
    mounted(){
      this.getVipPrice();
    },
    methods: {
      ...mapMutations({
        leftDate:'LEFTDATE',
        totalDate:'TOTALDATE',
        userRole:'USERROLE',
      }),
      getVipPrice(){
        var _this = this;
        var _data = {
          token:_this.$store.state.token
        }
        getSignIn(_data).then(sec=>{
          _this.$http.getVipMes(_data,sec).then(res=>{
            if(res.state == 1){
              this.package = res.data;
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
            }
          })
        })
      },
      changeAgree(){
        let _self = this;
        _self.agree = !_self.agree;
      },
      /*修改付费方式*/
      changePayWay(way){
        let _self = this;
        _self.payWay = way;
      },
      /*充值提交*/
      submit(){
        let _self = this;
        if(_self.agree){
          let _data = {
              token:this.$store.state.token,
              packagePrice:_self.package.packagePrice,
              payWay:_self.payWay,
              openid:_self.$store.state.openId,
              appid:'wx5e11922e81e3951d',
            };
            console.log(_data);
           _self.timerState = true;
            getSignIn({'token':_data.token,"data":JSON.stringify(_data)}).then(sec=>{
              _self.$http.postVipMes({data:`data=${JSON.stringify(_data)}`,token:_data.token},sec).then(res=>{
                var leftDate = res.memberRestDay;
                var totalDate = res.memberScale;
                wx.requestPayment({
                  timeStamp: res.data.apiTimestamp,
                  nonceStr: res.data.apiNoncestr,
                  package: res.data.apiPackage,
                  signType: res.data.apiSigntype,
                  paySign: res.data.apiPaysign,
                  success:function(sec){
                    Tips.toast(`付款成功`,'none');
                    _self.leftDate(leftDate);
                    _self.totalDate(totalDate);
                    _self.userRole(1);
                    wx.switchTab({
                      url: '../../pages/personal/main',
                      success: function (e) {
                        var page = getCurrentPages().pop();
                        if (page == undefined || page == null) return;
                        page.onShow();
                      }
                    })
                  },
                  fail:function(res){
                    Tips.toast(`已取消付款`,'none');
                  },
                  complete:function(res){

                  }
                })
              })

            })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .index{
    .banner{
      width: 100%;
      height: 5rem;
      background: #1a9bb1;
      position: relative;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
      .marquee{
        box-sizing: border-box;
        padding: 0 .19rem;
        background-image: url("../../static/img/marquee.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        height: .45rem;
        width: 100%;
        top: .1rem;
      }
    }
    .title{
      font-size: .3rem;
      text-align: center;
      padding: .53rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      i{
        display: block;
        width: .22rem;
        height: .22rem;
        background-image: url("../../static/img/permit.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      span{
        padding: 0 .12rem;
      }
    }
    .card{
      box-sizing: border-box;
      padding: 0 .17rem;
      margin-bottom: .42rem;
      .first{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: .19rem;
        .card-item{
          width: 347rpx;
          height: 120rpx;
          border-radius: 8rpx;
          background:  #fff5e6;
          display: flex;
          align-items: center;
          i{
            display: block;
            width: .48rem;
            height: .48rem;
            margin: 0 .19rem;
            img{
              display: block;
              width: 100%;
              height: 100%;
              /*background: #1a9bb1;*/
            }
          }
          .right{
            display: flex;
            flex-direction: column;
            align-content: space-around;
            width: 2.31rem;
            p{
              font-size: .26rem;
            }
            span{
              font-size: .2rem;
              color: #858585;
            }
          }
        }
      }
      .second{
        width: 100%;
        margin-bottom: .19rem;
        .card-item{
          width: 100%;
          height: 1.45rem;
          border-radius: .08rem;
          background:  #fff5e6;
          display: flex;
          align-items: center;
          i{
            display: block;
            width: .48rem;
            height: .48rem;
            margin: 0 .19rem;
            img{
              display: block;
              width: 100%;
              height: 100%;
              /*background: #1a9bb1;*/
            }
          }
          .right{
            display: flex;
            flex-direction: column;
            align-content: space-around;
            width: 6.09rem;
            p{
              font-size: .26rem;
            }
            span{
              font-size: .2rem;
              color: #858585;
            }
          }
        }
      }
    }
    .pay{
      box-sizing: border-box;
      padding: 0 .3rem;
      margin-bottom: .65rem;
      .pay-item{
        box-sizing: border-box;
        padding: 0 .15rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: .57rem;
        .left{
          .desc{
            font-size: .26rem;
            display: flex;
            align-items: center;
            img{
              width: 34rpx;
              height: 34rpx;
              margin-right: .2rem;
            }
            span{
              font-size: .26rem;
              color: #858585;
              margin-left: .34rem;
            }
          }
        }
        .right{
          display: flex;
          justify-content: right;
          font-size: .26rem;
          .way{
            margin-left: .2rem;
            i{
              color: #dbdbdb;
              font-size: .25rem;
            }
            .active{
              color: #d9ba59;
            }
          }
        }
      }
      button{
        display: block;
        width: 100%;
        height: .82rem;
        border-radius: .08rem;
        font-size: .34rem;
        color: #FFFFFF;
        background: #f7094d;
        margin-bottom: .3rem;
      }
      .notAgree{
        background: #dbdbdb;
      }
      .deal{
        font-size: .18rem;
        color: #9a9da5;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        i{
          display: block;
          /*border: 1px solid #dbdbdb;*/
          width: .2rem;
          height: .2rem;
          border-radius: .04rem;
          background: #FFFFFF;
          color: #8fc31f;
          font-size: .16rem;
          margin-right: .06rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        span{
          color: #f7094d;
        }
      }
    }
  }
</style>
