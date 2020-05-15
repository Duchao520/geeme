<template>
  <div class="checkSale">
    <div style="border-bottom: 10rpx solid #EEEEEE;">
      <section class="box_padding flex_box justify_space_between"
               style="padding: 24rpx;">
        <img :src="detailMes.imgUrl" alt="" class="thumb">
        <div class="flex_box flex_column justify_space_between"
             style="width: 475rpx">
          <p class="fz-30 txt-overflow" style="margin-bottom:10rpx;">{{detailMes.goodsName}}</p>
          <p v-if="detailMes.goodsRemark" style="color:#8D8E98;font-size: 24rpx;">{{detailMes.goodsRemark}}</p>
          <div>
            <p class="iconfont icon-renminbi fz-48 font-weight fc-F7094D">{{detailMes.singlePrice}} <span  class="fc-8D8E98" style="text-decoration: line-through;font-size: 24rpx;">门市价：{{detailMes.originalPrice}}</span></p>

          </div>
        </div>
      </section>
      <div style="padding:0 20rpx;padding-bottom:20rpx;">
        <span style="font-size: 24rpx;color:#8D8E98;">规格:</span>
        <span style="font-size: 22rpx;color:#8D8E98;background:rgba(232,232,232,1);padding:12rpx 20rpx;border-radius: 20rpx">{{detailMes.specParamsName}}</span>
      </div>
    </div>
    <section class="box_padding"
             style="padding: 46rpx 20rpx;padding-bottom:0;border-bottom: 5px solid #EEEEEE;">
      <div class="fz-38" style="margin-bottom: 30rpx">
        核销码 ID:{{detailMes.writeOffCode}}
      </div>
      <canvas v-if="detailMes.writeOffState==0" style="width:420rpx;height:420rpx;background: #eeeeee;margin-bottom: 50rpx;" canvas-id="qrcode" class="qr"/>
      <div><img style="width:420rpx;height:420rpx;display: block;" v-if="detailMes.writeOffState==1" src="../../static/img/hasused.png" alt="" class="qr"></div>
      <p class="text-center" style="margin-bottom: 60rpx;">
        <span class="fz-24 font-weight">使用说明:</span>
        <span class="fz-24" style="color:#F60F51;">到店后向商家出示核销码，领取相关奖励并核销</span>
      </p>
    </section>
    <section class="box_padding" style="padding: 23rpx 30rpx;border-bottom: 10rpx solid #EEEEEE;">
      <p class="fz-36" style="margin-bottom: 45rpx;display:flex;"><i class="iconfont icon-dianpu fz-36" style="color: #D2D2D2;margin-right: 12rpx;"></i><span>商家信息</span></p>
      <div style="display: flex;justify-content: space-between;align-items: center;">
        <div>
            <div class="flex_box align_center" @click="toStore">
              <p class="fz-30 txt-ellipsis" style="margin-right: 12rpx;max-width: 600rpx;">{{detailMes.shopName}}</p>
              <i class="iconfont icon-iconfontjiantou5 fz-30" style="color: #D2D2D2"></i>
            </div>

            <div class="flex_box align_center">
              <p class="fz-30 txt-ellipsis" style="margin-right: 12rpx;width: 480rpx;">{{detailMes.unitAddress}}</p>
            </div>
        </div>
      <div style="display: flex;">
        <span style="padding-right:16rpx;border-right:2rpx solid #eee;display: flex;" @click="formSubmit(detailMes)"><i class="iconfont icon-daohangguanli01" style="color:#8D8E98;margin-right:10rpx;"></i><i>{{detailMes.distance}}km</i></span>
        <i class="iconfont icon-dianhua fz-36 fc-F7094D" style="margin-left:16rpx;" @click="phone(detailMes.contactPhone)"></i>
      </div>
      </div>
    </section>
    <section class="box_padding"
             style="padding: 46rpx 20rpx;padding-bottom:0;border-bottom: 5px solid #EEEEEE;overflow: hidden;">
      <div class="fz-38" style="margin-bottom: 30rpx">
        订单详情
      </div>
      <div class="all_mes">
        <div class="eve_order">
          订单号:{{detailMes.orderNum}}
        </div>
        <div class="eve_order">
          手机号:{{detailMes.contactPhone}}
        </div>
        <div class="eve_order">
          付款时间:{{detailMes.createTime}}
        </div>
        <div class="eve_order">
          数量:{{detailMes.goodsCount}}
        </div>
      </div>
      <div class="bot_bot" style="float: right;padding:24rpx 0;">
         <span style="color:#F60F51;font-size: 26rpx;float: right;">实付金额：￥{{detailMes.orderTotalPrice}}</span>
         <span style="font-size: 26rpx;float: right;margin-right:20rpx;">订单总价：￥{{detailMes.goodsTotalPrice}}</span>
      </div>
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
    data(){
      return{
        orderNum:'',
        detailMes:'',
        writeOffState:0,
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
    mounted(){
      var par = getQuery();
      console.log(par);
      this.orderNum = par.orderNum;
      this.getCodeMes();
      this.getState();
    },
    methods:{
      getCodeMes(){
        var _data = {
          token:this.$store.state.token,
          orderNum:this.orderNum,
          lng:this.$store.state.lng,
          lat:this.$store.state.lat
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getOffCode(_data,sec).then(res=>{
            if(res.state==1) {
              res.data.createTime = toDate(Number(res.data.createTime)*1000);
              _this.detailMes = res.data;
              _this.writeOffState =res.data.writeOffState;
              wxbarcode.qrcode('qrcode', `${res.data.writeOffCode}`, 420, 420);
            }else if(res.state==916416){
              this.isUse=1;
            }
          })
        })
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
      phone(par){
        var _this = this;
        if(par){
          wx.makePhoneCall({
            phoneNumber:par  //仅为示例，并非真实的电话号码
          })
        }else{
          Tips.toast('该商家暂未提供手机号','none')
        }
      },
      formSubmit(par) {
        var _this = this;
        wx.getLocation({//获取当前经纬度
          type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: Number(par.latitude),//要去的纬度-地址
              longitude: Number(par.longitude),//要去的经度-地址
              name: par.unitAddress,
              address: par.unitAddress
            })
          }
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
    .all_mes{
       border-bottom:2rpx solid #eeeeee;
       padding-bottom:20rpx;
    }
    .eve_order{
      padding-left:30rpx;
      font-size:24rpx;
    }
  }
</style>
