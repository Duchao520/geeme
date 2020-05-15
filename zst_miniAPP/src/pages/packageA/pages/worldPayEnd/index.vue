<template>
    <div class="page">
       <div class="page_top">
            <div class="page_img">
                <div class="page_module">
                    <i class="iconfont icon-dingdangdaiduigou"></i>
                </div>
            </div>

             <div class="page_text">
                成功充值话呗{{money}}元
             </div>
             <div class="page_title">
                账户余额{{totalMoney}}元
             </div>
       </div>

        <div class="page_bot">
            <div class="page_inner">
               <div class="page_order">
                  <div>订单编号：{{timestamp}}</div>
                  <div>订单时间：{{currentTime}}</div>
                  <div>支付方式：话呗卡充值</div>
               </div>
            </div>
        </div>

        <div class="page_mid">
           <div class="mid_inner" style="border-bottom:4rpx solid #eeeeee;padding-bottom:20rpx;" @click="goShop">
              <div class="mid_left">
                  <div class="mid_top">话呗二维码</div>
                  <div class="mid_bot">参与商家优惠活动</div>
              </div>
              <div class="mid_right">
                  <i class="iconfont icon-iconfontjiantou5"></i>
              </div>
           </div>


          <div class="mid_inner" style="padding-top:20rpx;" @click="goOther">
            <div class="mid_left">
              <div class="mid_top">助商通商家</div>
              <div class="mid_bot">查看更多商家活动</div>
            </div>
            <div class="mid_right">
              <i class="iconfont icon-iconfontjiantou5"></i>
            </div>
          </div>
        </div>

       <div class="btn_btn" @click="closePage">
         <div class="btn_inner">
           关 闭
         </div>
       </div>
    </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
    export default {
        name: "index",
        data(){
          return {
            totalMoney:'',
            money:'',
            timestamp:'',
            currentTime:''
          }
        },
       mounted(){
          var par =getQuery();
          console.log('11111',par);
          this.totalMoney = par.totalmoney;
          this.money = par.money;
          this.getCurrTime();
       },
       methods:{
         closePage(){
           wx.switchTab({
             url:'../../../../pages/index/main'
           })
         },
         goShop(){
            wx.redirectTo({
              url:'../../pages/qrPay/main'
            })
         },
         goOther(){
           wx.switchTab({
             url:'../../../../pages/nearbyShop/main'
           })
         },
         getCurrTime(){
           var timestamp = Date.parse(new Date());
           this.timestamp = timestamp;
           var n = timestamp ;
           var date = new Date(n);
           //年
           var Y = date.getFullYear();
           //月
           var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
           //日
           var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
           //时
           var h = date.getHours();
           //分
           var m = date.getMinutes();
           //秒
           var s = date.getSeconds();

           this.currentTime = `${Y}-${M}-${D} ${h}:${m}:${s}`
         }
       }
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  .page_top{
    width:100%;
    height:514rpx;
    background:linear-gradient(0deg,rgba(247,9,77,1),rgba(255,139,139,1));
    float: left;
    margin-top:20rpx;
    .page_img{
      width:100%;
      margin-top:78rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom:40rpx;
      .page_module{
        width:248rpx;
        height:248rpx;
        background:#fff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        i{
          font-size: 60rpx;
          color:#F7094D;
        }
      }
    }
    .page_text{
      width:100%;
      font-size: 36rpx;
      color:#fff;
      text-align: center;
    }
    .page_title{
      width:100%;
      font-size: 26rpx;
      text-align: center;
      color:#FDFF3E;
    }
  }
  .page_bot{
    width:710rpx;
    margin:0 20rpx;
    overflow: hidden;
    border-bottom:6rpx solid #eeeeee;
    .page_inner{
      padding:28rpx 0;
      .page_order{
        div{
          font-size: 26rpx;
          margin-bottom:10rpx;
        }
      }
    }
  }
  .page_mid{
    width:710rpx;
    margin:0 20rpx;
    padding:20rpx 0;
    .mid_inner{
      width:100%;
      height:98rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .mid_left{
        .mid_top{
          font-size: 26rpx;
          color:#000;
          font-weight: 700;
        }
        .mid_bot{
          font-size: 26rpx;
          color:rgba(0,0,0,0.6);
          font-weight: 700;
        }
      }
    }
  }
  .btn_btn{
    width:100%;
    height:90rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:20rpx;
    .btn_inner{
      width:630rpx;
      height:90rpx;
      border-radius: 6rpx;
      line-height: 90rpx;
      text-align: center;
      background:linear-gradient(0deg,rgba(247,9,77,1),rgba(255,139,139,1));
      color:#fff;
    }
  }
}
</style>
