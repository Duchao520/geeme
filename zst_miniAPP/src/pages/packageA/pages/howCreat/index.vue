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
              '在您创建共享卡时，可设置分享人佣金。比如：你设置了分享人佣金为10%，您的好友或者您将这张共享卡发布到门店，则看到这张共享卡的人将此卡分享给他他们的好友，他们好友使用了这张共享卡在该卡所属商家进行了消费，则分享这样卡的人可赚取差价10%的佣金；设置分享佣金，会让更多的人帮你分享。',
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
