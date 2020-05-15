<template>
  <div>
    <!--标题栏-->
    <header class="bg-f " :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">商家门店</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <span class="icon" style="display: flex;align-items: center">
        <i class="ico-search" @click="showSearch"></i>
			</span>
      <!--搜索-->
      <div class="search-box bg-f" v-show="searchState">
        <form action="javascript:return true;">
          <input type="search bg-f" placeholder="请输入门店名称" @keyup.13="searchStaff" v-model="nameOrPhone"
                 ref="input1"/>
          <button type="button" class="fz15" @click="hideSearch">取消</button>
        </form>
      </div>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <section class="shop_list">
      <ul class="eve_mes" v-if="list.length!=0">
        <li v-for="(item,index) in list" :key="index">
          <div class="eve_le" @click="gosetShopRate(item)">
            <div class="Invalid" v-if="item.isEffect!=1">
              <img src="@/assets/imgs/partnerCenter/Invalid.png" alt="">
            </div>
            <div class="eve_img">
              <img :src="item.storeLogo" alt="">
            </div>
            <div class="eve_title">
              <div class="eve_top">{{item.storeName}}</div>
              <div class="eve_bot">
                <div class="eve_inner" v-if="item.isOpenPayChannel==1">
                    已开通收银
                </div>
                <div class="eve_inner" v-if="item.isOpenPayChannel==0">
                    未开通收银
                </div>
                <div class="eve_inner" v-if="item.isEffect==1">
                    佣金费率{{(item.serviceRate *100)}}%
                </div>
                <div class="eve_inner" v-if="item.isEffect==1">
                    普通折扣{{item.comShareDiscountCardRate}}折
                </div>
                <div class="eve_inner" v-if="item.isEffect==1">
                    VIP折扣{{item.vipShareDiscountCardRate}}折
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="eve_mes" v-if="list.length==0">
        <div class="noData">
          <img src="@/assets/imgs/common/nodata.png" alt="">
          <!--<span>暂无数据</span>-->
        </div>
      </ul>
    </section>
    <!--职员列表-->

    <!--筛选条件-->

    <v-toast :tip="tip" ref="toast"></v-toast>

  </div>
</template>

<script>
  import {getStoreList} from '@/assets/js/getData'
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
        limit: 10,
        nameOrPhone: '',
        state: '',
        Gender: '',
        beginhireDate: "",
        endhireDate: "",
        begintime: '',
        endtime: '',
        count: 0,
        promoteCount: 0,
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        setShopDetail:'',
        longitude:'',
        latitude:'',
        serviceRateRange:'',
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.push({path: '/setShopList'}); //返回服务商中心
        //this.$router.go(-1);//返回上一层
      },
      goStoreList(){
        this.$router.push({path: '/partnerCenter'});
      },
      //点击显示搜索框
      showSearch() {
        this.searchState = true;
      },
      //点击隐藏搜索框
      hideSearch() {
        this.searchState = false;
        var _self = this;
        _self.nameOrPhone = '';
        _self.pageNum = 1;
        _self.list=[];
        _self.getAgentStaff();
      },
      //点击键盘搜索键，搜索内容
      searchStaff() {
        let _self = this;
        _self.$refs.input1.blur();
        if (rule.empty(_self.nameOrPhone, "搜索内容不能为空")) {
          _self.pageNum = 1;
          _self.list=[];
          _self.getAgentStaff();
        }
      },
      gosetShopRate(item){
        var _this = this;
        item.serviceRateRange = _this.serviceRateRange;
        _this.$router.push({path: '/setShopRate', query: item});
      },
      //重置时间输入框内容
      resetTime() {
        this.endtime = '';
        this.begintime = '';
      },
      /*获取职员列表信息*/
      getAgentStaff() {
        let _self = this;
        let shopId = _self.setShopDetail.shopId ?_self.setShopDetail.shopId :_self.setShopDetail.id;
        let _data = {
          token: _self.token,
          pageNum: _self.pageNum, //list的页数
          pageSize: _self.limit,
          shopId:shopId,
          longitude:_self.longitude,
          latitude:_self.latitude,
          storeName: _self.nameOrPhone ? _self.nameOrPhone :'',
        };
        _self.$getSignIn(_data).then(sec => {
          getStoreList(_data,sec).then(res => {
            let _data = res.data.nearbyStores;
            if (res.data.state == 1) {
              _self.list = _self.list.concat(_data);
              _self.serviceRateRange = res.data.serviceRateRange;
              if(_self.list.length==0){

              }
            } else {
              _self.toast(decodeURIComponent(res.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.setShopDetail = _self.$route.query;
        getGPS().then(res=>{
          _self.longitude = res.LONG;
          _self.latitude = res.LAT;
          _self.getAgentStaff();
        })

      });
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
    },
    mounted() {
      let _self = this;
      window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        // 判断是否滚动到底部
        if ((scrollTop + window.screen.availHeight) >= (document.body.offsetHeight - 100)) {
          if (_self.scrollState == true) { //加下状态
            _self.scrollState = false;
            _self.showLoad = true;
            _self.pageNum = _self.pageNum + 1;
            setTimeout(() => {
              _self.showLoad = false;
              _self.getAgentStaff();
            }, 1500);
          }
        }
      },true);
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
  .shop_list{
    width:7.1rem;
    padding:0 0.2rem;
    /*padding-top:0.9rem;*/
    .eve_mes{
      width:100%;
      padding-top:0.2rem;
      li{
        width:100%;
        height: 1.88rem;
        display:flex;
        align-items: center;
        border-bottom:0.02rem solid rgba(160,160,168,0.4);
        padding: 10px 0;
        overflow: hidden;
        .eve_le{
          position: relative;
          .Invalid{
            position: absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
            background:#ffffff;
            opacity: 0.6;
            z-index: 99;
            img{
              position: absolute;
              display: block;
              width:1rem;
              height:1rem;
              float: right;
              right:0.9rem;
              top:0.3rem;
              opacity: 1;
              z-index: 100;
            }
          }
          .eve_img{
            width:1.44rem;
            height:1.44rem;
            display: block;
            margin-right:0.2rem;
            border-radius: .05rem;
            float: left;
            img{
              width:100%;
              height:100%;
              display: block;
              border-radius: .05rem;
            }
          }
          .eve_title{
            font-size:0.34rem;
            float: left;
            width:5.4rem;
            .eve_top{
              margin-bottom:0.16rem;
            }
            .eve_bot {
              overflow: hidden;
              display: flex;
              flex-wrap: wrap;
              .eve_inner {
                padding:0.02rem 0.1rem;
                margin-right:0.1rem;
                margin-bottom:0.1rem;
                font-size: 0.2rem;
                border: 1px solid #D0976D;
                color: rgba(255, 115, 21, 1);
                background: linear-gradient(180deg, rgba(208, 151, 109, 1) 0.78125%, rgba(92, 29, 14, 1) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                border-radius: 0.05rem;
              }
            }
          }
        }
      }
      .noData{
        width:100%;
        display:flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        align-items:center;
        font-size: 0.38rem;
        margin-top:3rem;
        img{
          width:5.14rem;
          height:3.72rem;
          margin-bottom:0.2rem;
        }
      }
    }
  }


</style>
