<template>
  <div class="drawRecord" :class="{bg : list.length==0}">
    <div class="noData" v-if="list.length==0">
      <img style="margin-bottom:30rpx;" src="../../static/img/empty.png" alt="">
      暂无中奖记录~
    </div>
    <div class="mask" v-show="award_show">
      <div class="tan_box">
        <img :src="award.img" alt="">
        <p>{{award.goodsName}}</p>
        <div class="btn" @click="get_award(award.goodsId)">立即领取</div>
        <div class="close" @click="close_cli"></div>
      </div>
    </div>

    <div class="drawRecord-item" v-for="(item,index) in list" :key="index" @click="targetHref(item)">
      <div class="thumb">
        <img :src="item.inventoryImg" alt="">
      </div>
      <div class="detail">
        <div class="first">
          <div class="awardName">{{item.goodsName}}</div>
          <div class="right">
            <div class="status" :class="{notGet: !item.state}">{{item.state   ? '已领取' : '未付款'}}</div>
            <div class="state">{{item.stateMsg}}</div>
          </div>
        </div>
        <div class="second">抽奖时间 : {{item.createTime}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn ,toDate} from '@/common/js/comm'
  import Tips from '@/common/js/tips'

  import { mapMutations } from 'vuex'
  import { ORDERNUM }  from '@/store/mutation-types'

  export default {
    name: "drawRecord",
    data(){
      return{
        list: [],
        award_show: false,
        award: '',
        imgDomain: '',
        token: '',
        tip: '',
        pageNum:1,
      }
    },
    methods: {
      ...mapMutations({
          orderNum:'ORDERNUM',
      }),
      close_cli() {
        this.award_show = false;
      },
      init(){
        let _self = this;
        _self.getRecord();
      },
      /*获取抽奖记录*/
      getRecord(){
        let _self = this;
        let _data = {
          token:_self.$store.state.token,
          // token:'0bcb3f032cbf48e285d59ade85e1dc67',
          pageNum:_self.pageNum,
          pageSize:10
        };
        getSignIn(_data).then(sec => {
          _self.$http.getConverRecord(_data,sec).then(res => {
            if(res.state == 1){
              _self.list = _self.list.concat(res.data);
              if(_self.list.length == 0){
                Tips.toast('暂无中奖记录','none');
              }
              _self.list.forEach(ele => {
                switch (ele.orderState) {
                  case 0:
                    ele.stateMsg = '已取消';
                    break;
                  case 1:
                    ele.stateMsg = '待付款';
                    break;
                  case 2:
                    ele.stateMsg = '待发货';
                    break;
                  case 3:
                    ele.stateMsg = '待收货';
                    break;
                  case 4:
                    ele.stateMsg = '交易成功';
                    break;
                  case 5:
                    ele.stateMsg = '交易完成';
                    break;
                  case 6:
                    ele.stateMsg = '申请退货';
                    break;
                  case 7:
                    ele.stateMsg = '退款成功';
                    break;
                  case 8:
                    ele.stateMsg = '退款关闭';
                    break;
                }
                ele.createTime = toDate(Number(ele.createTime)*1000);
              })
            }
          })
        })
      },
      /*点击*/
      targetHref(item){
        let _self = this;
        this.orderNum(item.orderNum);
        if(item.orderState == 1){
          wx.navigateTo({
             url:`/pages/packageA/pages/payLottery/main`
          })
        }
      },
      get_award(goodsId) {
        let _self = this;
        let _data = {
          token: _self.token,
          id: goodsId
        };
        getSignIn(_data).then(sec => {
          comm.goodsDetail(_data,sec).then(res => {
            if(res.data.state == 1){
              var data = res.data;
              setStore('goodsDetail' , data);
              setStore('orderGoods' , data.lstBiGoodsInventory[0]);
              window.location.href = 'https://zst.tenzhao.com/zst-wap/app-shop/index.html#/awardOrder'
            }
          });
        })
      }
    },
    mounted(){
      let _self = this;
      _self.init();
    },
    async onReachBottom() {
        this.pageNum ++;
        this.getRecord();
    },
  }
</script>

<style lang="scss" scoped>
  .alertMsg-enter-active{
    animation: zoomIn .3s;
  }
  .alertMsg-leave-active{
    animation: zoomOut .3s;
  }
  .bg{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    //background: url($ctxpath + "/static/customImgs/common/empty.png") center 3rem no-repeat;
    //background-size: 3.32rem 3.32rem;
    .notData{
      font-size: 32rpx;
      position: absolute;
      top: 700rpx;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
  }
  .drawRecord{
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 8;
      font-size: 12px;
      .tan_box {
        position: absolute;
        top: 15%;
        left: 6%;
        z-index: 2;
        width: 658rpx;
        height: 843rpx;
        //background: url($ctxpath + "/static/customImgs/drawRecord/tan_bg.png") no-repeat;
        background-size: contain;
        text-align: center;
        img {
          display: block;
          width: 260rpx;
          height: 310rpx;
          margin: 220rpx auto 0;
        }
        .close {
          position: absolute;
          height: 56rpx;
          width: 56repx;
          top: 80rpx;
          right: 20rpx;
          z-index: 9;
          /*background: url("../../assets/imgs/common/close.png");*/
          background-size: 100%;
        }
        p {
          box-sizing: border-box;
          padding: 50rpx;
          font-size: 16px;
          margin: 15px 0 5px;
        }
        .btn {
          background: #fe054c;
          color: #fff;
          font-size: 14px;
          width: 300rpx;
          height: 80rpx;
          line-height: 80rpx;
        }
      }
    }
    .drawRecord-item{
      box-sizing: border-box;
      padding: 22rpx;
      border-bottom: 10rpx solid #f6f6f6;
      display: flex;
      justify-content: space-between;
      .thumb{
        width: 138rpx;
        height: 138rpx;
        border: 1px solid #e5e5e5;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .detail{
        width: 550rpx;
        height: 140rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .first{
          width: 100%;
          display: flex;
          justify-content: space-between;
          .awardName{
            width: 407rpx;
            height: 75rpx;
            font-size: 28rpx;
            font-weight: bold;
          }
          .right{
            display: flex;
            flex-direction: column;
            .status{
              color: #f7094d;
              font-size: 28rpx;
            }
            .state{
              font-size: 28rpx;
              color: #f7094d;
            }
          }
          .notGet{
            color: #8d8e98;
          }
        }
        .second{
          font-size: 28rpx;
          color: #8d8e98;
        }
      }
    }
  }
  .noData{
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:330rpx;
    flex-direction: column;
    img{
      width:400rpx;
      height:400rpx;
      display: block;
    }
  }
</style>
