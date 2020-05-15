<template>
  <div class="svipRules">
    <div class="module" v-for="(module,idx) in modules" :key="idx">

      <div class="module-title fl-l">
        <span class="title_num">{{idx+1}}</span>
        <span style="display: block;float: left;margin-left:0.1rem;">{{module.title}}</span>
      </div>
      <div class="module-item" v-for="(item,index) in module.lists" :key="index">
        {{item}}
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: "svipRules",
    data(){
      return{
        modules: [
          {
            title: '话呗抵扣是什么？',
            lists: [
              `通过助商通APP，助商通卡或在线充值助商通话呗，在助商通联盟商家消费，可通过话呗二维码进行活动抵扣活动，具体抵扣额度由助商通商家自行设定，在助商通联盟商家消费，使用【话呗抵扣】后，话呗总余额会根据商家活动抵扣金额做出相应的扣除`
            ]
          },
          {
            title: '如何使用助商通二维码？',
            lists: [
              '用户在助商通联盟商家消费结算前，可点开【话呗二维码】向商家展示二维码或条形码，商家使用收银扫码枪（或商家版APP）快速扫描用户的二维码（或条形码）即可完成话呗抵扣，话呗抵扣后，页面会跳转至结算单详情，扣掉话呗抵扣的金额后，剩下的金额可通过支付宝支付、微信支付或现金支付进行余额结算。'
            ]
          },

          {
            title: '在哪些商户可以使用话呗抵扣：',
            lists: [
             '该商家必须是助商通联盟商家。'
            ]
          },
          {
            title: '话呗抵扣安全及用户条款：',
            lists: [
             'a.二维码/条形码具有时效性且一次有效',
             'b.每个账户余额只跟该账户绑定',
             'c.安全系统会对可以交易进行拦截',
            ]
          },
        ]
      }
    },
    mounted(){

    },
    methods:{
      boda(){
        wx.makePhoneCall({
          phoneNumber: '400-8090-775'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .svipRules{
    box-sizing: border-box;
    padding: 35rpx;
    .module{
      width: 100%;
      margin-bottom: 40rpx;
      .module-title{
        font-size: 30rpx;
        color: #000000;
        font-weight: 600;
        border-radius: 25rpx;
        margin-bottom:20rpx;
        display: flex;
        align-items: center;
        overflow: hidden;
        .title_num{
          width: 38rpx;
          height: 38rpx;
          background:linear-gradient(to left,rgba(250,205,137,1),rgba(255,232,183,1));
          border-radius: 50%;
          font-size: 24rpx;
          float: left;
          color:#0D0D0F;
          display:flex;
          justify-content: center;
          align-items: center;
          margin-right:10rpx;
        }
      }
      .module-item{
        font-size: 28rpx;
        color: #343C53;
        line-height: 48rpx;
        padding-left:45rpx;
      }
    }
    .footer_btn{
      width:100%;
      height:60rpx;
      line-height: 60rpx;
      background:#ff6700;
      .foot_left{
        float: left;
        width:70%;
        height:100%;
        font-size: 24rpx;
        text-align: center;
        color:#fff;
        background:linear-gradient(173deg,rgba(219,153,118,1),rgba(127,80,44,1));
      }
      .foot_right{
        float: left;
        width:30%;
        background:#1B1B1B;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        a{
          display: block;
          font-size: 28rpx;
          color:#fff;
          -webkit-background-clip:text;
        }
      }
    }
  }
</style>
