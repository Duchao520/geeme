<template>
  <div class="bargin-goods">
    <router-link to="/bargainRules" tag="p" class="slogan fc-ffffff fz-30">活动规则</router-link>
    <div class="flex_box" style="border-bottom: .02rem dashed #E5E5E5;padding-bottom: .21rem;margin-bottom: .27rem">
      <i class="iconfont icon-huore fc-FEB623 fz-32"></i>
      <p style="width: 6.4rem" class="txt-overflow fz-30 fc-0D0D0F">
        {{biBargain.title}}
      </p>
    </div>
    <router-link :to="{name: 'goodsDetail',query: {bargainTasksId: bargainTasksId,bargainId: bargainId}}" tag="div" class="goods flex_box justify_space_between"
         style="margin-bottom: .55rem">
      <img v-lazy="biBargain.mainImg" alt="" class="thumb">
      <div class="detail flex_box flex_column">
        <p class="txt-overflow fz-30 fc-0D0D0F" style="margin-bottom: .18rem;height: .8rem">{{biBargain.copywritingTitle}}</p>
        <v-progress :rate="$accMul($accDiv(Number($Subtr(biBargain.shareNum,biBargain.surplusShareNum)),Number(biBargain.shareNum)),100) + '%'"
                    :progressBg="'#4045D5'"></v-progress>
        <div class="flex_box justify_space_between fz-24 fc-8D8E98"
             style="margin-bottom: .16rem">
          <p>已领{{$Subtr(biBargain.shareNum,biBargain.surplusShareNum)}}份</p>
          <p>剩余{{$accMul(biBargain.surplusShareNum,1)}}份</p>
        </div>
        <p class="flex_box" style="align-items: flex-end">
          <span class="iconfont icon-renminbi fz-38 fc-F7094D"
                style="margin-right: .12rem">{{Number($accMul($accMul(Number(biBargain.price),Number(biBargain.discount)),0.1)).toFixed(2)}}元</span>
          <span class="fz-30 fc-8D8E98"
                style="text-decoration: line-through">{{Number($accMul(Number(biBargain.price),1)).toFixed(2)}}元</span>
        </p>
      </div>
    </router-link>
    <p class="fz-38 text-center font-weight"
       style="margin-bottom: .18rem" v-if="btnIndex == 0">
      已砍<span class="fc-F7094D">{{$accMul(Number(detail.helpedPrice),1)}}</span>元,还差<span class="fc-F7094D">{{$Subtr(Number(detail.taskPrice),Number(detail.helpedPrice))}}</span>元
    </p>
    <p v-else-if="btnIndex == 1" class="fz-38 text-center font-weight">人多“利”量大，成功砍到价</p>
    <p v-else-if="btnIndex == 2" class="fz-38 text-center font-weight">少侠晚来一步，该活动已结束</p>
    <v-progress :rate="$accMul($accDiv(Number(detail.helpedPrice),Number(detail.taskPrice)),100)+'%'"
                :height=".15"
                :progressBg="'#F7094D'"
                v-if="btnIndex == 0 || btnIndex==1"></v-progress>
    <button class="fz-34 fc-ffffff"
            style="margin-top: .83rem" @click="btnEvent(btnIndex)">{{btns[btnIndex].btnContent}}</button>
    <p class="fz-24 fc-8D8E98 text-center" v-show="btnIndex == 0">砍价成功，可在<span class="fc-F7094D">【首页】-【卡友帮】</span>查看</p>

  </div>


</template>

