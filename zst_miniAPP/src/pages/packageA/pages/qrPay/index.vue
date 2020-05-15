<template>
    <div class="page">
       <div class="qrCode">
          <div class="qrCode_inner">
              <div class="qrCo_top">
                <img src="../../static/img/dui.png" alt="">
                <span style="color:#ff746f;">向商家付款前请出示</span>
              </div>
              <div class="barCode">
                <div class="barCode_img">
                  <canvas style="width: 578rpx; height: 180rpx;"  canvas-id="barcode" />
                </div>
              </div>

            <div class="bar_num">
               {{qrNumber}}
            </div>

            <div class="bar_code">
                <div class="bar_code_img">
                  <canvas style="width:358rpx;height:358rpx;" canvas-id="qrcode" />
                </div>
            </div>

            <div class="bar_notice">
               <div class="bar_icon" @click="newCode">
                  <i class="iconfont icon-shuaxin"></i>
                  <span>每一分钟刷新一次，请当面使用勿泄露</span>
               </div>
            </div>

            <div class="look_de">
                <div style="font-size: 30rpx;">话呗使用规则请点击 <span style="color: #F7094D;" @click="godetail">查看详情</span> </div>
                <div style="font-size: 24rpx;">仅限助商通联盟商家使用</div>
            </div>
          </div>
       </div>

    </div>
</template>

<script>
    import { getSignIn , getQuery} from '@/common/js/comm';
    import Tips from '@/common/js/tips';
    import wxbarcode from 'wxbarcode'
    export default {
        name: "index",
        data(){
          return {
            qrNumber:'',
            count: '',

            count1:'',
            payState:'',
            closeCurentPage:''
          }
        },
       onShow(){
         this.getErwei();
         setTimeout(() => {
            this.getErwei();
          },100);
         this.getCode();
         this.getState();
       },

        onUnload(){
            this.closeCurentPage = 'close';
           if(this.timer) {
             clearInterval(this.timer);
           }
           if(this.timer1){
             clearInterval(this.timer1);
           }
        },
        methods:{
          getErwei(){
            var _data = {
              token:this.$store.state.token,
              activeType:1
            }
            var _this = this;
            console.log(_data);
            getSignIn(_data).then(sec=>{
               Tips.loading('生成中');
              _this.$http.getParCode(_data,sec).then(res=>{
                console.log(res);
                _this.qrNumber = res.data;
                 wxbarcode.barcode('barcode', `${res.data}`, 578, 180);
                 wxbarcode.qrcode('qrcode', `${res.data}`, 358, 358);
                 Tips.loaded();
                _this.getScanData();
              })
            })
          },
          newCode(){
            this.getErwei();
            this.getCode();
          },
          getCode(){
            const TIME_COUNT = 60;
            this.count = TIME_COUNT;
            var _this =this;
            _this.timer = setInterval(() => {
              if (_this.count > 0 && _this.count <= TIME_COUNT) {
                _this.count--;
                console.log(_this.count);
              } else {
                clearInterval(_this.timer);
                if(_this.payState ==3){
                  return false;
                }else if(_this.closeCurentPage == 'close'){
                  clearInterval(_this.timer);
                  return false
                }else{
                  this.getErwei();
                  this.getCode();
                }
              }
            }, 1000)
          },
          getState(){
            const TIME_COUNT = 3;
            this.count1 = TIME_COUNT;
            this.timer1 = setInterval(() => {
              if (this.count1 > 0 && this.count1 <= TIME_COUNT) {
                this.count1--;
              } else {
                clearInterval(this.timer1);
                if(this.payState ==3){
                    return false;
                }else if(this.closeCurentPage == 'close'){
                  clearInterval(this.timer);
                  return false
                }else{
                  this.getScanData();
                  this.getState();
                }
              }
            }, 1000)
          },
          godetail(){
            wx.navigateTo({
              url:'../../pages/lookSayDetail/main'
            })
          },
          getScanData(){
            var _data ={
              token:this.$store.state.token,
              barCode:this.qrNumber,
            }
            var _this = this;
            getSignIn(_data).then(sec=>{
              _this.$http.getScanState(_data,sec).then(res=>{
                console.log('看看这里有没有请求',res);
                _this.payState = res.data.state;
                if(res.data.state==2){
                  console.log('未消费');
                }else if(res.data.state == 3){
                  var par = res.data.order;
                  wx.redirectTo({
                      url:`../../pages/wxPublicPay/main?orderNum=${par.orderNum}&totalMoney=${par.totalMoney}&shouldPayMoney=${par.shouldPayMoney}&integralConvertCash=${par.integralConvertCash}&integralCount=${par.integralCount}&consumeTime=${par.consumeTime}&storeName=${par.storeName}&storeId=${par.storeId}&activeNum=${par.activeNum}&mercId=${par.payChannelStoreNum}&trmNo=${par.trmNo}&shopId=${par.shopId}`
                    })
                }
              })
            })

          },
        },

    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  position: absolute;
  left:0;right:0;
  bottom:0;top:0;
  margin:0;
  background:linear-gradient(-39deg,rgba(247,9,77,1),rgba(255,139,139,1));
  display: flex;
  justify-content: center;
  align-items: center;
  .qrCode{
    width:100%;
    padding:20rpx 0;
    display: flex;
    justify-content: center;
    .qrCode_inner{
       width:650rpx;
       height:100%;
       background:#fff;
       border-radius: 10rpx;
      .qrCo_top{
        width:360rpx;
        height:84rpx;
        margin-top:22rpx;
        margin-left:16rpx;
        margin-bottom:24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img{
          width:60rpx;
          height:60rpx;
        }
      }
      .barCode{
        width:100%;
        height:180rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom:22rpx;
        .barCode_img{
          width:578rpx;
          height:180rpx;
          background:#f2f2f2;
        }
      }
      .bar_num{
        width:100%;
        text-align: center;
        font-size:40rpx;
        margin-bottom:56rpx;
      }
      .bar_code{
        width:100%;
        height:358rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom:56rpx;
        .bar_code_img{
          width:358rpx;
          height:358rpx;
          background:#f2f2f2;
        }
      }
      .bar_notice{
        width:100%;
        display:flex;
        justify-content: center;
        border-bottom:2rpx solid rgba(229,229,229,1);
        padding-bottom:20rpx;
        .bar_icon{
          display:flex;
          justify-content: space-around;
          i{
            line-height: 34rpx;
            margin-right:10rpx;
          }
          span{
            font-size: 24rpx;
          }
        }
      }
      .look_de{
        width:100%;
        height:100rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding:20rpx 0;
      }
    }
  }
}
</style>
