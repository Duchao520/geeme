<template>
  <div class="svip_m">
    <section class="mainCard fc-ffffff"
             :class="card_bg">
      <img src="@/assets/imgs/svip/svip_slogan.png" alt="" class="slogan">
      <div class="flex_box align_center">
        <img :src="majorData.shop.supplierLogo" alt=""
             class="logo">
        <div class="flex_box flex_column justify_space_between"
             style="height: .9rem;width: 4rem">
          <p class="fz-36 txt-ellipsis"
             style="width: 100%">{{majorData.shop.shopName}}</p>
          <p class="fz-24 txt-ellipsis"
             style="width: 100%">{{majorData.shop.unitAddress}}</p>
        </div>
      </div>
      <div class="flex_box justify_space_between"
           style="padding-left: 1.26rem;align-items: flex-end">
        <div class="flex_box" style="align-items: flex-end">
          <span class="fz-60">{{(majorData.card.discountRate*10).toFixed(1)}}</span>
          <span class="fz-24" style="padding-bottom: .12rem;margin-right: .1rem">折</span>
          <span class="discount fz-22" style="margin-bottom: .12rem">会员折扣</span>
        </div>
        <p class="fz-30" style="padding-bottom: .12rem">余额：{{(majorData.card.money /100).toFixed(2)}}元</p>
      </div>


    </section>
    <section class="container" v-if="majorData.card.activeType ==2">
      <main class="module">
        <div class="module-title">创建共享卡<span v-if="dis>shareCardDiscountRateLimit">主卡折扣大于{{isSet}}折,暂不能设置分享卡</span></div>
        <div class="justify-content" v-if="dis<=shareCardDiscountRateLimit">
          <div class="left">
            <p>设置共享卡折扣<input type="number" v-model="discountData">折</p>
          </div>
          <span>(可设置范围{{dis.toFixed(1)}}~{{shareCardDiscountRateLimit.toFixed(1)}})</span>
        </div>
        <div class="tips"  v-if="dis<=shareCardDiscountRateLimit">
          商家提供第三方折扣价为{{(majorData.active.referenceRate*10).toFixed(1)}}折，建议设置不低于该折扣
        </div>
      </main>
      <main class="module"  v-if="dis<=shareCardDiscountRateLimit">
        <div class="justify-content">
          <div class="left">
            <p>设置共享卡佣金比例<input type="number" v-model="chagrData">%</p>
          </div>
          <span>（可设置范围10~99%）</span>
        </div>
        <router-link :to="{name: 'shareCommision'}" tag="div" class="target">什么是分享卡佣金？</router-link>
      </main>
      <footer @click="postSvipCard(0)"  v-if="dis<=shareCardDiscountRateLimit">创建共享卡</footer>
    </section>

    <section class="container" v-if="majorData.card.activeType ==3">
      <main class="module">
        <div class="module-title">创建分享卡<span v-if="dis>shareCardDiscountRateLimit">主卡折扣大于{{isSet}}折,暂不能设置分享卡</span></div>
        <div class="justify-content" v-if="dis<=shareCardDiscountRateLimit">
          <div class="left">
            <p>设置分享卡折扣<input type="number" v-model="discountData">折</p>
          </div>
          <span>(可设置范围{{dis.toFixed(1)}}~{{shareCardDiscountRateLimit.toFixed(1)}})</span>
        </div>
        <div class="tips"  v-if="dis<=shareCardDiscountRateLimit">
          商家提供第三方折扣价为{{(majorData.active.referenceRate*10).toFixed(1)}}折，建议设置不低于该折扣
        </div>
      </main>
      <main class="module"  v-if="dis<=shareCardDiscountRateLimit">
        <div class="justify-content">
          <div class="left">
            <p>设置分享卡佣金比例<input type="number" v-model="chagrData">%</p>
          </div>
          <span>（可设置范围10~99%）</span>
        </div>
        <router-link :to="{name: 'shareCommision'}" tag="div" class="target">什么是分享卡佣金？</router-link>
      </main>
      <footer @click="postSvipCard(0)"  v-if="dis<=shareCardDiscountRateLimit">创建分享卡</footer>
    </section>
    <toast ref="toast" :tip="tip"></toast>

  </div>
</template>

