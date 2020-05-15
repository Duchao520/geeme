<template>
  <div>
    <!--标题栏-->
    <header class="bg-f " :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">设置费率</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <span class="icon" style="display: flex;align-items: center">
        <i @click="putInput" v-if="showSave==1" style="font-size: 0.3rem;color:#F7094D;">保存</i>
        <i @click="putInput" v-if="showSave==0" style="font-size: 0.3rem;color:#F7094D;">修改</i>
			</span>
    </header>
    <div :style="'height:'+(status_bar_height+45)+'px'"></div>
    <section class="setShopRate">
        <div class="shop_top">
           <div class="shop_le">
             <img :src="setShopDetail.storeLogo" alt="">
           </div>
           <div class="shop_ri">
              <div class="store_name">
                    {{setShopDetail.storeName}}
              </div>
              <div class="store_address">
               <i class="iconfont icon-dizhi3"></i> {{setShopDetail.address}}
              </div>
           </div>
        </div>
       <div class="shop_line"></div>
       <div class="setRate">
          <div class="set_top" v-if="setShopDetail.isOpenPayChannel==1">
             收银通道已开通
          </div>
          <div class="set_top" v-if="setShopDetail.isOpenPayChannel==0">
             收银通道未开通
          </div>
          <div class="set_inner">
            <span style="font-size: 0.3rem;margin-right:0.2rem;">设置佣金费率 </span>
            <input type="text" v-model="inputRate" @blur="inputChange">
            <span style="font-size: 0.24rem;margin-left:0.2rem;color: #F7094D;">输入范围0.1%~10%</span>
          </div>
          <div class="notice">
            注：此佣金费率为使用共享打折卡消费的订单的抽佣比例。
          </div>


         <div class="set_inner" style="margin-top:20px;">
           <span style="font-size: 0.3rem;margin-right:0.2rem;">设置当面付费率 </span>
           <input type="text" v-model="cuurentRate" @blur="inputChangeSec">
           <span style="font-size: 0.24rem;margin-left:0.2rem;color: #F7094D;">输入范围0%~100%</span>
         </div>
         <div class="notice">
           注：此费率为当面付的费率。
         </div>
       </div>
      <div class="disCount">
        <span style="font-size:0.3rem;margin-right:0.2rem;">共享打折卡折扣</span>
        <span class="discount_style">普通折扣{{setShopDetail.comShareDiscountCardRate}}折</span>
        <span class="discount_style">VIP折扣{{setShopDetail.vipShareDiscountCardRate}}折</span>
      </div>
    </section>

    <v-toast :tip="tip" ref="toast"></v-toast>

  </div>
</template>

