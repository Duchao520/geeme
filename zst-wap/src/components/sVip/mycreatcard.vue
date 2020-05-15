<template>
  <div class="bag-scroll" ref="myScroll">

    <div class="scroll-container">
      <div style="height: 2.2rem"></div>
      <section class="card-list" v-if="showdata">
        <div class="card-item fc-ffffff"
             :class="card_bg"
             v-for="item in mycreatData" @click="goCreatDetail(item)">
          <div class="flex_box justify_space_between align_center"
               style="margin-bottom: .3rem">
            <span class="fz-24">创建时间：{{item.createTime}}</span>
            <img v-if="item.activeType==2" src="@/assets/imgs/svip/shareCard_slogan_2.png" alt=""
                 style="display: block;width: 1.62rem;height: .36rem">
            <img v-if="item.activeType==3" src="@/assets/imgs/svip/shareCard_slogan_3.png" alt=""
                 style="display: block;width: 1.54rem;height: .28rem">

          </div>
          <div class="flex_box justify_space_between">
            <div class="flex_box flex_column">
              <span class="fz-28"
                    style="margin-bottom: .08rem">分享佣金：{{(item.commissionRate).toFixed(0)}}%</span>
              <span class="fz-28">累计使用：{{item.receiveCount}}次</span>
            </div>
            <div class="flex_box" style="align-items: flex-end">
              <span class="fz-60">{{item.shareCardDiscount.toFixed(1)}}</span>
              <span class="fz-24" style="padding-bottom: .12rem;margin-right: .1rem">折</span>
              <span class="discount fz-22" style="margin-bottom: .12rem">会员折扣</span>
            </div>
          </div>
        </div>
      </section>
      <div style="height: 2.2rem"></div>
    </div>
    <section class="store">
      <div class="logo">
        <img :src="storeLogo" alt="">
      </div>
      <div class="right">
        <p class="store_name txt-ellipsis">{{storeName}}</p>
        <p class="store_add txt-ellipsis">{{storeAdd}}</p>
      </div>
    </section>
    <router-link :to="{name:'setSvipCard',query:{maincardId:maincardId}}" tag="div" class="foot_all_svip">
      <i class="iconfont icon-jia"></i>
      <p v-if="activeType==3">新增卡主分享卡</p>
      <p v-if="activeType==2">新增卡主共享卡</p>
    </router-link>
    <toast :tip="tip" ref="toast"></toast>
    <no-data :showNoData="noData" :noticeMes="conNot"/>
  </div>
</template>

<script>
  import card from '@/assets/imgs/svip/shareCard.png'
  import toast from "@/components/common/toast"
  import {myCreatSvip,} from '@/assets/js/comm'
  import {getSignIn, timestampToTime, postTitle} from '@/assets/js/jsBridge'
  import {MAINCARD} from "@/assets/js/deal";

  import noData from '../common/noData'

  import BScroll from 'better-scroll';

  export default {
    props: ['tokenPromise'],
    name: "mycreatcard",
    components: {
      noData,
      toast
    },
    data() {
      return {
        card: card,
        showdata: true,
        cardNO: '',
        token: '',
        mycreatData: [],
        maincardId: '',
        pageNum: 1,
        pageSize: 20,
        storeLogo: this.$route.query.storeLogo,
        storeName: this.$route.query.storeName,
        storeAdd: this.$route.query.storeAdd,
        noData: false,
        conNot: '',
        tip: '',
        card_bg: MAINCARD.bg,
        activeType:'',
      }
    },
    watch: {
      mycreatData: {
        handler() {
          setTimeout(() => {
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }, 300)
        },
        deep: true
      }
    },
    mounted() {
      var _this = this;
      postTitle('共享卡列表');
      _this.cardNO = _this.$route.query.svipDetail;
      _this.maincardId = _this.$route.query.maincardId;
      _this.tokenPromise.then((res) => {
        _this.token = res;
        setTimeout(() => {
          _this.getmycreat();
          _this.initScroll();
        }, 300)
      })

    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      getmycreat() {
        var _data = {
          token: String(this.token),
          mainCardNO: String(this.cardNO),
          pageNum: String(this.pageNum),
          pageSize: String(this.pageSize),
        }
        getSignIn(_data).then(res => {
          var sec = res;
          myCreatSvip(_data, sec).then(res => {
            if(res.data.state == 1){
              var vData = res.data.data;
              if(vData[0].activeType){
                  this.activeType = vData[0].activeType;
              }
              for (let i = 0; i < vData.length; i++) {
                vData[i].createTime = timestampToTime(vData[i].createTime);
                vData[i].shareCardDiscount = ((vData[i].shareCardDiscount) * 1000) / 100;
                vData[i].commissionRate = ((vData[i].commissionRate) * 1000) / 10;
              }
              console.log(`第${this.pageNum}夜`, this.pageNum, res.data.data);


              this.mycreatData = this.mycreatData.concat(res.data.data);

              if (this.mycreatData.length === 0) {
                this.showdata = false;
                this.noData = true;
                this.conNot = '你还没有分享卡哦，快去创建吧'
                return false;
              }
            }else{
              this.toast(decodeURIComponent(res.data.msg))
            }

          })
        })
      },
      goCreatDetail(item) {
        // console.log(item);
        this.$router.push({name: 'editorSvipCard', query: {maincardId: this.maincardId, id: item.id}})
      },
      nextPage() {
        var _self = this;
        _self.pageNum++;
        _self.getmycreat();
      },
      initScroll() {
        // console.log(this.$refs);
        let _self = this;
        this.scroll = new BScroll(this.$refs['myScroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.nextPage();
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .bag-scroll {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100%;
    overflow: hidden;

    .foot_all_svip {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2rem;
      padding-top: .2rem;
      background: #F2F2F2;
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      z-index: 999;

      p {
        font-size: .3rem;
      }

      i {
        color: #F60F51;
        font-size: .6rem;
      }
    }

    .store {
      width: 100%;
      box-sizing: border-box;
      padding: .44rem .49rem;
      display: flex;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      background: #FFFFFF;
      z-index: 50;

      .logo {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: .27rem;
        border-radius: 50%;
        overflow: hidden;

        img {
          display: block;
          width: 100%;
          height: 100%;
          background: #0e90d2;
        }
      }

      .right {
        width: 4.5rem;
        box-sizing: border-box;
        height: 1.2rem;
        padding: .13rem 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .store_name {
          font-size: .36rem;
        }

        .store_add {
          font-size: .24rem;
        }
      }
    }

    .card-list {
      border-radius: .2rem .2rem 0 0;
      background: #F2F2F2;
      box-sizing: border-box;
      padding: .35rem;
      min-height: 10rem;

      .card-item {
        width: 100%;
        height: 2rem;
        border-radius: .2rem .2rem 0 0;
        box-sizing: border-box;
        padding: .3rem .25rem;
        margin-bottom: .26rem;
        .discount{
          border: .02rem solid #ffffff;
        }
      }
    }
  }
</style>
