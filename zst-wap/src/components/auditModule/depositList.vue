<template>
  <div class="depositList bag-scroll" ref="myScroll">
    <div class="scroll-container">
      <router-link tag="div" :to="{name: 'deposit',query: {type: item.type,withDrawid: item.id,way: 1}}" class="depositList-item" v-for="(item,index) in list" :key="index">
        <div class="first">
          <p>提现金额：{{item.transMoney}}</p>
          <p>{{item.accountType == 1 ? '支付宝' : '微信'}}</p>
        </div>
        <div class="second">
          <p>{{item.state == 0 ? '待审核' : item.state == 1 ? '审核通过' : '审核失败'}}</p>
          <p>{{timestampToTime(item.createTime)}}</p>
        </div>
        <div class="third">
          <p><i class="iconfont icon-warning" v-if="item.state == -1">{{item.auditRemark}}</i></p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import {depositList} from "@/assets/js/comm";
  import {getSignIn , timestampToTime , postTitle} from "@/assets/js/jsBridge";
  import BScroll from 'better-scroll';

  export default {
    name: "depositList",
    data(){
      return{
        type: this.$route.query.type,
        withdrawUserId: this.$route.query.withdrawUserId,
        list: [],
        pageNum: 0,
        pageSize: 10
      }
    },
    methods: {
      init(){
        var _self = this;
        postTitle('提现明细');
        _self.timestampToTime = timestampToTime;
        _self.getList();
        setTimeout(() => {
          _self.initScroll();
        },400)
      },
      //获取提现明细列表
      getList(){
        var _self = this;
        _self.pageNum++;
        var _data = {
          withdrawUserId: String(_self.withdrawUserId),
          type: String(_self.type),
          pageNum: String(_self.pageNum),
          pageSize: String(_self.pageSize)
        };
        getSignIn(_data).then(sec => {
          depositList(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.list = _self.list.concat(res.data.data);
            }
          })
        })
      },
      /*初始化滚动*/
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['myScroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.getList()
        });
      }
    },
    watch: {
      list:{
        handler(){
          setTimeout(()=>{
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          },100)
        },
        deep:true
      }
    },
    mounted() {
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  .depositList {
    box-sizing: border-box;
    padding: .32rem .24rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .depositList-item {
      width: 100%;
      padding: .2rem 0;
      border-bottom: .01rem solid #E5E5E5;

      .first {
        display: flex;
        justify-content: space-between;
        margin-bottom: .16rem;

        p {
          font-size: .3rem;
        }
      }

      .second {
        display: flex;
        justify-content: space-between;
        margin-bottom: .16rem;
        p {
          font-size: .24rem;
          color: #A6A8AF;
        }
      }
      .third{
        p {
          font-size: .24rem;
          color: #A6A8AF;

          i {
            color: #FF0049;
            font-size: .24rem;
          }

          i::before {
            font-size: .28rem;
            margin-right: .06rem;
          }
        }
      }
    }
  }
</style>
