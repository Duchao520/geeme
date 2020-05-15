<template>
  <div class="svipRules">
    <div class="module" v-for="(module,idx) in modules" :key="idx">

      <div class="module-title fl-l">
        <span class="title_num">{{idx+1}}</span>
        <span style="display: block;float: left;margin-left:0.1rem;">{{module.title}}</span>
      </div>
      <!--<div class="clearfix"></div>-->
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
            title: '如何创建共享卡赚钱？',
            lists: [
              '第1步：首先你需要是助商通联盟商家的卡主（通过参加联盟商家预充值活动成为卡主）；',

              '第2步：当卡主的会员折扣小于9.4折后，就可以创建助商通共享卡，比如您的卡主折扣为8.0折，则您可以创建折扣为8.5折的共享卡。',

              '第3步：将创建的共享卡发布到平台，其他会员就可以在该卡主所属的联盟商家的门店里看到你发布的共享卡，如果他使用您发布的共享卡进行消费，您就可以或者消费差价的奖励。',

              '第4步：消费差价直接转入助商通可提现账户，您就可以通过微信或支付宝进行提现。'
            ]
          }
        ]
      }
    },
    mounted(){

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
