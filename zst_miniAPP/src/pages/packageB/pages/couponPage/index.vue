<template>
   <div class="page">
      <div class="page_coupon">
          <div class="eve_coupon" v-for="item in dataList" :key="item.shopStore.id" @click="goPay(item)">
              <div class="eve_le">
                <img src="/static/img/common/couponle.png" alt="">
                <div class="eve_le_inner">
                  <div class="eve_le_top">
                     <span style="font-size: 30rpx;">￥</span><span style="font-size: 50rpx;">{{item.couponMoney}}</span>
                  </div>
                  <div class="eve_le_bot" v-if="item.couponType==1">
                     满{{item.consumeMoney}}元可用
                  </div>
                  <div class="eve_le_bot" v-if="item.couponType==2">
                      现金券
                  </div>
                </div>
              </div>

              <div class="eve_ri">
                  <div class="eve_ri_top">{{item.couponTitle}}</div>
                  <div class="eve_ri_mid">
                     <div class="mid_inner">{{item.startDate}}-{{item.endDate}}</div>
                     <div class="mid_inner">0.11km</div>
                  </div>
                  <div class="eve_ri_bot">{{item.shopStore.storeName}}</div>
              </div>
          </div>
      </div>
   </div>
</template>

<script>
    import { getSignIn , getQuery } from '@/common/js/comm';
    import Tips from '@/common/js/tips';
    import { mapMutations } from 'vuex';
    import { ID, COUPONNUM, CARDCOUPONACTIVEID ,ISCOUPON}  from '@/store/mutation-types';
    export default {
        name: "index",
        data(){
          return {
             dataList:{},
             shopStoreId:'',
             sharecardId:'',
             totalMoney:'',
          }
        },
        mounted(){
          var par = getQuery();
          this.shopStoreId = par.shopStoreId;
          this.sharecardId = par.sharecardId;
          this.totalMoney = par.totalMoney ? par.totalMoney:'';
          this.getcoupon();
        },
        methods:{
          ...mapMutations({
            id:'ID',
            couponNum:'COUPONNUM',
            cardCouponActiveId:'CARDCOUPONACTIVEID',
            isCoupon:'ISCOUPON',
          }),
          getcoupon(){
            var _data = {
              token:this.$store.state.token,
              pageNum:1,
              limit:20,
              state:2,
              longitude:this.$store.state.lng,
              latitude:this.$store.state.lat,
              shopStoreId:this.shopStoreId,
            }
            var _this = this;
            getSignIn(_data).then(sec=>{
              _this.$http.getCouponList(_data,sec).then(res=>{
                 console.log(res);
                 if(res.state ==1){
                   for(let i=0;i<res.data.length;i++){
                     res.data[i].startDate = (res.data[i].startDate)
                     res.data[i].endDate = (res.data[i].endDate)
                   }
                    _this.dataList = res.data;
                 }else{
                   Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                 }
              })
            })
          },
          goPay(par){
            var _this = this;
            console.log('看下参数',par);
            let id = Number(par.id);
            let couponNum = Number(par.couponNum);
            let cardCouponActiveId = par.cardCouponActiveId;
            this.id(id);
            this.couponNum(couponNum);
            this.cardCouponActiveId(cardCouponActiveId);
            this.isCoupon(1);
            //判断是否有优惠券

            wx.navigateBack({
              delta: 1
            })
          }
        }
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  position: absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  background:#f6f6f6;
  .page_coupon{
    width:710rpx;
    margin:0 20rpx;
    margin-top:40rpx;
    float: left;
    .eve_coupon{
      background:#fff;
      width:100%;
      height:186rpx;
      display: flex;
      justify-content: space-between;
      border-radius: 10rpx;
      box-shadow:1rpx 1rpx 30rpx rgba(0, 0, 0, 0.2);
      margin-bottom:20rpx;
      .eve_le{
        width:240rpx;
        height:186rpx;
        position: relative;
        img{
          width:100%;
          height:100%;
          display: block;
        }
        .eve_le_inner{
          width:240rpx;
          height:186rpx;
          position: absolute;
          left:0;
          top:0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color:#fff;
          .eve_le_top{
            color:#fff;

          }
          .eve_le_bot{
            font-size: 24rpx;
          }
        }
      }
      .eve_ri{
        width:430rpx;
        height:166rpx;
        padding:20rpx;
        .eve_ri_top{
          font-size: 28rpx;
          margin-bottom:6rpx;
        }
        .eve_ri_mid{
          font-size: 22rpx;
          border-bottom:2rpx dashed rgba(0,0,0,0.3);
          padding-bottom:4rpx;
          color:#c4c4c4;
          .mid_inner{

          }
        }
        .eve_ri_bot{
          font-size: 24rpx;
          line-height: 48rpx;
          color:rgba(0,0,0,0.6);
        }
      }
    }
  }
}
</style>
