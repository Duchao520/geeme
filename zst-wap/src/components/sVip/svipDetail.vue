<template>
  <div class="svip_m">
    <div class="svip_con">
      <div class="mainCard fc-ffffff" :class="card_bg">
        <img src="@/assets/imgs/svip/svip_slogan.png" alt="" class="slogan" style="display: block;width: .58rem;height: .58rem">
        <button class="explain fz-24 fc-ffffff"
                style="margin-bottom: .4rem"
                @click="showuse">使用说明<i class="iconfont icon-shuoming" style="font-size: .22rem"></i></button>
        <div class="flex_box" style="margin-bottom: .45rem">
          <img :src="shop.supplierLogo" alt="" class="logo">
          <div class="flex_box flex_column" style="width: 2.7rem;justify-content: space-around">
            <p class="fz-36 txt-ellipsis">{{shop.shopName}}</p>
            <p class="fz-24 txt-ellipsis">ID：{{card.cardNO}}</p>
          </div>
          <div class="flex_box" style="align-items: flex-end">
            <span class="fz-60">{{(card.discountRate * 10).toFixed(1)}}</span>
            <span class="fz-24" style="padding-bottom: .12rem;margin-right: .1rem">折</span>
            <span class="discount fz-22" style="margin-bottom: .12rem">会员折扣</span>
          </div>
        </div>
        <div class="flex_box justify_space_between align_center"
             style="padding-bottom: .35rem;border-bottom: .02rem dashed #FFFFFF;margin-bottom: .12rem">
          <span class="fz-30">余额:{{(card.money / 100).toFixed(2)}}元</span>
          <span class="fz-24"
                @click="remainMoney">查看消费记录<i class="iconfont icon-arrow-right"></i></span>
        </div>
        <div class="card_third">
          <i class="iconfont icon-dizhi3"></i>
          <p class="txt-ellipsis" @click="enterTheodolite">{{shop.unitAddress}}</p>
          <span @click="enterTheodolite">{{Number(distance).toFixed(1)}}km<i
            class="iconfont icon-arrow-right"></i></span>
          <div class="h_line"></div>
          <i class="iconfont icon-tubiao210" style="font-size: .4rem" @click="tel(shop.contactPhone)"></i>
        </div>
      </div>
      <!--分享赚-->
      <section v-if="card.activeType!=1">
        <div class="title">
          分享赚
        </div>
        <div v-if="card.activeType==2" class="line-item" @click="hasCreat">
          <p>已创建共享卡 {{sharecard_amount}}张</p>
          <span>查看共享卡</span>
        </div>
        <div v-if="card.activeType==2" class="line-item" @click="allMoney">
          <p>累计分享收益 {{(card.profit / 100).toFixed(4)}}元</p>
          <span>查看详情</span>
        </div>
        <div v-if="card.activeType==2" class="line-item" @click="setSvip">
          <p>创建共享卡</p>
          <i class="iconfont icon-jia"></i>
        </div>


        <div v-if="card.activeType==3" class="line-item" @click="hasCreat">
          <p>已创建分享卡 {{sharecard_amount}}张</p>
          <span>查看分享卡</span>
        </div>
        <div v-if="card.activeType==3" class="line-item" @click="allMoney">
          <p>累计分享收益 {{(card.profit / 100).toFixed(4)}}元</p>
          <span>查看详情</span>
        </div>
        <div v-if="card.activeType==3" class="line-item" @click="setSvip">
          <p>创建分享卡</p>
          <i class="iconfont icon-jia"></i>
        </div>

      </section>
      <router-link :to="{name: 'carderText'}" tag="div" v-if="card.activeType!=1" class="teach">
        如何创建卡分享赚钱？
      </router-link>
    </div>
    <footer class="fc-ffffff bg-F7094D fz-36"
            @click="gosetCard">立即付款</footer>

    <v-confirm :confirmTitle="'提示'"
               :confirmDesc="'该商家需要扫结算二维码结算(结算商家打印小票上的二维码)'"
               :confirmSubmit="'扫描二维码'"
               @PassEvent="handleQrParams"
               ref="vConfirm"></v-confirm>

    <!--弹出层-->
    <transition name="alertMsg">
      <div class="use_intro_pop" v-if="showBool">
        <div class="pop_con">
          <div class="close_img" @click="closePop">
            <img :src="avatar" alt="">
          </div>
          <div class="pop_title">
            <div>SVIP卡使用说明</div>
            <div class="heng_xian"></div>
          </div>

          <div class="pop_con_con">
            <div class="pop_con_fir">
              <div class="img_fir">
                <img :src="first" alt="">
              </div>
              <div class="con_con_con">
                <div class="fir_title">关于使用时间</div>
                <div class="fir_con">{{active.useDateStr}}</div>
              </div>
            </div>

            <div class="pop_con_fir">
              <div class="img_fir">
                <img :src="second" alt="">
              </div>
              <div class="con_con_con">
                <div class="fir_title">关于使用时间段</div>
                <div class="fir_con">{{active.useTimeRange}}</div>
              </div>
            </div>

            <div class="pop_con_fir">
              <div class="img_fir">
                <img :src="third" alt="">
              </div>
              <div class="con_con_con">
                <div class="fir_title">关于活动使用说明</div>
                <div class="fir_con">{{active.remark}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <toast ref="toast" :tip="tip"></toast>
  </div>
</template>

<script>
  import avatar from '@/assets/imgs/common/close.png'
  import first from '@/assets/imgs/svip/first.png'
  import second from '@/assets/imgs/svip/second.png'
  import third from '@/assets/imgs/svip/third.png'
  import {getSignIn, postTitle, enterTheodolite, calDistance, getGPS , handleQrParams} from '@/assets/js/jsBridge'
  import {MAINCARD} from "@/assets/js/deal";
  import {cardeDetail} from '@/assets/js/comm'
  import toast from '@/components/common/toast'
  import vConfirm from '@/components/common/vConfirm';

  export default {
    name: "svipDetail",
    props: ['tokenPromise'],
    components: {
      toast,
      vConfirm
    },
    data() {
      return {
        avatar: avatar,
        showBool: false,
        token: '',
        first: first,
        second: second,
        third: third,
        //主卡id
        maincardId: '',
        //数据
        // 使用说明
        active: '',
        // 卡片
        card: '',
        //商店信息
        sharecard_amount: '',
        cardNO: '',
        pustAllCon: true,


        //内容文本信息
        shop: {
          remark: ''
        },
        // 是否展示所有文本内容
        showTotal: true,
        // 显示展开还是收起
        exchangeButton: true,
        // 是否显示展开收起按钮
        showExchangeButton: false,
        rem: '',
        long: '',
        lat: '',
        distance: '',
        tip: '',
        card_bg: MAINCARD.bg
      }
    },
    mounted() {
      var _self = this;
      postTitle('卡主详情')
      this.maincardId = this.$route.query.maincardId;
      _self.tokenPromise.then(res => {
        this.token = res;
        getGPS().then(pos => {
          _self.long = pos.LONG;
          _self.lat = pos.LAT;
          this.getSvipdetail();
        })
      });
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      calDistance(lat_1, long_1, lat_2, long_2) {
        var _self = this;
        _self.distance = calDistance(lat_1, long_1, lat_2, long_2);
      },
      tel(phone) {
        window.location.href = "tel:" + phone
      },
      gotest() {
        this.$router.push({name: 'editorSvipCard1111'});
      },
      gosetCard() {
        if(this.shop.id == '1554363195'){
          this.$refs.vConfirm.showConfirm();
        }else{
          this.$router.push({name: 'mainCardPay', query: {cardType: 1, mainCardId: this.maincardId,shopStoreId: this.card.shopStoreId}});
        }
      },
      showuse() {
        this.showBool = true;
      },
      closePop() {
        this.showBool = false;
      },
      remainMoney() {
        this.$router.push({name: 'newpurHistory', query: {maincardId: this.maincardId}})
      },
      hasCreat() {
        this.$router.push({
          name: 'mycreatcard',
          query: {
            svipDetail: this.cardNO,
            maincardId: this.maincardId,
            storeLogo: this.shop.supplierLogo,
            storeName: this.shop.shopName,
            storeAdd: this.shop.unitAddress
          }
        })
      },
      allMoney() {
        this.$router.push({name: 'mainshareHistory', query: {maincardId: this.maincardId}})
      },
      setSvip() {
        this.$router.push({
          name: 'setSvipCard', query: {
            maincardId: this.maincardId
          }
        })
      },
      showTotalIntro() {
        this.showTotal = !this.showTotal;
        this.exchangeButton = !this.exchangeButton;
      },
      getRem() {
        const defaultRem = 16;
        let winWidth = window.innerWidth;
        let rem = winWidth / 375 * defaultRem;
        return rem;
      },
      //svip详情方法
      getSvipdetail() {
        var _self = this;
        var _data = {
          token: String(_self.token),
          maincardId: String(_self.maincardId)
        }
        getSignIn(_data).then(result => {
          var sec = result;
          cardeDetail(_data, sec).then((res) => {
            if(res.data.state == 1){
              _self.active = res.data.data.active;
              _self.card = res.data.data.card;
              _self.shop = res.data.data.shop;
              _self.cardNO = res.data.data.card.cardNO;
              _self.sharecard_amount = res.data.data.sharecard_amount;
              _self.calDistance(_self.lat, _self.long, _self.shop.latitude, _self.shop.longitude)
            }else{
              _self.toast(decodeURIComponent(res.data.msg))
            }

          })
        })
      },
      /* 进入导航*/
      enterTheodolite() {
        var _self = this;
        var long = _self.shop.longitude;
        var lat = _self.shop.latitude;
        enterTheodolite(long, lat);
      },

      handleQrParams(){
        let attachObj = {'mainCardId':String(this.maincardId)};
        var _data = {
          isAppAccess: '1',
          isMainCard: '1',
          attach: JSON.stringify(attachObj)
        };
        handleQrParams(_data);
      }
    },
    watch: {
      'shop.remark': function () {
        this.$nextTick(function () {
          // 判断介绍是否超过俩行
          let rem = parseFloat(this.getRem());
          if (!this.$refs.desc) {
            return;
          }
          let descHeight = window.getComputedStyle(this.$refs.desc).height.replace('px', '');
          if (descHeight > 2.28 * rem) {
            // 显示展开收起按钮
            this.showExchangeButton = true;
            this.exchangeButton = true;
            // 不是显示所有
            this.showTotal = false;
          } else {
            // 不显示展开收起按钮
            this.showExchangeButton = false;
            // 没有超过四行就显示所有
            this.showTotal = true;
          }
        }.bind(this));
      }
    },

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/global";

  .svip_m {
    width: 100%;

    .svip_con {
      margin: 0 0.3rem;
      padding-top: .3rem;
      display: block;


      .mainCard{
        width: 7rem;
        height: 4rem;
        margin: 0 auto .69rem;
        border-radius: 0 .2rem 0 .2rem;
        box-sizing: border-box;
        padding: .2rem .3rem;
        position: relative;
        .slogan{
          position: absolute;
          top: 0;
          right: .21rem;
        }
        .explain{
          display: block;
          padding: .04rem .14rem;
          background: rgba(0,0,0,.1);
          border-radius: .2rem;
        }
        .logo{
          display: block;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: #0D0D0D;
          margin-right: .2rem;
        }
        .discount{
          border: .02rem solid #ffffff;
        }
        .card_third {
          display: flex;
          color: #FFFFFF;
          align-items: center;

          i {
            font-size: .32rem;
          }

          p {
            width: 3.93rem;
            font-size: .24rem;
            color: #FFFFFF;
            margin-right: .1rem;

            i {
              font-size: .24rem;
            }
          }

          span {
            font-size: .24rem;
            color: #FFFFFF;
            margin-right: .29rem;
            display: flex;
            align-items: center;
          }

          .h_line {
            width: .02rem;
            height: .57rem;
            background: #FFFFFF;
            margin-right: .26rem;
          }
        }
      }

      section {
        margin-bottom: .34rem;

        .title {
          font-size: .36rem;
          font-weight: bold;
        }

        .line-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: .5rem 0;
          border-bottom: .01rem solid rgba(0, 0, 0, .1);

          p {
            font-size: .3rem;
            color: #000000;
          }

          span {
            font-size: .28rem;
            color: #9A9DA5;
          }

          i {
            font-size: .6rem;
            color: #FDB300;
          }
        }
      }

      .teach {
        font-size: .28rem;
        color: #FE1457;
        text-decoration: underline;
        cursor: pointer;
        text-align: center;
      }

      .set_dis {
        width: 100%;
        background: #1B1B1B;
        margin-bottom: .39rem;
        display: block;

        .set_dis_input {
          color: #fff;
          font-size: .28rem;
          margin-bottom: 0.28rem;

          .fir_dis {
            margin-right: .27rem;
          }
        }

        .look_detail {
          font-size: .28rem;
          color: #7f502c;
          float: right;
        }

        .sug_dis {
          font-size: .24rem;
          color: #8D8E98;
          line-height: .36rem;
        }
      }
    }
    footer{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      letter-spacing: .06rem;
    }

    .busi_intro {
      margin: 0 0.2rem;
      overflow: hidden;
      display: block;
      //test
      .total-introduce {
        height: auto;
        overflow: hidden;
        font-size: 14px;
        color: #434343;

        .intro-content {
          .merchant-desc {
            width: 100%;
            line-height: 21px;
          }
        }

        .unfold {
          display: block;
          z-index: 11;
          float: right;
          width: 40px;
          height: 21px;

          p {
            margin: 0;
            line-height: 21px;
            color: #7fbe87;
          }
        }
      }

      .detailed-introduce {
        font-size: 14px;
        color: #434343;
        position: relative;
        overflow: hidden;

        .intro-content {
          // 最大高度设为4倍的行间距
          max-height: 42px;
          line-height: 21px;
          word-wrap: break-word;
          /*强制打散字符*/
          word-break: break-all;
          background: #ffffff;
          /*同背景色*/
          color: #ffffff;
          overflow: hidden;

          .merchant-desc {
            width: 100%;
            line-height: 21px;
          }

          &:after,
            // 这是展开前实际显示的内容
          &:before {
            content: attr(title);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            color: #434343
            // overflow: hidden;
          }

          // 把最后最后一行自身的上面三行遮住
          &:before {
            display: block;
            overflow: hidden;
            z-index: 1;
            max-height: 21px;
            background: #ffffff;
          }

          &:after {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 40px;
            /*截取行数*/
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            /*行首缩进字符数，值为[(截取行数-1)*尾部留空字符数]*/
            text-indent: -12em;
            /*尾部留空字符数*/
            padding-right: 4em;
          }

          .unfold {
            z-index: 11;
            width: 40px;
            height: 21px;
            outline: 0;
            position: absolute;
            right: 0;
            bottom: 0;

            p {
              margin: 0;
              line-height: 21px;
              color: #7fbe87;
            }
          }
        }
      }


      .bus_title {
        font-size: .34rem;
        margin-bottom: .27rem;
        color: #000;
      }

      .bus_con {
        font-size: .28rem;

        .svip_de {
          font-size: .28rem;
          height: 1rem;
          border-bottom: 1px solid #E5E5E5;
          line-height: 1rem;
        }
      }

      .look_put {
        font-size: .28rem;
        margin-top: .3rem;
        color: #8D8E98;
      }

    }

    .bala_pay {
      width: 100%;
      height: 0.82rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: .39rem 0;

      .bala_btn {
        width: 6rem;
        height: 0.82rem;
        background: #F7094D;
        font-size: .36rem;
        color: #fff;
        border-radius: .1rem;
        text-align: center;
        line-height: .82rem;
      }
    }

    .svip_foot {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1rem;
      display: flex;

      .svip_f_left {
        background: -webkit-linear-gradient(left, #efaa84, #80512d); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, #efaa84, #80512d); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, #efaa84, #80512d); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #efaa84, #80512d); /* 标准的语法 */
        width: 5rem;
        height: 1rem;
        font-size: .24rem;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          display: block;
          color: #fff;
          padding: 0 0.16rem;
        }

        /*padding:.24rem .18rem .2rem .21rem;*/
      }

      .svip_f_right {
        width: 2.5rem;
        height: 1rem;
        background: #1B1B1B;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          background: -webkit-linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
          background: -o-linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
          background: -moz-linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
          background: linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: .28rem;
        }
      }
    }

    .use_intro_pop {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 999;

      .pop_con {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 2.24rem;
        width: 6rem;
        height: 7rem;
        background: #fff;
        margin: auto;
        z-index: 999;
        border-radius: .2rem;

        .close_img {
          width: .55rem;
          height: .54rem;
          position: absolute;
          top: -.75rem;
          right: -.25rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .pop_title {
          width: 100%;
          height: .52rem;
          /*background:#ff6700;*/
          margin-top: .52rem;
          font-size: .36rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          div {
            background: linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
          }

          .heng_xian {
            width: 2rem;
            height: 0.02rem;
            background: linear-gradient(0deg, rgba(239, 170, 132, 1) 0.2685546875%, rgba(127, 80, 44, 1) 100%);
            margin-top: 0.02rem;
          }
        }

        .pop_con_con {
          width: 5.6rem;
          margin-top: .72rem;
          margin-left: .2rem;

          .pop_con_fir {
            overflow: hidden;
            margin-bottom: .66rem;

            .img_fir {
              width: .35rem;
              height: .35rem;
              float: left;
              background: #ff6700;

              img {
                width: 100%;
                height: 100%;
                display: block;
              }
            }

            .con_con_con {
              float: left;
              margin-left: .2rem;
              width: 4.8rem;

              .fir_title {
                font-size: .34rem;
                color: #000;
              }

              .fir_con {
                font-size: .28rem;
                color: #000;
              }
            }
          }
        }
      }
    }
  }
</style>
