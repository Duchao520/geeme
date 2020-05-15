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

    <div class="footer_btn">
      <div class="foot_left">
        详细了解卡主，可拨打助商通全国客服热线
      </div>
      <div class="foot_right" @click="boda">
        <a href="tel:400-8090-775">400-8090-775</a>
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
            title: '卡主是什么？',
            lists: [
              `您可以理解为传统会员储值卡功能的电子化，享受
               助商通联盟商家超级VIP折扣，简称SVIP卡 , 拥有
               SVIP卡的用户，助商通平台称之为卡主；`
            ]
          },
          {
            title: '卡主有哪些优势？',
            lists: [
              '1、会员不担心充值的压力，不担心消费不完；',
              '2、传统储值卡需要携卡或者报手机号码消费，卡主 不需要，只要一部手机，统统搞定；',
              '3、传统储值卡只能自己消费，因此不是高频消费场；',
              '4、SVIP卡可分享到微信使用，不需要安装助商通；'
            ]
          },
          {
            title: '如何成为卡主？及如何收益？',
            lists: [
              '1、卡主的招募者为助商通联盟商家，若您熟悉的商家还没有加入助商通联盟商家，您可以推荐他加入联盟商家，入驻成功，您可获得300元/家奖励；',
              '2、联盟商家需在后台设置预充值活动，前提是助商通联盟商家需要开通收银通道，即可在助商通平台发布招募卡主的信息；',
              '3、到店消费的助商通会员可参加招募卡主活动，充值成功获得一张卡主会员卡（SVIP卡），自己使用可以享受超级VIP折扣；',
              '4、卡主可以自己创建卡主共享卡,可自主设置共享卡折扣，设置分享佣金，可分享给微信好友或发布到平台；'
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