<script>
  import {postShopRate} from '@/assets/js/getData'
  import {postColor , getGPS} from "@/assets/js/jsBridge";
  import {rule} from "@/assets/js/deal";
  import {timestampToTime} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        searchState: false, //搜索框显示
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        list: [],//职员列表
        pageNum: 1, //list的页数
        limit: 20,
        state: '',
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        setShopDetail:'',
        inputRate:'',
        showSave:1,
        serviceRateRange:'',
        cuurentRate:'',
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.setShopDetail = _self.$route.query;
        _self.inputRate = _self.setShopDetail.serviceRate *100;
        console.log(_self.setShopDetail);
        // _self.getAgentStaff();
      });
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    },
    mounted() {
      let _self = this;
      // window.addEventListener('scroll', function () {
      //   let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      //   // 判断是否滚动到底部
      //   if ((scrollTop + window.screen.availHeight) >= (document.body.offsetHeight - 100)) {
      //     if (_self.scrollState == true) { //加下状态
      //       _self.scrollState = false;
      //       _self.showLoad = true;
      //       _self.pageNum = _self.pageNum + 1;
      //       setTimeout(() => {
      //         _self.showLoad = false;
      //         _self.getAgentStaff();
      //       }, 1500);
      //     }
      //   }
      // },true);
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      back() {
        var _this = this;
        _this.$router.push({path: '/setStoreList',query:_this.setShopDetail});
      },
      putInput(){
          var _this = this;
          console.log(_this.inputRate);
          let newArr = _this.setShopDetail.serviceRateRange.split('-');
        if(!(/^[0-9]+([.]{1}[0-9]{1})?$/).test(_this.inputRate)){
          _this.tip = '仅可输入一位小数';
          _this.$refs.toast.toast();
        }else if(_this.inputRate< Number(newArr[0])*100){
            _this.tip = '设置费率不小于'+ Number(newArr[0])*100;
            _this.$refs.toast.toast();
            return
          }else if(_this.inputRate > Number(newArr[1])*100){
            _this.tip = '设置费率不超过'+Number(newArr[1])*100;
            _this.$refs.toast.toast();
          }else{
            var _data = {
              token:_this.token,
              storeName:_this.setShopDetail.storeName,
              id:_this.setShopDetail.id,
              shopId:_this.setShopDetail.shopId,
              serviceRate:_this.inputRate /100,
            }
            _this.$getSignIn(_data).then(sec=>{
              postShopRate(_data,sec).then(res=>{
                console.log('看看这个',res);
                if(res.data.state==1){
                  _this.tip = '您的费率设置已提交管理员审核，请关注短信或APP通知';
                  _this.$refs.toast.toast();
                  _this.$router.push({path: '/setStoreList',query:_this.setShopDetail});
                }
              })
            })
          }

      },
      inputChange(e){
        var _this = this;
        let newArr = _this.setShopDetail.serviceRateRange.split('-');

        if(!(/^[0-9]+([.]{1}[0-9]{1})?$/).test(_this.inputRate)){
          _this.tip = '仅可输入一位小数';
          _this.$refs.toast.toast();
        }
        else if(_this.inputRate< Number(newArr[0])*100){
          _this.tip = '设置费率不小于'+ Number(newArr[0])*100;
          _this.$refs.toast.toast();
          return
        }else if(_this.inputRate > Number(newArr[1])*100){
          _this.tip = '设置费率不超过'+Number(newArr[1])*100;
          _this.$refs.toast.toast();
        }
        // window.scroll(0, 0);
        // window.innerHeight = window.outerHeight;”
      },
      inputChangeSec(e){
        var _this = this;
        let newArr = _this.setShopDetail.serviceRateRange.split('-');

        if(!(/^[0-9]+([.]{1}[0-9]{1})?$/).test(_this.inputRate)){
          _this.tip = '仅可输入一位小数';
          _this.$refs.toast.toast();
        }
        else if(_this.inputRate< Number(newArr[0])*100){
          _this.tip = '设置费率不小于'+ Number(newArr[0])*100;
          _this.$refs.toast.toast();
          return
        }else if(_this.inputRate > Number(newArr[1])*100){
          _this.tip = '设置费率不超过'+Number(newArr[1])*100;
          _this.$refs.toast.toast();
        }
        // window.scroll(0, 0);
        // window.innerHeight = window.outerHeight;”
      },

    },

  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/css/partner_base.css';
  /*head*/
  .ico-add {
    display: inline-block;
    height: 44px;
    width: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAMAAAAdgrsPAAAAVFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU4H24AAAAG3RSTlMA2aUV6Jx7h3BWaELh8LY3MMVOCV8pvpTQryLz3xdIAAABVElEQVQ4y52Ti7KCIBCGWUBULl7LMt7/Pc8vWSjBmaZ/xqbFj911L+wgoTlZ6uorK+si/a5bkVE+qiswkz+qykPWn9SXHUXxHFQlkJ0z0OgT5epwT6H+K+jXcDxhZC7xJoEWltE1gRqW03KGxO+9Y2PeUTkrXR66THfLTbbsH7U7ND4tHZ5U3WF4HxyjrnDBnJCZ1bG3rUNUNAe7oSJiVjRCOw+pEJmGWTdCdHF1zBZpQJDGcfMsLX/lWe9Lyd8fLlyz/SJwy9RW+AHn0wbLWGaCwzASNcq23nARb+m4lFVInWZA8CpHBlvAIFyICnw4X7GIhPLCUIB8KpzrLUHjafE1nGWhiYkLYepakor18D+coFhw8yqBDmXzn7puEyGn4cb7fgzzt35Cd3iil+F0HJB0eGeFZWjxV+w9qexHWg/GBhOet+Ze13y5k5XOOSktUX0a8j9bwz6BDaFvbQAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 100% auto;
    margin-right: 10px;
  }

  .ico-select {
    display: inline-block;
    height: 44px;
    width: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMA74CakxOf+ah7BYYNMBrnjP0BhAEAAACUSURBVEjH7dJBDsIwDETRaeo4gbZA739ZJDaoxmbqDUJq/3r0FCnGwdI2+DXFZ8satcCpB2OF1y1YV7h1SnO8IkidsSCqEprghmZ4m/Gl0awfQALf0AyfgP14u4Ikhia4T3P8At5saIq/aV4dXuP7hmbXUrAvcR7C/rOc6x+te2o9mTXDU2uMqTXEXBWprIJEKvjnng2uGd6bbMyqAAAAAElFTkSuQmCC) no-repeat center;
    background-size: 100% auto;
    margin-right: 10px;
  }

  .ico-search {
    display: inline-block;
    height: 44px;
    width: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 18px 18px;
  }

  .ico-history {
    display: inline-block;
    width: 20px;
    height: 44px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAlBAMAAAAzRe0NAAAAMFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/f0AAAD////ExMT09PTFxcUmJiYu70IaAAAACnRSTlMAj/nXliruvOHFUs3iSgAAAJdJREFUKM9jYMxahQSWCTCAgNQqFLAQLAhRiFAKFlyFBkgXPL0bCvYQEiRs5jBzUgNQAN32nazCSoYB6IJeQN4SVO0L2MFUAYpggxeYWoIiyKq1atW9VasWBSALMgLxPSAWQBZkhgoaIAsyQQUVUATXg9y1FyaIqR3TIoJOavACCy7B4c0s5LCEBYgUslJo0KGmeQNIGAMAfKWW0W9pe2wAAAAASUVORK5CYII=) no-repeat center;
    background-size: 100% auto;
  }


  header .search-box input {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .search-input {
    background: #fff url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat left 10px center;
    background-size: 15px;
    border-radius: 30px;
    width: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    margin: 5px auto 10px;
    padding: 4px 10px 4px 40px;
    height: 30px;
    line-height: 1.5;
  }


  .btn-quit {
    padding: 5px;
    border-radius: 4px;
  }


  /*小图标*/
  .ico {
    display: inline-block;
    height: 14px;
    min-width: 10px;
    background: #ccc;
    vertical-align: unset;
    margin-left: 5px;
  }

  .ico-girl {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAARVBMVEUAAAD/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4tAlKIwAAAAFnRSTlMAv7AN9SdA4Y6aWMpq0oFionJNGuoykD4KbAAAAPlJREFUOMvdkttyhCAQRGG4CCjgbfv/PzVgmWzUgcpr9rxIFYe2aqbFh2ImGqN0q+paahlwoMn2wka8WdpaDZMOJ67lRRTMgm8yrx1BWoQfT2+ctmkUBiE8un+eUEnlFOj0Bm46MwpSnVOUNV2/GE+WC/8OML6YgfFG0PW51chsXrotR2NlPA8pLlhow3gBMLeHI9uBAfNli8AkOPLlQkVEwUO/xE0CttW+ckdHQ03a6/Ca+LosSVGXjxUdLO2ojEmJPpsNeX11lSwL5J1zM9Xj0urpnZnTzEPjJ5MYz7Nre7IrpgYcgakpBz0GDBZtnx34UyAaDOJ/8AUAzh+TTx9NgwAAAABJRU5ErkJggg==) no-repeat center;
    background-size: auto 100%;
  }

  .ico-man {
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAASFBMVEUAAAAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheDjj8WMAAAAF3RSTlMAyL2tCOGOXzgm96FpVkpC79KYhHEZEgtRKNwAAADDSURBVDjL3dPLEoMgDIVhIAS8IN7N+79pO25syZFx2/4rF9/EmQDmT2sT2dmF7KvKbyxnHTW1YVautnvG8tl699NZvovYBSnqdsT2ScoCcklUjLbTa9eh5TjRDcBZ4OLDeRm4RbOpBW7QzsLjYOWSQcWSzd7AqHCNwXmrl4LhcinOptJIfCq7HqbePg4xN1WSnHWOlhBCT+79vT28p9Ij1opuBG5VCg48GLjpQKf26KJa6MiXC1YEvxASHBVObmLzG70AZiYt8xZFIsYAAAAASUVORK5CYII=) no-repeat center;
    background-size: auto 100%;
  }

  .ico-phone {
    height: 15px;
    width: 15px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAYFBMVEUAAAD3CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU33CU2f/8QNAAAAH3RSTlMAFaTz6NxwQLWTMAzj18u+mYNiXFVLNwfPqZ6KIXke42QBUgAAAM9JREFUOMuN1NkSgjAMQNEApSxlU3ZB8/9/6ShtIw4JnOc7QyCl8GH0rEHWKUScAilZ8KsQojtaMZuMETohOwySnGkyJBnTNEhqptFIUqbJkQzAmHySAJw8LBqAZfzXEYTupQSrH0eQ2oGM0LxwU4El7WOWosgvjNejdROix5WovBAF/jguYEn7b9xBr6vwb4cJHSND/0ITMFHRAbS4Uf3+ccpXcYleux+8wiOH50RuQPMNSeLzBka3F/Ee6MvfRDH3ybOgZAXG2IbbXGkA8AY2DC9+ehlDvgAAAABJRU5ErkJggg==) no-repeat center;
    background-size: auto 100%;
  }

  /*list-con*/
  .list-con {
    margin-left: 10px;
    padding: 15px 15px 15px 80px;
  }

  .list-con img {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 6px;
    top: 12px;
    border-radius: 50%;
  }

  .con-title {
    line-height: 47px;
  }

  .list-con > p:not(.con-title) {
    line-height: 23px;
  }

  .percentage {
    display: inline-block;
    width: 45px;
    border-radius: 19px;
    height: 19px;
    line-height: 19px;
    text-align: center;
  }

  .border-buttom.list-con:last-of-type:before {
    content: none;
  }

  /*筛选条件*/
  .select-box {
    position: fixed;
    width: 100%;
    top: 44px;
    z-index: 8;
  }

  .select-box ul {
    padding: 10px 0;
  }

  .select-box li {
    padding: 0 10px;
  }

  .select-box li input[type="radio"]:checked + label:after {
    content: none;
  }

  .tab-con input[type="radio"] {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .select-box li input[type="radio"]:checked ~ .icon-gou {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAD3CEz3CEz/AE7/AEr3CEz5Bkz2CUz3CEz4B0z5Bkz3CE33CEv3CEz3CEz4B0v2CUz3CU0WS5bBAAAAEXRSTlMA9uUJFZpPz8OMJXta2qhtsgEYyOEAAADMSURBVDjLhZNbDsUgCEQHEfX27f43exNtxLYa5qdNziAiABWHIzoiF4/A+MoL5SYS/8K8VqyWlR/hKX+UvPLF5YHc0uIr/zr8nT/miWK9xy9P9SsJaG4gD0DGsWe5mAA8PGAD1nIEI0w4rvIXICOumQXprpl6rqUl7OV7sW+vEfrSd9TIFfBxwDOB2rtzUq6GkkIdFFAL1BQpd45LebukvLt75l6C0PdfuZbEpA7/4cSPZrnt3Xox220NjDly1tCaY28vjr169vKa6/8HLvot+ZG8C7AAAAAASUVORK5CYII=) no-repeat center;
    background-size: cover;
    position: absolute;
    right: 10px;
    top: 7px;
  }
  .setShopRate{
    background:#fff;
    /*padding-top:0.9rem;*/
    .shop_top{
      width:7.1rem;
      padding:0.2rem 0.2rem;
      background:#ffffff;
      display: flex;
      /*align-items: center;*/
      justify-content: space-between;
      .shop_le{
        width:1.5rem;
        height:1.5rem;
        display: block;
        background:#fff;
        margin-right:0.2rem;
        border-radius: 0.05rem;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .shop_ri{
        width: 5.4rem;
        /*height:1.5rem;*/
        .store_name{
          font-size: 0.36rem;
          margin-bottom:0.34rem;
        }
        .store_address{
          font-size: 0.28rem;
          color:#8D8E98;
        }
      }
    }
    .shop_line{
      width:100%;
      height:0.2rem;
      background:#eeeeee;
    }
    .setRate{
      width:7.1rem;
      padding:0 0.2rem;
      border:1px solid  #E5E5E5;
      padding-bottom:0.4rem;
      .set_top{
        font-size: 0.34rem;
        margin-top:0.34rem;
        margin-bottom:0.5rem;
      }
      .set_inner{
        display: flex;
        align-items: center;
        input{
          width:1.9rem;
          height:0.6rem;
          border:1px solid rgba(141,142,152,1);
          vtical-align:middle;
          caret-color:red;
          padding:0 0.1rem;
          font-size: 0.3rem;
        }
      }
      .notice{
        font-size: 0.24rem;
        color:#8D8E98;
        margin-top:0.27rem;
      }
    }
    .disCount{
      height:1.2rem;
      display: flex;
      align-items: center;
      padding:0 0.2rem;
      .discount_style{
        font-size: 0.2rem;
        padding:0.06rem 0.1rem;
        border:1px solid #D0976D;
        border-radius: 0.05rem;
        background:linear-gradient(180deg,rgba(208,151,109,1) 0.78125%, rgba(92,29,14,1) 100%);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
        margin-right:0.1rem;
      }
    }
  }


</style>
