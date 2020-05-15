<template>
  <div class="svip_m">
    <div class="con_con">
      <section class="store fc-ffffff"
               :class="card_bg">
        <img v-if="nomajorData.activeType ==2" src="@/assets/imgs/svip/shareCard_slogan_2.png" alt=""
             class="slogan"
             style="display: block;width: 1.62rem;height: .32rem">
        <img v-if="nomajorData.activeType ==3" src="@/assets/imgs/svip/shareCard_slogan_3.png" alt=""
             class="slogan"
             style="display: block;width: 1.62rem;height: .36rem">
        <div class="flex_box align_center"
             style="margin-bottom: .3rem">
          <img :src="nomajorData.storeLogo" alt="" class="logo">
          <div class="flex_box flex_column justify_space_between"
               style="height: .9rem">
            <p class="txt-ellipsis fz-36"
               style="width: 3.3rem">{{nomajorData.storeName}}</p>
            <p class="txt-ellipsis fz-24"
               style="width: 4rem">{{nomajorData.address}}</p>
          </div>
        </div>
        <div class="flex_box justify_space_between fz-30"
             style="padding-left: 1.34rem">
          <span>会员折扣：{{(nomajorData.shareCardDiscount*10).toFixed(1)}}折</span>
          <span>分享佣金：{{(nomajorData.commissionRate * 100).toFixed(0)}}%</span>
        </div>
      </section>
      <section class="module">
        <div class="module-title">数据统计</div>
        <div class="justify-content">
          <div class="left">
            <p>累计消费 {{nomajorData.consumeAmount}}次</p>
            <p>累计收益 {{(nomajorData.mainCardProfits/100).toFixed(4)}}元</p>
          </div>
          <router-link :to="{name:'shareHistory',query:{sharecardId:sharecardId}}" tag="span">查看详情</router-link>
        </div>
      </section>
      <section class="module" v-if="nomajorData.activeType == 2">
        <div class="module-title">分享赚方式一</div>
        <div class="justify-content">
          <div class="left">
            <p>{{nomajorData.state == 1 ? '已发布' : '未发布'}}</p>
          </div>
          <button v-if="nomajorData.state !== 1" @click="cancelSC(1)"><i class="iconfont icon-fabu"></i>发布到门店</button>
          <button v-else  @click="cancelSC(0)"><i class="iconfont icon-shanchu"></i>撤销发布</button>
        </div>
        <div class="tips">
          温馨提示：发布到门店，可让更多的人使用您的共享卡，每个门店最多发布10张共享卡
        </div>
      </section>
      <section class="module">
        <div class="module-title" v-if="nomajorData.activeType ==2">分享赚方式二</div>
        <div class="module-title" v-if="nomajorData.activeType ==3">分享赚方式一</div>
        <div class="justify-content">
          <div class="left">
            <p>分享给微信好友</p>
          </div>
          <button @click="shareParent"><i class="iconfont icon-fenxiang"></i>分享给好友</button>
        </div>
        <div class="tips">
          温馨提示：让好友收益，让自己赚钱<br>
          只限发送微信好友
        </div>
      </section>
      <footer v-if="nomajorData.activeType==2" @click="deleteSCard">删除共享卡</footer>
      <footer v-if="nomajorData.activeType==3" @click="deleteSCard">删除分享卡</footer>
    </div>
    <toast ref="toast" :tip="tip"></toast>
  </div>
</template>

