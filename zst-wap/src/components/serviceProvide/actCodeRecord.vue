<template>
  <div class="actCodeRecord">
    <toast ref="toast" :tip="tip"></toast>
    <div class="mine-container">
      <div class="mine">
        <div class="mineCode">我的商家激活码</div>
        <div class="total">
          <div class="total-item">当前可用<span>{{total.unused_codes}}</span></div>
          <div class="total-item">累计激活<span>{{total.used_codes}}</span></div>
          <button @click="getCode">获取激活码</button>
        </div>
      </div>
    </div>
    <div class="bag-scroll" ref="myScroll">
      <div class="scroll-container">
        <div style="height: 2.6rem;"></div>
        <div class="title"><span>激活码记录</span></div>
        <div class="actCodeRecord-item" v-for="(item,index) in record" :key="index">
          <div class="thumb">
            <img v-lazy="item.shopLogo" alt="">
          </div>
          <div class="right">
            <b class="txt-ellipsis">{{item.shopName}}</b>
            <p>对应激活码：{{item.activeCode}}</p>
            <p>激活时间：{{timestampToTime(item.activeTime)}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSignIn , postTitle , timestampToTime , callAppMethod} from "@/assets/js/jsBridge";
  import {activecodeAmount , activeCodeRecord , activeCode} from "@/assets/js/comm";
  import toast from "@/components/common/toast";
  import BScroll from 'better-scroll';

  export default {
    name: "actCodeRecord",
    props: ['tokenPromise'],
    components: {
      toast
    },
    data(){
      return{
        token: '',
        tip: '',
        total: '',
        pageNum: 0,
        pageSize: 6,
        record: []
      }
    },
    methods: {
      init(){
        var _self = this;
        postTitle('商家激活码');
        _self.timestampToTime = timestampToTime;
        _self.getCodeNum();
        setTimeout(() => {
          _self.initScroll();
        }, 400)
      },
      timestampToTime(){

      },
      /*获取激活码数量*/
      getCodeNum(){
        var _self = this;
        let _data = {
          token: String(_self.token)
        };
        getSignIn(_data).then(sec => {
          activecodeAmount(_data,sec).then(res => {
            _self.getRecord();
            if(res.data.state == 1){
              _self.total = res.data.data;
            }else {
              _self.toast(decodeURI(res.data.msg))
            }
          })
        })
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*获取记录*/
      getRecord(){
        var _self = this;
        _self.pageNum++;
        let _data = {
          token: String(_self.token),
          pageNum: String(_self.pageNum),
          pageSize: String(_self.pageSize)
        };
        getSignIn(_data).then(sec => {
          activeCodeRecord(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.record = _self.record.concat(res.data.data);
            }else{
              _self.toast(decodeURI(res.data.msg))
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
          _self.getRecord()
        });
      },
      getCode(){
        var _self = this;
        var _data = {
          token: String(_self.token)
        };
        getSignIn(_data).then(sec => {
          activeCode(_data,sec).then(res => {
            if(res.data.state == 1){
              var code = res.data.data.activeCode;
              _self.$router.push({
                name: 'actCodeDetail',
                query: {
                  code: String(code)
                }
              })
            }else{
              _self.toast(decodeURI(res.data.msg));
            }
          })
        })
      }
    },
    watch: {
      record:{
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
      callAppMethod('20');
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .actCodeRecord{
    .mine-container{
      position: fixed;
      top: 0;
      left: 0;
      box-sizing: border-box;
      padding: .39rem .25rem;
      width: 100%;
      background: #FFFFFF;
      z-index: 10;
      .mine{
        width: 100%;
        height: 1.89rem;
        background:rgba(255,255,255,1);
        box-shadow:0 0 .22rem .1rem rgba(189,158,158,0.17);
        border-radius:.1rem;
        box-sizing: border-box;
        padding: .22rem .16rem;
        .mineCode{
          width: 2.27rem;
          height: .4rem;
          line-height: .4rem;
          text-align: center;
          background: rgba(229,229,229,.5);
          border-radius: .2rem;
          font-size: .24rem;
          margin-bottom: .47rem;
        }
        .total{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .total-item{
            font-size: .28rem;
            span{
              margin-left: .4rem;
              color: #F70A4D;
            }
          }
          button{
            font-size: .28rem;
            color: #FFFFFF;
            display: block;
            width: 1.78rem;
            height: .49rem;
            background:#F7094D;
            border:.03rem solid;
            border-image:linear-gradient(0deg, rgba(255, 171, 28, 0.77), rgba(255, 123, 139, 0.77)) 3 3;
            box-shadow:0 .03rem .12rem .01rem rgba(157,0,0,0.61);
            border-radius:.1rem;
            overflow: hidden;
          }
        }
      }
    }
    .title{
      font-size: .34rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: .39rem;
      span{
        margin: 0 .17rem;
      }
    }
    .title::before,.title::after{
      content: '';
      display: block;
      width: 1.31rem;
      height: .01rem;
      background: #E5E5E5;
    }
    .bag-scroll {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-sizing: border-box;
      padding: .39rem .25rem;
    }
    .actCodeRecord-item{
      width: 100%;
      display: flex;
      padding: .21rem 0;
      border-bottom: .01rem solid #E5E5E5;
      .thumb{
        width: 1.5rem;
        height: 1.5rem;
        margin-right: .14rem;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .right{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        b{
          font-size: .34rem;
          display: block;
          font-weight: normal;
        }
        p{
          font-size: .28rem;
          color: #8D8E98;
        }
      }
    }
  }
</style>
