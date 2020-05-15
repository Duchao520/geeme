<template>
  <div class="bag-scroll" ref="myScroll">
    <div class="scroll-container">

      <div class="all_pur_his" v-for="item in resdata">
        <div class="all_pur_left">
          <div class="pur_to">{{item.remark}}</div>
          <div class="pur_bot">{{item.createTime}}</div>
        </div>
        <div class="all_pur_right">
          -{{(item.shouldMoney/100).toFixed(2)}}
        </div>
      </div>

    </div>

    <no-data :showNoData="noData" :noticeMes="conNot"/>
    <toast :tip="tip" ref="toast"></toast>
  </div>
</template>

<script>
  import toast from "@/components/common/toast"
  import {records} from '@/assets/js/comm'
  import {getSignIn, timestampToTime, postTitle} from '@/assets/js/jsBridge'
  import BScroll from 'better-scroll';

  import noData from '../common/noData'

  export default {
    props: ['tokenPromise'],
    name: "newpurHistory",
    components: {
      noData,
      toast
    },
    data() {
      return {
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
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }, 100)
        },
        deep: true
      }
    },
    mounted() {
      var _self = this;
      postTitle('消费记录')
      _self.maincardId = this.$route.query.maincardId;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.getrecords();
        _self.initScroll();
      });

    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      getrecords() {
        var _data = {
          token: String(this.token),
          maincardId: String(this.maincardId),
          pageNum: String(this.pageNum),
          pageSize: String(this.pageSize),
        }
        getSignIn(_data).then(result => {
          records(_data, result).then(res => {
            if(res.data.state == 1){
              var ctime = res.data.data;
              for (let i = 0; i < ctime.length; i++) {
                ctime[i].createTime = timestampToTime(ctime[i].createTime);
              }
              this.resdata = this.resdata.concat(res.data.data);
              if (this.resdata.length === 0) {
                this.noData = true;
                this.conNot = '此卡暂无记录';
                return false;
              }
            }else{
              this.toast(decodeURIComponent(res.data.msg))
            }

          })
        })

      },
      nextPage() {
        var _self = this;
        _self.pageNum++;
        _self.getrecords();
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
    top: 0;
    right: 0;
    bottom: 0;
    width: 94%;
    margin: 0 3%;

    .all_pur_his {
      width: 100%;
      border-bottom: 1px solid #E5E5E5;
      height: 1.16rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .all_pur_left {
        float: left;
        line-height: .38rem;

        .pur_to {
          font-size: .3rem;
        }

        .pur_bot {
          font-size: .24rem;
          color: #343C53;
        }
      }

      .all_pur_right {
        float: right;
        font-size: .34rem;
        color: #FF0049;
      }
    }
  }
</style>