<script>
  import vProgress from '@/components/common/v-progress'
  import {bargainDetail , openBargain , getqrCode} from "@/assets/js/comm";
  import {postGoodsUrl , callAppMethod , postImgAndroid,
    postTitleAndroid,postShareContentIOS} from "@/assets/js/jsBridge";
  import {retRound} from "@/assets/js/share_txt";

  export default {
    name: "bargin-goods",
    props: ['tokenPromise'],
    components: {
       vProgress ,
    },
    data(){
      return{
        token: '',
        bargainTasksId: this.$route.query.bargainTasksId,
        bargainId: this.$route.query.bargainId,
        status: this.$route.query.status,
        storeId: this.$route.query.storeId,
        detail: '',
        biBargain: '',
        btns: [
          {
            btnContent: '喊好友砍一刀'
          },
          {
            btnContent: '领取兑换核销码'
          },
          {
            btnContent: '查看更多砍价活动'
          }
        ],
        btnIndex: 0,
        barginDetailMes:'',
        isShow:'',
        qrCode:'',
      }
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
      })
    },
    methods: {
      init(){
        var _self = this;
        _self.bargainIng()
      },
      bargainDetail(callback){
        var _self = this;
        var _data = {
          token: String(_self.token),
          bargainTasksId: String(_self.bargainTasksId ? _self.bargainTasksId : ''),
          bargainId: String(_self.bargainId)
        };
        bargainDetail(_data).then(res => {
          if(res.data.state == 1){
            _self.$emit('handleGoods',res.data.data);
            callback ? callback() : '';
            _self.detail = res.data.data;
            _self.biBargain = res.data.data.biBargain;
            _self.barginDetailMes = res.data.data;
            _self.getqrCodeMes();
            switch (true) {
              case (_self.detail.isSuccess == 0):
                var shareContent = {
                  title: _self.biBargain.title,
                  imageUrl: _self.biBargain.mainImg
                };
                postShareContentIOS(shareContent);
                postTitleAndroid(_self.biBargain.title);
                postImgAndroid(_self.biBargain.mainImg);
                postGoodsUrl('/pages/packageC/pages/cutFree/main?bargainId=' + _self.bargainId + '&bargainTasksId=' + _self.bargainTasksId + '&storeId=' + _self.storeId + '&status=4');

                _self.btnIndex = 0;
                break;
              case (_self.detail.isSuccess == 1):
                _self.btnIndex = 1;
                break;
              case (_self.detail.isSuccess == 2):
                _self.btnIndex = 2;
                if(res.data.data.biCardcouponactive){
                  _self.$emit('alertEvent',4)
                }else if(res.data.data.biSvipcardshare){
                  _self.$emit('alertEvent',2,1)
                }
                break;
              default:
                _self.btnIndex = 2;
            }
          }else{
            _self.$emit('toast',decodeURIComponent(res.data.msg));
          }
        })
      },
      // poster(){
      //   var _self = this;
      //   _self.$refs.poster.get2D();
      //   _self.isShow= 3;
      // },
      /**
       * 处理进行中的活动
       */
      bargainIng(){
        var _self = this;
        if(_self.status == 1){
          _self.bargainDetail();
        }else{
          _self.openBargain();
        }
      },
      openBargain(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          bargainId: String(_self.bargainId),
          storeId: String(_self.storeId)
        };
        openBargain(_data).then(res => {
          if(res.data.state == 1){                                   //开团成功
            var json = res.data.data;
            _self.bargainTasksId = json.bargainTasksId;
            _self.bargainDetail(function () {
              _self.$emit('alertEvent',1);
            });
            _self.$emit('handleBargainDetail',json);
          }else if(res.data.state == 916410){                        //活动已结束
            _self.bargainDetail();
            _self.$emit('alertEvent',2);
          }else if(res.data.state == 916411){           //活动正在进行
            _self.bargainTasksId = res.data.data;
            _self.bargainDetail();
          }else{                                                 //异常
            _self.bargainDetail();
            _self.$emit('toast',decodeURIComponent(res.data.msg));
          }
        })
      },
      getqrCodeMes(){
        var _self = this;
        console.log(_self.detail);
        var _data = {
          scene:'cF,4,'+_self.detail.bargainId+','+_self.detail.id+','+_self.detail.biStaffUserName,
          qrCodeType: 6
        }
        console.log(_data);
        getqrCode(_data).then(res=>{
          if(res.data.state == 1){
            _self.detail.qrCode = res.data.qrCode;
            _self.$emit('handleDetail',_self.detail);
          }else{
            _self.$emit('toast',decodeURIComponent(res.data.msg));
          }
        })
      },
      btnEvent(index){
        var _self = this;
        switch (index) {
          case 0:
            _self.$emit('showShareBtn');
            break;
          case 1:
            _self.$router.push({
              name: 'checkSale',
              query: {
                bargainTasksId: _self.bargainTasksId
              },
              params: {
                detail: _self.detail
              }
            });
            break;
          case 2:
            _self.$router.push({
              name: 'activeBargain'
            });
            break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bargin-goods{
    width: 100%;
    /*height: 6.12rem;*/
    border-radius: .2rem;
    background: #FFFFFF;
    box-shadow:0 .01rem .32rem .06rem rgba(254, 171, 193, 1);
    box-sizing: border-box;
    padding: .27rem .17rem;
    margin-bottom: .4rem;
    position: relative;
    .slogan{
      position: absolute;
      right: -.2rem;
      top: -.6rem;
      padding: .05rem .14rem;
      background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
      border-radius:.25rem 0 0 .25rem;
    }
    .goods{
      .thumb{
        display: block;
        width: 2rem;
        height: 2rem;
        border-radius: .1rem;
      }
      .detail{
        width: 4.54rem;
      }
    }
    button{
      display: block;
      width: 100%;
      height: .9rem;
      border-radius: .2rem;
      box-sizing: border-box;
      border: .08rem solid #F7094D;
      background:linear-gradient(0deg,rgba(237, 41, 102, 1),rgba(252, 83, 133, 1));
      box-shadow:0 .01rem .32rem .06rem rgba(254, 216, 227, 1);
    }
    .slide_down_up-enter-active {
      animation: slideInUp .2s;
    }

    .slide_down_up-leave-active {
      animation: slideOutDown .2s;
    }
    .vShare {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(12, 12, 12, .5);
      z-index: 100;

      footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-radius: .2rem .2rem 0 0;
        background: #FFFFFF;
        .close{
          width: .55rem;
          height: .55rem;
          position: absolute;
          right: .28rem;
          top: -.74rem;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
          button{
            position: absolute;
            top: 0;
            right: 0;
            width: .55rem;
            height: .55rem;
          }
        }
        .btn-container {
          box-sizing: border-box;
          padding: .39rem .62rem;
          display: flex;
          justify-content: space-between;
          border-bottom: .01rem solid #E5E5E5;

          .btn-group {
            position: relative;
            i {
              display: block;
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              margin: 0 auto;
              margin-bottom: .15rem;
              font-size: .64rem;
              text-align: center;
              line-height: 1rem;
            }

            img{
              display: block;
              width: .9rem;
              height: .9rem;
              padding: .05rem;
              border-radius: 50%;
              margin: 0 auto;
              margin-bottom: .15rem;
            }

            .icon-weixin {
              background: #4AB218;
              color: #FFFFFF;
            }

            .icon-erweima {
              background: #F60F51;
              color: #FFFFFF;
            }

            .icon-tupian {
              background: #00A0E9;
              color: #FFFFFF;
            }

            p {
              font-size: .24rem;
              color: #8D8E98;
            }
            button{
              position: absolute;
              display: block;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
            }
          }
        }

        .btn_class {
          display: block;
          width: 100%;
          height: 1rem;
          font-size: .36rem;
          color: #8D8E98;
        }

      }
      .qrCode{
        height: 8.48rem;
        box-sizing: border-box;
        padding: .41rem .61rem;
        .flex{
          display: flex;
          align-items: center;
          margin-bottom: .96rem;
          img{
            display: block;
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
            background: #0e90d2;
            margin-right: .41rem;
          }
          span{
            font-size: .36rem;
          }
        }
        .miniProgram-code{
          display: block;
          width: 4.5rem;
          height: 4.5rem;
          margin: 0 auto;
          background: #0c8deb;
          margin-bottom: .57rem;
        }
        .slogan{
          color: #AF7651;
          font-size: .36rem;
          text-align: center;
        }
      }

      .savePic{
        background: #EEEEEE;
        height: 10.46rem;
        box-sizing: border-box;
        padding-top: .81rem;
        .pic{
          width: 4.27rem;
          height: 7.59rem;
          box-shadow:0 .11rem .35rem 0 rgba(194,194,194,0.41);
          border-radius: .2rem;
          margin: 0 auto;
          background: #FFFFFF;
          margin-bottom: .41rem;
        }
        .btn_save{
          display: block;
          width: 4.71rem;
          height: .91rem;
          border-radius: .07rem;
          background: #F7094D;
          font-size: .41rem;
          color: #FFFFFF;
          margin: 0 auto;
          margin-bottom: .16rem;
        }
        .slogan{
          color: #8D8E98;
          font-size: .3rem;
          text-align: center;
        }
      }
    }
    .slide_down_up-enter-active {
      animation: slideInUp .2s;
    }

    .slide_down_up-leave-active {
      animation: slideOutDown .2s;
    }
  }
</style>
