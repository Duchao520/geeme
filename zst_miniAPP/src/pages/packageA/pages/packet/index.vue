<template>
  <div class="packet">
    <div class="bg" v-if="packetDetail">
      <div class="flex_box align_center" style="justify-content: center;margin-bottom: 100rpx;">
        <img :src="packetDetail.ico" alt="" class="logo">
        <p class="fz-36 fc-ffffff">{{packetDetail.nick}}的红包</p>
      </div>
      <div class="flex_box fc-ffffff align_center" style="justify-content: center;">
        <p style="font-size: 100rpx;">{{packetDetail.amount}}</p>
        <p class="fz-36">元</p>
      </div>
      <p class="fz-30 fc-ffffff text-center" style="margin: 20rpx;">{{packetDetail.sendType == 1 ? '已存入微信零钱,可直接转账' : packetDetail.sendType == 2 ? '已存入支付宝账户,可直接转账' : '已存入助商通账户,可提现使用'}}</p>
      <button class="download fz-38" @click="goDownLoad" v-if="packetDetail.sendType == 0">一键提现</button>
    </div>
    <div class="radius box_padding" style="margin-bottom: 39rpx;padding-top: 20rpx;" v-if="packetDetail">
      <p class="flex_box align_center fz-30 fc-ffffff" style="justify-content: center"
         @click="gowithDrawTeach"
         v-if="packetDetail.sendType == 0">提现教程<i class="iconfont icon-youjiantou"></i></p>
    </div>
    <div class="text-center fz-36 fc-0D0D0F title flex_box align_center">红包记录</div>
    <div class="box_padding" style="padding: 0 28rpx;">
      <div class="flex_box justify_space_between align_center"
           style="padding: 12rpx 0;border-bottom: 1rpx solid #E5E5E5"
           v-for="(item,index) in redenvelopesendlogs" :key="index">
        <div style="width: 500rpx">
          <div class="flex_box align_center">
            <p class="fz-36 txt-ellipsis" style="max-width: 460rpx;margin-right: 6rpx;">{{item.nick}}的红包</p>
            <span class="fz-24 fc-ffffff"
                  v-if="item.sendType == 1 || item.sendType == 2"
                  style="display:block;width:30rpx;height:30rpx;text-align:center;line-height30rpx;background:rgba(255,189,54,1);border-radius:6rpx;">超</span>
          </div>

          <p class="fz-24 fc-8D8E98">{{item.sendTime}}</p>
        </div>
        <p class="fz-36">{{item.amount}}元</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import Tips from '@/common/js/tips'
  import floatTo from '@/common/js/floatTo'
  export default {
    name: "index",
    data(){
      return {
        orderNum: '',
        payType: '',
        packetDetail: '',
        redenvelopesendlogs:[],
        formId: '',
        pageNum: 1,
        isNull: ''
      }
    },
    mounted(){
      var _self = this,par;
      par = getQuery();
      _self.orderNum = par.orderNum;
      _self.payType = par.payType;
      _self.formId = par.formId;
      _self.init();
    },
    methods:{
      init(){
        var _self = this;
        _self.getPacketDetail();
        _self.getRedEnvelopeList();
      },
      goLogin(){
        const url = `../../../../pages/loginpage/main`;
        wx.navigateTo({url})
      },
      goDownLoad(){
        wx.navigateTo({url:'/pages/packageD/pages/downApp/main'})
      },
      gowithDrawTeach(){
        wx.navigateTo({url:'/pages/packageA/pages/withdrawTeach/main'})
      },
      getPacketDetail(){
        var _self = this;
        var _data = {
          token: _self.$store.state.token ? _self.$store.state.token : '',
          orderNum: _self.orderNum ? _self.orderNum : '',
          payType: _self.payType ? _self.payType : '3',
          formId: _self.formId ? _self.formId : '',
          srcType: 2
        };
        getSignIn(_data).then(sec => {
          _self.$http.getPacketDetail(_data,sec).then(res => {
            if(res.state == 1){
              _self.packetDetail = res.data;
            }else if(res.state == 10000){
              _self.goLogin();
            }else{
              Tips.toast(decodeURIComponent(res.msg),'none')
            }
          })
        })
      },
      getRedEnvelopeList(){
        var _self = this;
        var _data = {
          token: _self.$store.state.token ? _self.$store.state.token : '',
          pageNum: _self.pageNum,
          pageSize: 20
        };
        getSignIn(_data).then(sec => {
          _self.$http.getRedEnvelopeList(_data,sec).then(res => {
            if(res.state == 1){
              if(res.data){
                res.data.forEach(ele => {
                  ele.sendTime = toDate(Number(ele.sendDate)*1000);
                });
                _self.redenvelopesendlogs = _self.redenvelopesendlogs.concat(res.data);
              }else{
                _self.isNull = 1;
              }
            }else if(res.state == 10000){
              _self.goLogin();
            }else{
              Tips.toast(decodeURIComponent(res.msg),'none')
            }
          })
        })
      }
    },
    onReachBottom(){
      if(!this.isNull){
        this.pageNum++;
        this.getRedEnvelopeList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .packet{
    .bg{
      width: 100%;
      height: 550rpx;
      background: #F82058;
      box-sizing: border-box;
      padding: 48rpx 0;
      .logo{
        display: block;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: #0d0d0d;
        margin-right: 20rpx;
      }
      .download{
        display: block;
        width: 300rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-weight: bold;
        border-radius: 40rpx;
        background:linear-gradient(0deg,rgba(255,140,24,1),rgba(253, 192, 117, 1));
        box-shadow:0 6rpx 16rpx 5rpx rgba(198,27,0,0.54);
        color: #753E05;
        margin: 0 auto;
      }
    }
    .radius{
      width: 100%;
      height: 99rpx;
      background: #F82058;
      border-radius: 0 0 50% 50%;
    }
    .title{
      justify-content: center;
      margin-bottom: 20rpx;
    }
    .title::before,.title::after{
      content: '';
      display: block;
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: #F7094D;
      margin: 0 12rpx;
    }
  }
</style>