<script>

  import {postDiscount, majorCard, noMajorCard} from '@/assets/js/comm'
  import {getSignIn, timestampToTime, postTitle,} from '@/assets/js/jsBridge'
  import {MAINCARD} from "@/assets/js/deal";

  import toast from '@/components/common/toast'

  export default {
    props: ['tokenPromise'],
    components: {
      toast
    },
    name: "setSvipCard",
    data() {
      return {
        maincardId: '',
        token: '',
        discountData: '',
        chagrData: '',
        state: '',
        tip: '',

        majorData: {
          card: {
            discountRate: '',
          },
          shop: {
            shopName: ''
          }
        },
        nomajorData: '',
        sharecardId: '',
        dis: '',
        isSet: '',
        card_bg: MAINCARD.bg,
        shareCardDiscountRateLimit:'',

      }
    },
    mounted() {
      var _this = this;
      postTitle('设置分享卡')
      _this.maincardId = this.$route.query.maincardId;
      if (this.$route.query.sharecardId) {
        _this.sharecardId = this.$route.query.sharecardId;
      }
      _this.tokenPromise.then((res) => {
        _this.token = res;
        _this.majorCard();
        if (_this.sharecardId) {
          _this.noMajorCardDetail();
        }
      })
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      majorCard() {
        var _data = {
          token: String(this.token),
          maincardId: String(this.maincardId),
        }
        getSignIn(_data).then(res => {
          var sec = res;
          majorCard(_data, sec).then(res => {
            if(res.data.state == 1){
              this.majorData = res.data.data;
              this.dis = this.$accMul(this.majorData.card.mainCardDiscountOfStatProfit,10) + this.majorData.discountOffset;
              this.shareCardDiscountRateLimit = res.data.data.shareCardDiscountRateLimit *10;
              this.isSet = (this.shareCardDiscountRateLimit - this.majorData.discountOffset).toFixed(1);
            }else{
              this.toast(decodeURIComponent(res.data.msg))
            }
          })
        })

      },
      postSvipCard(par) {
        this.state = par;
        var _self = this;
        if (this.discountData === '') {
          _self.tip = '请输入折扣';
          _self.$refs.toast.toast();
          return false;
        }
        if (this.chagrData === '') {
          _self.tip = '请输入佣金比率';
          _self.$refs.toast.toast();
          return false;
        }
        if(_self.chagrDa() && _self.disCount()){
          var _data = {
            token: String(this.token),
            maincardId: String(this.maincardId),
            shareCardDiscount: String((this.discountData / 10)),
            commissionRate: String((this.chagrData / 100)),
            state: String(this.state),
            activeType:this.majorData.active.activeType
          }
          getSignIn(_data).then(res => {
            var sec = res;
            postDiscount(_data, sec).then(res => {
              if (res.data.state === 1) {
                this.$router.push({
                  name: 'editorSvipCard',
                  query: {maincardId: this.maincardId, id: res.data.data.id}
                })

              }else{
                _self.tip = decodeURIComponent(res.data.msg);
                _self.$refs.toast.toast();
              }
            })

          })
        }
      },
      noMajorCardDetail() {
        var _data = {
          token: String(this.token),
          sharecardId: String(this.sharecardId),
        };
        getSignIn(_data).then(res => {
          var sec = res;
          noMajorCard(_data, sec).then(res => {
            if(res.data.state == 1){
              this.nomajorData = res.data.data;
              this.chagrData = res.data.data.commissionRate * 100;
              this.discountData = res.data.data.shareCardDiscount * 10;
            }else{
              this.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      disCount() {
        var _self = this;
        var reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
        console.log(this.discountData);
        if (!reg.test(this.discountData)) {
          _self.tip = '请输入整数或俩位小数';
          _self.$refs.toast.toast();
          this.discountData = '';
          return false;
        }else if (!(_self.dis <= Number(this.discountData) && Number(this.discountData) <= this.shareCardDiscountRateLimit)) {
          _self.tip = '可设置范围为' + _self.dis.toFixed(1) + '~' +_self.shareCardDiscountRateLimit+'折';
          _self.$refs.toast.toast();
          this.discountData = '';
          return false;
        }else {
          return true;
        }
      },
      chagrDa() {
        var _self = this;
        if(this.chagrData < 10){
          _self.toast("佣金比例不能小于10%");
          return false;
        }else if(this.chagrData > 99){
          _self.toast("佣金比例不能大于99%");
          return false;
        }else {
          return true;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";
  .svip_m {
    width: 100%;
    box-sizing: border-box;
    padding: .35rem .25rem;
    .mainCard{
      width: 100%;
      height: 2.2rem;
      border-radius: 0 .2rem 0 0;
      box-sizing: border-box;
      padding: .24rem .22rem .12rem;
      position: relative;
      margin-bottom: .52rem;
      .logo{
        display: block;
        width: 1rem;
        height: 1rem;
        background: #0D0D0D;
        border-radius: 50%;
        margin-right: .26rem;
      }
      .discount{
        border: .02rem solid #ffffff;
      }
      .slogan{
        display: block;
        width: .58rem;
        height: .58rem;
        position: absolute;
        top: 0;
        right: .47rem;
      }
    }
    .container{
      .module{
        margin-bottom: .51rem;
        .module-title{
          font-size: .34rem;
          font-weight: bold;
          margin-bottom: .57rem;
          span{
            margin-left: .2rem;
            color: #F60F51;
            font-size: .28rem;
          }
        }
        .justify-content{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: .11rem;
          .left{
            p{
              font-size: .3rem;
              input{
                width: 1.05rem;
                border: 0;
                border-bottom: .01rem solid #9A9DA5;
                text-align: center;
                font-size: .3rem;
              }
            }
          }
          span{
            color: #9A9DA5;
            font-size: .24rem;
          }
          button{
            cursor: pointer;
            display: block;
            width: 2.2rem;
            height: .6rem;
            background: #F60F51;
            color: #FFFFFF;
            font-size: .3rem;
            border-radius: .1rem;
          }
        }
        .tips{
          width: 100%;
          box-sizing: border-box;
          padding: 0 .24rem;
          font-size: .24rem;
          border-radius: .19rem;
          background: #F6F6F6;
          line-height: .38rem;
          color: #9A9DA5;
        }
        .target{
          color: #FE1457;
          font-size: .24rem;
          text-decoration: underline;
        }
      }
      footer{
        width: 100%;
        height: .8rem;
        border-radius: .1rem;
        background: #F60F51;
        color: #FFFFFF;
        font-size: .36rem;
        line-height: .8rem;
        text-align: center;
        cursor: pointer;
        margin-top: 1.45rem;
      }
    }
  }

</style>
