<template>
  <div class="actCodeRecord">
    <toast ref="toast" :tip="tip"></toast>
    <v-head :title="'商家激活码'"></v-head>
    <div class="mine-container" :style="{top: 1.04 + status_bar_height + 'rem'}">
      <div class="mine">
        <div class="mineCode">我的商家激活码</div>
        <div class="total" style="margin-bottom: .24rem">
          <div class="total-item">当前可用<span>{{total.unused_codes}}</span></div>
          <div class="total-item">累计激活<span>{{total.used_codes}}</span></div>
          <button @click="getCode">获取单个激活码</button>
        </div>
        <p class="fc-8D8E98 fz-24 flex_box align_center" style="justify-content: center" @click="showCodeConfirm">点击获取更多激活码<i class="iconfont icon-youjiantou1"></i></p>
      </div>
    </div>
    <div class="bag-scroll" ref="myScroll">
      <div class="scroll-container">
        <div :style="{height: 4.1 + status_bar_height + 'rem'}"></div>
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
    <keyboard-num @keyDownEvent="keydown"
                  @backSpaceEvent="backSpace"
                  @submitEvent=""
                  ref="keyboard">
    </keyboard-num>
    <transition name="alertMsg">
      <div class="alert" @click="showKeyBoard(0)" v-show="codeConfirm">
        <div class="module box_padding" style="padding: .85rem .33rem .43rem;height: 4.71rem;" v-if="codeConfirm">
          <div class="close"><img src="@/assets/imgs/common/close.png" alt="" @click="close"></div>
          <p class="fz-32 font-weight text-center" style="margin-bottom: .86rem">您当前最多可获取{{total.unused_codes}}个激活码</p>
          <div class="inputContainer" style="margin-bottom: .46rem" @click.stop="showKeyBoard">
            <p class="fz-32 flex_box align_center">
              <span class="fc-000000" v-if="codeTotal">{{codeTotal}}</span>
              <i class="focus" :class="{'bg-F60F51': focusFlag1}"></i>
              <span class="fc-8D8E98" v-if="!codeTotal">请输入激活码数量</span>
            </p>
          </div>
          <div class="flex_box justify_space_between confirm">
            <button class="fz-36 fc-ffffff bg-FEB623" @click="close">取消</button>
            <button class="fz-36 fc-ffffff bg-F7094D" @click="getMoreCode">确定</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {getSignIn , postTitle , timestampToTime} from "@/assets/js/jsBridge";
  import {activecodeAmount , activeCodeRecord , activeCode , getMoreCode} from "@/assets/js/comm";
  import {CODELIST} from "@/assets/js/deal";
  import vHead from "@/components/common/v-head"
  import toast from "@/components/common/toast";
  import keyboardNum from '@/components/common/keyboardNum';
  import BScroll from 'better-scroll';

  export default {
    name: "actCodeRecord",
    props: ['tokenPromise'],
    components: {
      toast,
      vHead,
      keyboardNum
    },
    data(){
      return{
        token: '',
        tip: '',
        total: '',
        pageNum: 0,
        pageSize: 6,
        record: [],
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height)/100 : 0,
        codeConfirm: false,
        focusFlag1: false,
        focusTimer: '',
        codeTotal: ''
      }
    },
    methods: {
      close(){
        this.codeConfirm = false;
      },
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
              _self.toast(decodeURIComponent(res.data.msg));
            }
          })
        })
      },
      getMoreCode(){
        var _self = this;
        if(Number(_self.codeTotal)){
          var _data = {
            token: String(_self.token),
            agActivecodeNum: String(_self.codeTotal)
          };
          _self.$router.push({
            name: 'getActCodeList',
            query: {
              agActivecodeNum: _self.codeTotal
            }
          })
        }else{
          _self.toast('请输入激活码数量');
        }
      },
      showCodeConfirm(){
        var _self = this;
        if(_self.total.unused_codes <= 0){
          _self.toast('可生成激活码数量不足')
        }else{
          _self.codeConfirm = true;
        }
      },
      /**
       * 键盘
       */
      keydown(num){
        var _self = this;
        if(num != '.'){
          var codeTotal = _self.codeTotal + num;
          if(Number(codeTotal) <= _self._self.total.unused_codes){
            _self.codeTotal = codeTotal;
          }
        }
      },
      backSpace(){
        var _self = this;
        _self.codeTotal = _self.codeTotal.slice(0,-1);
      },
      showKeyBoard(status){
        var _self = this;
        if(status){
          _self.$refs.keyboard.isShowKeyboard(1);
          _self.focus();
        }else{
          _self.$refs.keyboard.isShowKeyboard(0);
          clearInterval(_self.focusTimer);
          _self.focusFlag1 = false;
        }
      },
      /** 模拟input框获取焦点*/
      focus(){
        var _self = this;
        clearInterval(_self.focusTimer);
        _self.focusTimer = setInterval(() => {
          _self.focusFlag1 = !_self.focusFlag1;
        },500)
      },
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
      _self.$getParterToken().then(res => {
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
      top: 1.04rem;
      left: 0;
      box-sizing: border-box;
      padding: .39rem .25rem;
      width: 100%;
      background: #FFFFFF;
      z-index: 10;
      .mine{
        width: 100%;
        height: 2.27rem;
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
              margin-left: .16rem;
              color: #F70A4D;
            }
          }
          button{
            font-size: .28rem;
            color: #FFFFFF;
            display: block;
            width: 2.38rem;
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
    .alert{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 50;
      background: rgba(12,12,12,.5);
      .module{
        width: 6rem;
        border-radius: .2rem;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background: #FFFFFF;
        .close{
          width: .55rem;
          height: .55rem;
          position: absolute;
          right: -.28rem;
          top: -.8rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .inputContainer{
          width: 100%;
          height: .9rem;
          line-height: .9rem;
          box-sizing: border-box;
          padding-left: .28rem;
          border: .02rem solid #E5E5E5;
        }
        .confirm{
          button{
            width: 2.5rem;
            height: .8rem;
            border-radius: .1rem;
          }
        }
      }
    }
  }
</style>
