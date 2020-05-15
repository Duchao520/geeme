<template>
  <div class="bag-scroll" ref="myScroll">
    <div class="scroll-container">
      <!--一样的问题****************************************************************-->
      <div class="share_ev" v-for="item in resdata" @click="shareDetail(item)">
        <div class="top_top">
          <span style="float: left;">{{item.createTime}}</span>
        </div>

        <div class="share_top">
          <span style="float: left;" v-if="item.mainCardNO === item.shareCardNO">卡主会员消费{{(item.totalMoney/100).toFixed(2)}}元</span>
          <span style="float: left;" v-else>卡主共享卡消费{{(item.totalMoney/100).toFixed(2)}}元</span>
          <span style="float: right;">实付金额 ￥{{(item.shouldMoney/100).toFixed(2)}}</span>
        </div>
        <div class="share_bot">

          <span style="float: left;">技术服务费{{item.serviceFee / 100}}元</span>
          <span style="float: left;margin-left:.2rem;">分享佣金{{item.shareCardCommissionRate*100}}%</span>
          <span
            style="float: right;display: inline-block;padding:.05rem .24rem;background:#FF0049;color:#fff;border-radius: .24rem;color:#fff;">赚￥{{(item.actualMainCardProfit*100/10000).toFixed(4)}}</span>
        </div>
      </div>
    </div>
    <toast ref="toast" :tip="tip"></toast>
    <no-data :showNoData="noData" :noticeMes="conNot"/>
  </div>
</template>

<script>
  import {shareCardD} from '@/assets/js/comm'
  import {getSignIn, timestampToTime, postTitle} from '@/assets/js/jsBridge'
  import toast from '@/components/common/toast'
  import BScroll from 'better-scroll';

  import noData from '../common/noData'

  export default {
    props: ['tokenPromise'],
    name: "shareHistory",
    components: {
      noData,
      toast
    },
    data() {
      return {
        sharecardId: '',
        token: '',
        resdata: [],
        pageNum: 1,
        pageSize: 20,

        noData: false,
        conNot: '',
        tip: ''
      }
    },
    watch: {
      resdata: {
        handler() {
          setTimeout(() => {
            console.log(this.scroll);
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }, 100)
        },
        deep: true
      }
    },
    mounted() {
      var _this = this;
      postTitle('卡主共享卡记录')
      this.sharecardId = this.$route.query.sharecardId;
      _this.tokenPromise.then((res) => {
        _this.token = res;
        _this.getPurList();
        _this.initScroll();
      })
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      shareDetail(par) {
        console.log(par);
        this.$router.push({name: 'purDetail', query: {consumerId: par.id}})
      },
      getPurList() {
        var _data = {
          token: String(this.token),
          sharecardId: String(this.sharecardId),
          pageNum: String(this.pageNum),
          pageSize: String(this.pageSize),
        }
        getSignIn(_data).then(result => {
          shareCardD(_data, result).then(res => {
            if(res.data.state == 1){
              var timeD = res.data.data;
              if (timeD.length === 0) {
                this.noData = true;
                this.conNot = '此卡还未消费';
                return false;
              }
              for (let i = 0; i < timeD.length; i++) {
                timeD[i].createTime = timestampToTime(timeD[i].createTime);
                timeD[i].mainCardProfit = timeD[i].mainCardProfit * 10 / 1000;
              }
              this.resdata = res.data.data;
            }else{
              this.toast(decodeURIComponent(res.data.msg))
            }

          })
        })
      },
      nextPage() {
        var _self = this;
        _self.pageNum++;
        _self.getPurList();
      },
      initScroll() {
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
    top: 0;
    bottom: 0;
    width: 94%;
    margin: 0 3%;

    .share_ev {
      width: 100%;
      overflow: hidden;
      line-height: .36rem;
      border-bottom: 1px solid #E5E5E5;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .top_top {
        font-weight: 300;
        color: rgba(52, 60, 83, 1);
        font-size: .3rem;
        padding: .17rem 0;
      }

      .share_top {
        overflow: hidden;
        margin-bottom: .17rem;
        font-size: .3rem;
        color: #000;

        span {
          font-size: .3rem;
        }
      }

      .share_bot {
        font-size: .24rem;
        margin-bottom: .17rem;
      }
    }
  }
</style>
