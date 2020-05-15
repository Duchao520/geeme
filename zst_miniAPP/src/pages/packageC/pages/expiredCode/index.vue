<template>
  <div class="checkSale">
    <section class="box_padding flex_box justify_space_between"
             style="padding: 24rpx;border-bottom: 10rpx solid #EEEEEE">
      <img :src="bargainImg" alt="" class="thumb">
      <div class="flex_box flex_column justify_space_between"
           style="width: 475rpx">
        <p class="fz-30 txt-overflow">{{bargainTitle}}</p>
        <div class="flex_box justify_space_between align_center">
          <p class="iconfont icon-renminbi fz-48 font-weight fc-F7094D">{{taskPrice}}{{prentPrice}} <span  class="fc-8D8E98" style="text-decoration: line-through;font-size: 24rpx;">{{price}}</span></p>
          <p class="fz-24 fc-F7094D">X{{helperNum}}</p>
        </div>
      </div>
    </section>
    <section class="box_padding"
             style="padding: 58rpx 0">
      <p class="text-center fz-36"
         style="margin-bottom: 38rpx">核销码</p>
      <p class="text-center fz-48"
         style="margin-bottom: 45rpx">{{useCode}}</p>
      <img src="../../static/img/guoqi.png" alt="" class="qr">
    </section>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import wxbarcode from 'wxbarcode'
  export default {
    name: "checkSale",
    onUnload(){
      this.closeCurentPage = 'close';
    },
    mounted(){
      var par = getQuery();
      this.bargainTasksId = par.bargainTasksId;
      this.bargainTitle = par.bargainTitle;
      this.helperNum = par.helperNum;
      this.taskPrice = par.taskPrice;
      this.bargainImg = par.bargainImg;
      this.price = par.price;
      this.prentPrice = par.prentPrice;
      this.getCodeMes();
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
              console.log('看看这个', res);
              _this.isUse = res.data.isUse;
              _this.useCode = res.data.useCode;
              wxbarcode.qrcode('qrcode', `${res.data.useCode}`, 420, 420);
            }else if(res.state==916416){
              this.isUse=1;
            }
          })
        })
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
  }
</style>
