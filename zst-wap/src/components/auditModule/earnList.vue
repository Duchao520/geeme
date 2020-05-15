<template>
  <div class="earnList bag-scroll" ref="myScroll">
    <div class="scroll-container">
      <router-link tag="div" :to="{name:'earnDetail',query:{zstamountslogId:item.id,type:item.type}}" class="earnList-item" v-for="(item,index) in list" :key="index">
        <div class="left">
          <p>{{item.title}}</p>
          <span>{{timestampToTime(item.transTime)}}</span>
        </div>
        <div class="right">+{{item.transMoney}}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import {earnList} from "@/assets/js/comm";
  import {getSignIn , timestampToTime , postTitle} from "@/assets/js/jsBridge";
  import BScroll from 'better-scroll';

  export default {
    name: "earnList",
    data(){
      return{
        type: this.$route.query.type,
        withdrawUserId: this.$route.query.withdrawUserId,
        list: [],
        pageNum: 0,
        pageSize: 9
      }
    },
    methods: {
      init(){
        var _self = this;
        postTitle('收益明细');
        _self.timestampToTime = timestampToTime;
        _self.getList();
        setTimeout(() => {
          _self.initScroll();
        },400)
      },
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
          earnList(_data,sec).then(res => {
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
          },500)
        },
        deep:true
      }
    },
    mounted(){
      var _self = this;
      _self.init();
    }
  }
</script>

<style lang="scss" scoped>
  .earnList {
    box-sizing: border-box;
    padding: 0 .24rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .earnList-item{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .24rem 0;
      border-bottom: .01rem solid #E5E5E5;
      .left{
        display: flex;
        flex-direction: column;
        margin-bottom: .17rem;
        p{
          font-size: .3rem;
          font-weight: bold;
          margin-bottom: .12rem;
        }
        span{
          font-size: .24rem;
          color: #343C53;
        }
      }
      .right{
        font-size: .36rem;
        font-weight: bold;
        color: #FF0049;
      }
    }
  }
</style>
