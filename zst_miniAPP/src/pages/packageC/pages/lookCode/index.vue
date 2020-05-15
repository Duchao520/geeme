<template>
  <div class="checkSale">
    <section class="box_padding flex_box justify_space_between"
             style="padding: 24rpx;border-bottom: 10rpx solid #EEEEEE">
      <img :src="bargainImg" alt="" class="thumb">
      <div class="flex_box flex_column justify_space_between"
           style="width: 475rpx">
        <p class="fz-30 txt-overflow">{{bargainTitle}}</p>
        <div class="flex_box justify_space_between align_center">
          <p class="iconfont icon-renminbi fz-48 font-weight fc-F7094D">{{prentPrice}} <span  class="fc-8D8E98" style="text-decoration: line-through;font-size: 24rpx;">{{price}}</span></p>
          <p class="fz-24 fc-F7094D">X{{helperNum}}</p>
        </div>
      </div>
    </section>
    <section class="box_padding" style="padding: 23rpx 30rpx;border-bottom: 10rpx solid #EEEEEE">
      <p class="fz-36 text-center" style="margin-bottom: 45rpx">商家信息</p>
      <div class="flex_box align_center" @click="toStore">
        <i class="iconfont icon-dianpu fz-36" style="color: #D2D2D2;margin-right: 12rpx;"></i>
        <p class="fz-30 txt-ellipsis" style="margin-right: 12rpx;max-width: 600rpx;">{{storeName}}</p>
        <i class="iconfont icon-iconfontjiantou5 fz-30" style="color: #D2D2D2"></i>
      </div>
      <div class="flex_box align_center">
        <i class="iconfont icon-dizhi fz-36" style="color: #D2D2D2;margin-right: 12rpx;"></i>
        <p class="fz-30 txt-ellipsis" style="margin-right: 12rpx;width: 600rpx;">{{address}}</p>
        <i class="iconfont icon-dianhua fz-36 fc-F7094D" @click="phone"></i>
      </div>
    </section>
    <section class="box_padding"
             style="padding: 46rpx 20rpx">
      <div class="fz-38 text-center" style="margin-bottom: 30rpx">
        核销码 {{useCode}}
      </div>
      <canvas style="width:420rpx;height:420rpx;background: #eeeeee;margin-bottom: 50rpx;" canvas-id="qrcode" class="qr"/>
      <p class="text-center" style="margin-bottom: 60rpx;">
        <span class="fz-24 font-weight">使用说明:</span>
        <span class="fz-24">到店后向商家出示核销码，领取相关奖励并核销</span>
      </p>

      <div class="wardDesc box_padding fz-28" style="padding: 66rpx 17rpx 24rpx;">
        <i class="fz-24 fc-ffffff text-center">领奖说明</i>
        {{description}}
      </div>
    </section>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import Tips from '@/common/js/tips';
  import comment from './comment'
  import wxbarcode from 'wxbarcode'
  export default {
    name: "checkSale",
    components: {
      comment
    },
    onUnload(){
      this.closeCurentPage = 'close';
      if(this.timer1){
        clearInterval(this.timer1);
      }
    },
    mounted(){
       var par = getQuery();
       this.bargainTasksId = par.bargainTasksId;
       this.bargainTitle = par.bargainTitle;
       this.helperNum = par.helperNum;
       this.bargainImg = par.bargainImg;
       this.price = par.price;
       this.prentPrice = par.prentPrice;
        this.storeName = par.storeName;
        this.address = par.address;
        this.shopTel = par.shopTel;
        this.storeId = par.storeId;
        this.description = par.description;
       this.getCodeMes();
       this.getState();
    },
    data(){
      return{
        bargainTasksId: '',
        bargainTitle:'',
        helperNum:'',
        taskPrice:'',
        bargainImg:'',
        isUse:0,
        count1:'',
        timer1:'',
        closeCurentPage:'',
        useCode:'',
        bargainId:'',
        price:'',
        prentPrice:'',
        storeName: '',
        address: '',
        shopTel: '',
        storeId: '',
        description: ''
      }
    },
    methods:{
      getCodeMes(){
        var _data = {
          token:this.$store.state.token,
          bargainTasksId:this.bargainTasksId,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
           _this.$http.bargainTaskswrteoff(_data,sec).then(res=>{
             if(res.state==1) {
               _this.isUse = res.data.isUse;
               if(_this.isUse == 1){
                 wx.redirectTo({
                   url:`/pages/packageC/pages/commonPage/main?bargainTasksId=${_this.bargainTasksId}&bargainTitle=${_this.bargainTitle}&helperNum=${_this.helperNum}&bargainImg=${_this.bargainImg}&price=${_this.price}&prentPrice=${_this.prentPrice}`,
                 })
               }
               _this.useCode = res.data.useCode;
               _this.bargainId = res.data.bargainId;
               wxbarcode.qrcode('qrcode', `${res.data.useCode}`, 420, 420);
             }else if(res.state==916416){
                 this.isUse=1;
                 clearInterval(this.timer1);
             }else{
               Tips.toast(`${decodeURIComponent(res.msg)}`);
             }
           })
        })
      },
      toStore(){
        var _self = this;
        wx.navigateTo({
          url:`/pages/packageB/pages/shopRecDet/main?shopStoreId=${_self.storeId}`,
        })
      },
      phone(){
        var _this = this;
        if(_this.shopTel){
          wx.makePhoneCall({
            phoneNumber:_this.shopTel  //仅为示例，并非真实的电话号码
          })
        }else{
          Tips.toast('该商家暂未提供手机号','none')
        }
      },
      getState(){
        const TIME_COUNT = 3;
        this.count1 = TIME_COUNT;
        this.timer1 = setInterval(() => {
          if (this.count1 > 0 && this.count1 <= TIME_COUNT) {
            this.count1--;
          } else {
            clearInterval(this.timer1);
            if(this.isUse ==1){
              return false;
            }else if(this.closeCurentPage == 'close'){
              clearInterval(this.timer);
              return false
            }else{
              this.getCodeMes();
              this.getState();
            }
          }
        }, 1000)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .checkSale{
    .thumb{
      display: block;
      width: 200rpx;
      height: 200rpx;
      border-radius: 20rpx;
      background: #0d0d0f;
    }
    .qr{
      display: block;
      width: 420rpx;
      height: 420rpx;
      margin: 0 auto;
    }
    .wardDesc{
      position: relative;
      background: #F4F5F6;
      i{
        width:124rpx;
        height:41rpx;
        display: block;
        background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
        border-radius:2rpx 0 10rpx 10rpx;
        position: absolute;
        top: 0;
        left: 12rpx;
        line-height: 41rpx;
      }
    }
  }
</style>