<script>
  import {postDiscount, majorCard, noMajorCard, deleteCard, cancelCard} from '@/assets/js/comm'
  import {
    getSignIn, timestampToTime, postTitle, shareInterface, getUserAgentType, postShareContentIOS,
    ctxPath, postStrAndroid, postImgAndroid, postUrlAndroid, callAppMethod, postTitleAndroid, getShareUserId,
    versions , postGoodsUrl
  } from '@/assets/js/jsBridge'
  import {MAINCARD} from "@/assets/js/deal";
  import toast from '@/components/common/toast'

  export default {
    props: ['tokenPromise'],
    name: "setSvipCard",
    components: {
      toast
    },
    data() {
      return {
        btn: true,
        maincardId: this.$route.query.maincardId,
        majorData: '',
        mainCard: '',
        shop: '',
        sharecardId: this.$route.query.id,
        nomajorData: '',
        cardNO: '',
        token: '',
        tip: '',
        card_bg: MAINCARD.bg
      }
    },
    methods: {
      init() {
        var _self = this;
        _self.Detail();
      },
      /*判断版本——IOS旧版本分享网页——新版本分享小程序*/
      versions(){
        var _self = this;
        var bool = versions();
        if(bool){
          _self.postMinProUrl();
        }else{
          _self.webShare();
        }
      },
      webShare(){
        var _self = this;
        getShareUserId().then(userId => {
          var url = ctxPath + '/zst-wap/index.html#/shareSvipCard?shareCardId=' + _self.nomajorData.id + '&shopStoreId=' + _self.nomajorData.shopStoreId + '&distance=' + _self.nomajorData.distance + '&userId=' + userId;
          var _data = {
            title: `【${_self.nomajorData.storeName}】助商通联盟商家卡主会员折扣卡`,
            describe: `立享会员折扣${_self.nomajorData.shareCardDiscount * 1000 / 100}折；更多优惠下载请下载助商通。`,
            imageUrl: _self.nomajorData.storeImgs.split(',')[0],
            url: url
          };

          postShareContentIOS(_data);
        })
      },
      postMinProUrl(){
        var _self = this;
        var uri = "pages/packageB/pages/shareCardDetail/main?distance=" + _self.nomajorData.distance + "&shareid=" + _self.nomajorData.id + "&shopStoreId=" + _self.nomajorData.shopStoreId;
        postImgAndroid(_self.nomajorData.storeImgs.split(',')[0]);
        postGoodsUrl(uri)
        postTitleAndroid(`【${_self.nomajorData.storeName}】点击卡主付款，最低享受${(_self.nomajorData.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`)
        var _data = {
          title: `【${_self.nomajorData.storeName}】点击卡主付款，最低享受${(_self.nomajorData.shareCardDiscount * 1000 / 100).toFixed(1)}折优惠`,
          imageUrl: _self.nomajorData.storeImgs.split(',')[0],
        };

        postShareContentIOS(_data);
      },
      Detail() {
        var _self = this;
        var _data;
        _data = {
          token: String(_self.token),
          sharecardId: String(_self.sharecardId),
        };
        getSignIn(_data).then(sec => {
          noMajorCard(_data, sec).then(res => {
            if(res.data.state == 1){
              _self.nomajorData = res.data.data;
              _self.cardNO = res.data.data.shareCardNO;
              _self.versions();
            }else{
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      deleteSCard() {
        var _data = {
          token: String(this.token),
          sharecardId: String(this.sharecardId),
        };
        var _this = this;
        getSignIn(_data).then(res => {
          var sec = res;
          deleteCard(_data, sec).then(res => {
            if (res.data.state === 1) {
              _this.tip = '删除成功';
              _this.$refs.toast.toast();
              window.history.go(-1);
            }else{
              _this.tip = decodeURIComponent(res.data.msg);
              _this.$refs.toast.toast();
            }
          })
        })
      },
      cancelSC(par) {
        this.state = par;
        var _this = this;
        var _data = {
          token: String(this.token),
          sharecardId: String(this.sharecardId),
          state: String(this.state),
        }
        getSignIn(_data).then(res => {
          cancelCard(_data, res).then(res => {
            if (res.data.state === 1) {
              _this.tip = '操作成功';
              _this.$refs.toast.toast();
              _this.Detail();
            }else{
              _this.tip = decodeURIComponent(res.data.msg);
              _this.$refs.toast.toast();
            }
          })
        })
      },
      shareParent() {
        shareInterface();
      },
      shareInit() {
        var _self = this;
        getShareUserId().then(userId => {
          var url = ctxPath + '/zst-wap/index.html#/shareSvipCard?shareCardId=' + _self.nomajorData.id + '&shopStoreId=' + _self.nomajorData.shopStoreId + '&distance=' + _self.nomajorData.distance + '&userId=' + userId;
          var _data = {
            title: `【${_self.nomajorData.storeName}】助商通联盟商家卡主会员折扣卡`,
            describe: `立享会员折扣${_self.nomajorData.shareCardDiscount * 1000 / 100}折；更多优惠下载请下载助商通。`,
            imageUrl: _self.nomajorData.storeImgs,
            url: url
          };

          postShareContentIOS(_data);
          postTitleAndroid(`【${_self.nomajorData.storeName}】助商通联盟商家卡主会员折扣卡`);
          postStrAndroid(`立享会员折扣${_self.nomajorData.shareCardDiscount * 1000 / 100}折；更多优惠下载请下载助商通。`);
          postImgAndroid(_self.nomajorData.storeImgs);
          postUrlAndroid(url);
        })
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      }
    },
    mounted() {
      var _this = this;
      postTitle('我的共享卡')
      callAppMethod('22');
      _this.tokenPromise.then(res => {
        _this.token = res;
        _this.init();
      })
    }
  }
</script>

<style lang="scss" scoped>
  .svip_m {
    width: 100%;
    padding-bottom: 0.8rem;

    .con_con {
      overflow-y: scroll;
      /*增加弹性滚动,解决滚动不流畅的问题*/
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      padding: .37rem .2rem;

      .store {
        width: 100%;
        height: 2.2rem;
        box-sizing: border-box;
        padding: .35rem .34rem .25rem;
        border-radius: .2rem .2rem 0 0;
        position: relative;
        margin-bottom: .47rem;
        .logo{
          display: block;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          margin-right: .34rem;
        }
        .slogan{
          position: absolute;
          right: .22rem;
          top: .22rem;
        }
      }
      .module{
        margin-bottom: .51rem;
        .module-title{
          font-size: .34rem;
          font-weight: bold;
          margin-bottom: .57rem;
        }
        .justify-content{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: .11rem;
          .left{
            p{
              font-size: .3rem;
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
          padding: .08rem .24rem;
          font-size: .24rem;
          border-radius: .1rem;
          background: #F6F6F6;
          line-height: .48rem;
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
      }
    }
    .btn_keep {
      width: 100%;
      height: .8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 0.2rem;
      /*margin-top:1.72rem;*/
      .editor_btn {
        width: 100%;
        display: flex;
        margin: 0 .2rem;
        justify-content: space-around;

        div {
          font-size: .38rem;
          color: #ffff;
          border-radius: .4rem;
          padding: 0.12rem 0.46rem;
          border: 1px solid rgba(127, 80, 44, 1);
          background: linear-gradient(0deg, rgba(218, 153, 117, 1) 0.78125%, rgba(127, 80, 44, 1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    .bot_bot {
      overflow: hidden;
      height: .3rem;
      font-size: .2rem;
      line-height: .3rem;
      padding: 0 .27rem;
      padding-top: 0.2rem;
      padding-bottom: 1.5rem;
      color: #fff;

      span {
        display: block;
      }
    }

    .svip_bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1rem;
      background: #fff;
      z-index: 999;

      .bot_top {
        height: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
          font-size: .28rem;
          text-align: center;
          line-height: 0.52rem;
          color: #fff;
        }

        .delete_share {
          width: 100%;
          height: 1rem;
          background: linear-gradient(90deg, rgba(218, 153, 117, 1), rgba(127, 80, 44, 1));
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .36rem;
        }
      }
    }
  }

</style>
